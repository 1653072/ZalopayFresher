package RockPaperScissor.ControllerGRPC;

import java.math.BigInteger;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.lognet.springboot.grpc.GRpcService;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.protobuf.ByteString;
import com.quoctk.grpc.rps.BInteger;
import com.quoctk.grpc.rps.GameInfo;
import com.quoctk.grpc.rps.GameRequest;
import com.quoctk.grpc.rps.GameResponse;
import com.quoctk.grpc.rps.GameServiceGrpc;
import com.quoctk.grpc.rps.GameTurnInfo;
import com.quoctk.grpc.rps.ListGameInfo;
import com.quoctk.grpc.rps.ListGameTurnInfo;
import com.quoctk.grpc.rps.ListTopPlayers;
import com.quoctk.grpc.rps.TYPEGAMERPS;
import com.quoctk.grpc.rps.TopPlayers;

import RockPaperScissor.Class.StringDoublePair;
import RockPaperScissor.Controller.RpsController;
import RockPaperScissor.Model.Account;
import RockPaperScissor.Model.Game;
import RockPaperScissor.Model.GameTurn;
import RockPaperScissor.Repository.AccountRepository;
import RockPaperScissor.Repository.GameRepository;
import RockPaperScissor.Repository.GameTurnRepository;
import io.grpc.stub.StreamObserver;

@GRpcService
public class GameRPSService extends GameServiceGrpc.GameServiceImplBase {
	
	@Autowired
	private AccountRepository accountRepo;
	
	@Autowired
	private GameRepository gameRepo;
	
	@Autowired
	private GameTurnRepository gameTurnRepo;
	
	private Map<String, BigInteger> curInfoMap = new HashMap<String, BigInteger>();
	
	private static final Logger LOGGER = LogManager.getLogger(RpsController.class);
	
	//-----------------------------------------------------------
	// FUNCTIONS
	//-----------------------------------------------------------	
	
	BInteger BigIntegerToGRPC(BigInteger val) {
	    BInteger.Builder builder = BInteger.newBuilder();
	    ByteString bytes = ByteString.copyFrom(val.toByteArray());
	    builder.setValue(bytes);
	    return builder.build();
	}
	
	BigInteger BIntGRPCToBigInteger(BInteger message) {
	    ByteString bytes = message.getValue();
	    return new BigInteger(bytes.toByteArray());
	}
	
	String DateToString(Date date) {
		DateFormat dateFormat = new SimpleDateFormat("yyyy-mm-dd hh:mm:ss");  
		return dateFormat.format(date);  
	}
	
	private byte playOfMachine() {
		//0: Kéo (Scissor)
		//1: Búa (Rock)
		//2: Bao (Paper)
        Random random = new Random();
        return (byte) random.nextInt(3);
    }
	
	private int checkUserResult(byte userResult, byte machineResult) {
		/* 
		 * Return 0: Hòa (No one wins)
		 * Return 1: User wins
		 * Return -1: User loses 
		*/
		
		if (userResult == machineResult) 
			return 0;
		
		switch (userResult) {
			case 0: //user: Kéo
			{
				if (machineResult == 1) return -1;
				else return 1;
			}
			case 1: //user: Búa
			{
				if (machineResult == 2) return -1;
				else return 1;
			}
			default: //user: Bao
			{
				if (machineResult == 0) return -1;
				else return 1;
			}
		}
    }	
	
	//-----------------------------------------------------------
	// MAPPING PATH
	//-----------------------------------------------------------
	
