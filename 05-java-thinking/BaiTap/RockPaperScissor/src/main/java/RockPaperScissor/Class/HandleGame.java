package RockPaperScissor.Class;

import java.math.BigInteger;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import RockPaperScissor.Controller.RpsController;
import RockPaperScissor.Model.Account;
import RockPaperScissor.Model.Game;
import RockPaperScissor.Model.GameTurn;
import RockPaperScissor.Repository.AccountRepository;
import RockPaperScissor.Repository.GameRepository;
import RockPaperScissor.Repository.GameTurnRepository;

public class HandleGame {
	
	private static final Logger LOGGER = LogManager.getLogger(RpsController.class);
	
	//-----------------------------------------------------------
	// GAME FUNCTION
	//-----------------------------------------------------------	
	
	private static byte playOfMachine() {
		//0: Kéo (Scissor)
		//1: Búa (Rock)
		//2: Bao (Paper)
        Random random = new Random();
        return (byte) random.nextInt(3);
    }
	
	private static int checkUserResult(byte userResult, byte machineResult) {
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
	
	public static List<Game> handleGameHistory(String username, GameRepository gameRepo) {
		List<Game> gameList = gameRepo.findAllGamesByUsername(username);
		LOGGER.info("Username {}: Find all games", username);
		return gameList;
	}
	
	public static List<WinRatingResponse> handleTopPlayers(String username, GameRepository gameRepo) {
		List<WinRatingResponse> wrList = gameRepo.findTop100WinRating();
    	LOGGER.info("Username {}: Find top 100 winRating", username);
    	return wrList;
	}
	
	public static GameResultResponse handlePlayGame(String username, Integer choose, Map<String, BigInteger> curInfoMap, 
							GameRepository gameRepo, AccountRepository accountRepo, GameTurnRepository gameTurnRepo) {
		Account user = accountRepo.findById(username).get();
		LOGGER.info("Username {}: Get `account user` from token", username, user.getUsername());
		
		if (choose == null) {
			LOGGER.warn("Username {}: BAD_REQUEST with URL doesn't contain param `?choose=x`", username);
			return null;
		}
		
		// Compute game result (Win/Lose/Fair (No one wins/loses))
		byte userResult = choose.byteValue();
		byte machineResult = playOfMachine();
		int gameResultOfUser = checkUserResult(userResult, machineResult);
		
		// If curInfoMap contains key (username) => Game status is fair, new turn is needed
		// Else: Add new game with new turn and game result to DB
		BigInteger currentGameID;
		Game gameInfo;
		if (!curInfoMap.containsKey(username)) // New game with game result is created
		{
			gameInfo = new Game();
			gameInfo.setAccount(user);
			gameInfo.setStartDate(new Date());
			gameInfo.setGameturns(null);
			gameInfo.setGameResult((gameResultOfUser == 1) ? (byte) 1 : (byte) 0);
			gameInfo = gameRepo.save(gameInfo);
			LOGGER.info("Username {}: New game with id {} & result of game established", username, gameInfo.getId());
			
			currentGameID = gameInfo.getId();
			// If no one wins/loses => curInfoMap put username & currentGameID which used for next game
			if (gameResultOfUser == 0) curInfoMap.put(username, currentGameID);
		}
		else // Last game has no one wins/loses => New turn is needed
		{
			currentGameID = curInfoMap.get(username);
			gameInfo = gameRepo.findById(currentGameID).get();
		}
		
		// Add new game turn to DB
		GameTurn gt = new GameTurn();
		gt.setMachineResult(machineResult);
		gt.setUserResult(userResult);
		if (gameResultOfUser != 0) gt.setTurnType((byte) 0); // Type: Win or Lose the game
		else gt.setTurnType((byte) 1); // Type: Noone wins the game
		gt.setTurnDate(new Date());
		gt.setGame(gameInfo);
		gameTurnRepo.save(gt);
		LOGGER.info("Username {} - GameID {}: New gameTurnID {} added to DB", username, gameInfo.getId(), gt.getId());
		
		GameResultResponse result = new GameResultResponse(gameInfo.getId(), gameInfo.getStartDate(), gt.getMachineResult(), 
										gt.getUserResult(), gt.getTurnType(), gt.getTurnDate(), gameResultOfUser);
		return result;
	}
}
