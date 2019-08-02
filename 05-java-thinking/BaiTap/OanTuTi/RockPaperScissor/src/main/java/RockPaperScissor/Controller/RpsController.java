package RockPaperScissor.Controller;

import java.math.BigInteger;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import RockPaperScissor.Class.GameResultResponse;
import RockPaperScissor.Class.StringDoublePair;
import RockPaperScissor.Model.*;
import RockPaperScissor.Repository.*;

@RestController
public class RpsController {
	
	@Autowired
	private AccountRepository accountRepo;
	
	@Autowired
	private GameRepository gameRepo;
	
	@Autowired
	private GameTurnRepository gameTurnRepo;
	
	private Map<String, BigInteger> curInfoMap = new HashMap<String, BigInteger>();
	
	private static final Logger LOGGER = LogManager.getLogger(RpsController.class);
	
	//-----------------------------------------------------------
	// GAME FUNCTION
	//-----------------------------------------------------------	
	
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

	@PostMapping(path="/play")
	public ResponseEntity<?> playGame(@RequestParam Integer choose) {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		Account user = accountRepo.findById(username).get();
		LOGGER.info("Username {}: Get `account user` from token", username, user.getUsername());
		
		if (choose == null) {
			LOGGER.warn("Username {}: BAD_REQUEST with URL doesn't contain param `?choose=x`", username);
			return ResponseEntity
		            .status(HttpStatus.BAD_REQUEST)
		            .body("BAD_REQUEST: You must have param `?choose=x` on URL with x is {0 (Scissor), 1 (Rock), 2 (Paper)}");
		}
		byte userResult = choose.byteValue();
		
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
		
		return new ResponseEntity<>(new GameResultResponse(gameInfo.getId(), gameInfo.getStartDate(), gt.getMachineResult(), gt.getUserResult(), gt.getTurnType(), gt.getTurnDate(), gameResultOfUser), HttpStatus.OK);
	}	
	
	@GetMapping(path="/gamehistory", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getGameHistory() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		List<Game> gameList = gameRepo.findAllGamesByUsername(username);
		LOGGER.info("Username {}: Find all games", username);
		return ResponseEntity.ok(gameList);
    }

    @GetMapping(path="/topplayers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getTopPlayers() {
    	Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
    	List<StringDoublePair> result = gameRepo.findTop100WinRating();
    	LOGGER.info("Username {}: Find top 100 winRating", username);
    	return ResponseEntity.ok(result);
    }
	
}
