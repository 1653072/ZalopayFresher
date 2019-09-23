package RockPaperScissor.Repository;

import java.math.BigInteger;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import RockPaperScissor.Model.GameTurn;

@Repository
public interface GameTurnRepository extends JpaRepository<GameTurn, BigInteger> {
	// Finding all game turns of a game
	@Query("SELECT gt FROM GameTurn gt JOIN gt.game gtgame WHERE gtgame.id=?1")
	public List<GameTurn> findAllGameTurnsByGameID(BigInteger gameID);
}
