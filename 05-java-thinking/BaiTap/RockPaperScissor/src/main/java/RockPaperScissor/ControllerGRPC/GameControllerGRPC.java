package RockPaperScissor.ControllerGRPC;

import java.math.BigInteger;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.lognet.springboot.grpc.GRpcService;
import org.springframework.beans.factory.annotation.Autowired;

import com.google.protobuf.ByteString;
import com.quoctk.grpc.rps.BInteger;
import com.quoctk.grpc.rps.GameHistory;
import com.quoctk.grpc.rps.GameInfo;
import com.quoctk.grpc.rps.GameRequest;
import com.quoctk.grpc.rps.GameResponse;
import com.quoctk.grpc.rps.GameServiceGrpc;
import com.quoctk.grpc.rps.GameTurnInfo;
import com.quoctk.grpc.rps.ListGameHistory;
import com.quoctk.grpc.rps.ListGameTurnInfo;
import com.quoctk.grpc.rps.ListTopPlayers;
import com.quoctk.grpc.rps.TopPlayers;
import com.quoctk.grpc.rps.User;

import RockPaperScissor.Class.GameResultResponse;
import RockPaperScissor.Class.HandleGame;
import RockPaperScissor.Class.WinRatingResponse;
import RockPaperScissor.Model.Game;
import RockPaperScissor.Model.GameTurn;
import RockPaperScissor.Repository.AccountRepository;
import RockPaperScissor.Repository.GameRepository;
import RockPaperScissor.Repository.GameTurnRepository;
import io.grpc.stub.StreamObserver;

@GRpcService
public class GameControllerGRPC extends GameServiceGrpc.GameServiceImplBase {
	
	@Autowired
	private AccountRepository accountRepo;
	
	@Autowired
	private GameRepository gameRepo;
	
	@Autowired
	private GameTurnRepository gameTurnRepo;
	
	private Map<String, BigInteger> curInfoMap = new HashMap<String, BigInteger>();
	
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
	
	//-----------------------------------------------------------
	// MAPPING PATH
	//-----------------------------------------------------------
	
	public void getTopPlayers(User user, StreamObserver<ListTopPlayers> responseObserver) {
		List<WinRatingResponse> wrList = HandleGame.handleTopPlayers(user.getUsername(), gameRepo);
		
		ListTopPlayers.Builder builderListTopPlayers = ListTopPlayers.newBuilder(); 
		for (WinRatingResponse wrr : wrList) {
			TopPlayers tp = TopPlayers.newBuilder().setUsername(wrr.getUsername()).setWinRating(wrr.getWinRating()).build();
			builderListTopPlayers.addListTopPlayers(tp);
		}
		
		responseObserver.onNext(builderListTopPlayers.build());
		responseObserver.onCompleted();
    }
	
	public void getGameHistory(User user, StreamObserver<ListGameHistory> responseObserver) {
		List<Game> gameList = HandleGame.handleGameHistory(user.getUsername(), gameRepo);
		
		ListGameHistory.Builder builderListGameHistory = ListGameHistory.newBuilder();
		for (Game game : gameList) {
			GameInfo gameinfo = GameInfo.newBuilder().setGameID(BigIntegerToGRPC(game.getId())).setGameResult(game.getGameResult())
								.setUsername(game.getAccount().getUsername()).setStartDate(DateToString(game.getStartDate())).build();
			
			List<GameTurn> turnList = gameTurnRepo.findAllGameTurnsByGameID(game.getId());
			
			ListGameTurnInfo.Builder builderListGameTurnInfo = ListGameTurnInfo.newBuilder();
			for (GameTurn gameturn : turnList) {
				GameTurnInfo gameturninfo = GameTurnInfo.newBuilder().setTurnID(BigIntegerToGRPC(gameturn.getId()))
								.setUserResult(gameturn.getUserResult()).setMachineResult(gameturn.getMachineResult())
								.setTurnDate(DateToString(gameturn.getTurnDate())).setGameID(BigIntegerToGRPC(game.getId()))
								.setTurnType(gameturn.getTurnType()).build();
				
				builderListGameTurnInfo.addListGameTurnInfo(gameturninfo);
			}
			
			GameHistory gameHistory = GameHistory.newBuilder().setGameInfo(gameinfo).setListGameTurnInfo(builderListGameTurnInfo).build();
			builderListGameHistory.addListGameHistory(gameHistory);
		}
		
		responseObserver.onNext(builderListGameHistory.build());
		responseObserver.onCompleted();
    }
	
	public void playGame(GameRequest gameRequest, StreamObserver<GameResponse> responseObserver) {
		GameResultResponse gameResult = HandleGame.handlePlayGame(gameRequest.getUser().getUsername(), gameRequest.getChoose(), 
																	curInfoMap, gameRepo, accountRepo, gameTurnRepo);
		
		GameResponse.Builder builderGameResponse = GameResponse.newBuilder();
		
		builderGameResponse.setGameID(BigIntegerToGRPC(gameResult.getGameID())).setGameResult(gameResult.getGameResult())
							.setGameStartDate(DateToString(gameResult.getGameStartDate())).setUserResult(gameResult.getUserResult())
							.setMachineResult(gameResult.getMachineResult()).setTurnDate(DateToString(gameResult.getTurnDate()))
							.setTurnType(gameResult.getTurnType()).build();
		
		responseObserver.onNext(builderGameResponse.build());
		responseObserver.onCompleted();
	}
}
