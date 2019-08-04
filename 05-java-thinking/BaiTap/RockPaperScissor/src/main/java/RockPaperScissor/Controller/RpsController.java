package RockPaperScissor.Controller;

import java.math.BigInteger;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
import RockPaperScissor.Class.HandleGame;
import RockPaperScissor.Class.WinRatingResponse;
import RockPaperScissor.Model.*;
import RockPaperScissor.Repository.AccountRepository;
import RockPaperScissor.Repository.GameRepository;
import RockPaperScissor.Repository.GameTurnRepository;

@RestController
public class RpsController {

	@Autowired
	private AccountRepository accountRepo;
	
	@Autowired
	private GameRepository gameRepo;
	
	@Autowired
	private GameTurnRepository gameTurnRepo;
	
	private Map<String, BigInteger> curInfoMap = new HashMap<String, BigInteger>();	
	
	//-----------------------------------------------------------
	// MAPPING PATH
	//-----------------------------------------------------------
	
	private String getAuthenValue() {
		Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
		String username = authentication.getName();
		return username;
	}
	
	@PostMapping(path="/play")
	public ResponseEntity<?> playGame(@RequestParam Integer choose) {
		String username = getAuthenValue();
		GameResultResponse result = HandleGame.handlePlayGame(username, choose, curInfoMap, gameRepo, accountRepo, gameTurnRepo);
		if (result == null) {
			return ResponseEntity
		            .status(HttpStatus.BAD_REQUEST)
		            .body("BAD_REQUEST: You must have param `?choose=x` on URL with x is {0 (Scissor), 1 (Rock), 2 (Paper)}");
		}
		
		return ResponseEntity.ok(result);
	}	
	
	@GetMapping(path="/gamehistory", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getGameHistory() {
		String username = getAuthenValue();
		List<Game> gameList = HandleGame.handleGameHistory(username, gameRepo);
		return ResponseEntity.ok(gameList);
    }

    @GetMapping(path="/topplayers", produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<?> getTopPlayers() {
    	String username = getAuthenValue();
    	List<WinRatingResponse> wrList = HandleGame.handleTopPlayers(username, gameRepo);
    	return ResponseEntity.ok(wrList);
    }
	
}
