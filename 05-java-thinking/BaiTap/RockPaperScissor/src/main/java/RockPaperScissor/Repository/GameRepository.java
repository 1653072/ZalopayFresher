package RockPaperScissor.Repository;

import java.math.BigInteger;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import RockPaperScissor.Class.WinRatingResponse;
import RockPaperScissor.Model.Game;

@Repository
public interface GameRepository extends JpaRepository<Game, BigInteger> {
	// Finding all games (history) of an user
	@Query("SELECT g FROM Game g JOIN g.account ga WHERE ga.username=?1")
	public List<Game> findAllGamesByUsername(String username);
	
	// Finding top 100 with highest rating in RPS
	// StringDoublePair: This class is used for "Finding top 100 with highest rating in RPS". It contains 2 fields which are username and winRating
	@Query("SELECT NEW RockPaperScissor.Class.WinRatingResponse(ga.username, (SELECT count(*) FROM Game g2 JOIN g2.account g2a WHERE g2a.username=ga.username AND g2.gameResult=1)*1.0/COUNT(ga.username) AS winRating) FROM Game g JOIN g.account ga GROUP BY ga.username ORDER BY winRating DESC")
	public List<WinRatingResponse> findWinRatingOfUsers(PageRequest pageRequest);
	default List<WinRatingResponse> findTop100WinRating() {
		return findWinRatingOfUsers(PageRequest.of(0,100));
	}
	
}