	public void gameRPS(GameRequest gameRequest, StreamObserver<GameResponse> responseObserver) {
		GameResponse response = null;
        switch (gameRequest.getType()) {
            case TOPPLAYERS:
                response = this.topplayers(gameRequest.getUser().getUsername());
                break;
            case GAMEHISTORY:
                response = this.gamehistory(gameRequest.getUser().getUsername());
                break;
            case PLAY:
                response = this.play(gameRequest);
                break;
            default:
                response = GameResponse.newBuilder().setNotice("Request type is inappropriate").build();
                LOGGER.error("Request type is inappropriate");
        }
        
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
	
	private GameResponse topplayers(String username) {
		List<StringDoublePair> result = gameRepo.findTop100WinRating();
		ListTopPlayers.Builder builder = ListTopPlayers.newBuilder();
		for (StringDoublePair sdp : result) {
			TopPlayers tp = TopPlayers.newBuilder().setUsername(sdp.getUsername()).setWinRating(sdp.getWinRating()).build();
			builder.addListTopPlayers(tp);
		}
		LOGGER.info("Username {}: Find top 100 winRating", username);
		return GameResponse.newBuilder().setType(TYPEGAMERPS.TOPPLAYERS).setListTopPlayers(builder).setNotice("Find top 100 winRating").build();
    }
	
	private GameResponse gamehistory(String username) {
		List<Game> gameList = gameRepo.findAllGamesByUsername(username);
		ListGameInfo.Builder builder = ListGameInfo.newBuilder();
		for (Game g : gameList) {
			GameInfo gi = GameInfo.newBuilder().setGameID(BigIntegerToGRPC(g.getId())).setGameResult(g.getGameResult()).setUsername(g.getAccount().getUsername()).setStartDate(DateToString(g.getStartDate())).build();
			builder.addListGameInfo(gi);
		}
		
		
		//Thiếu game turn list
		
		
		
		
		
		LOGGER.info("Username {}: Find all games", username);
		return GameResponse.newBuilder().setType(TYPEGAMERPS.GAMEHISTORY).setListGameInfo(builder).setNotice("Find all games").build();
    }
	
	private GameResponse play(GameRequest gameRequest ) {
		String username = gameRequest.getUser().getUsername();
		Account user = accountRepo.findById(username).get();
		
		Integer userChoose = gameRequest.getUserResult();
		byte userResult = userChoose.byteValue();
		
		// If curInfoMap contains key (username) => Game status is "No one wins, new turn is needed"
		// Else: add new username and start new game with new turn
		BigInteger currentGameID;
		if (!curInfoMap.containsKey(username)) // New game needs to be created
		{
			Game newGame = new Game();
			newGame.setAccount(user);
			newGame.setStartDate(new Date());
			newGame.setGameturns(null);
			newGame.setGameResult((byte) 0);
			newGame = gameRepo.save(newGame);
			LOGGER.info("Username {}: Create new game with id: {}", username, newGame.getId());
			
			currentGameID = newGame.getId();
			curInfoMap.put(username, currentGameID);
		}
		else // Last game has no one wins => Old game, new turn
		{
			currentGameID = curInfoMap.get(username);
		}
		
		byte machineResult = playOfMachine();
		int gameResultOfUser = checkUserResult(userResult, machineResult);
		Game gameInfo = gameRepo.findById(currentGameID).get();
		LOGGER.info("Username {}: Find game by id {}", username, gameInfo.getId());
		
		// User win => Update game result
		if (gameResultOfUser == 1) {
			gameInfo.setGameResult((byte) 1);
			gameRepo.save(gameInfo);
			LOGGER.info("Username {}: Update gameResult of gameID {}", username, gameInfo.getId());
		}
		
		// Add new game turn to DB
		GameTurn gt = new GameTurn();
		gt.setMachineResult(machineResult);
		gt.setUserResult(userResult);
		if (gameResultOfUser != 0) gt.setTurnType((byte) 0); //Loại tranh đấu (Thắng/Thua)
		else gt.setTurnType((byte) 1); //Loại hòa nhau
		gt.setTurnDate(new Date());
		gt.setGame(gameInfo);
		gameTurnRepo.save(gt);
		LOGGER.info("Username {} - GameID {}: New gameTurnID {} added to DB", username, gameInfo.getId(), gt.getId());
		
		// If user wins or loses => curInfoMap remove entry of this user
		if (gameResultOfUser == -1 || gameResultOfUser == 1) {
			curInfoMap.remove(username, currentGameID);
		}
		
		ListGameInfo.Builder builder = ListGameInfo.newBuilder();
		GameInfo gi = GameInfo.newBuilder().setGameID(BigIntegerToGRPC(gameInfo.getId())).setGameResult(gameInfo.getGameResult()).setUsername(gameInfo.getAccount().getUsername()).setStartDate(DateToString(gameInfo.getStartDate())).build();
		builder.addListGameInfo(gi);
		
		ListGameTurnInfo.Builder builder02 = ListGameTurnInfo.newBuilder();
		GameTurnInfo gti = GameTurnInfo.newBuilder().setTurnID(BigIntegerToGRPC(gt.getId())).setTurnDate(DateToString(gt.getTurnDate())).setUserResult(gameRequest.getUserResult()).setMachineResult(machineResult).setGameID(BigIntegerToGRPC(gt.getGame().getId())).build();
		builder02.addListGameTurnInfo(gti);
		
		return GameResponse.newBuilder().setType(TYPEGAMERPS.PLAY).setListGameInfo(builder).setListGameTurnInfo(builder02).setNotice("Result of game turn").build();
    }
}
