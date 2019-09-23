package RockPaperScissor.Model;

import java.io.Serializable;
import javax.persistence.*;
import java.util.List;


/**
 * The persistent class for the accounts database table.
 * 
 */
@Entity
@Table(name="accounts")
public class Account implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	private String username;

	private String password;

	//bi-directional many-to-one association to Game
	@OneToMany(fetch = FetchType.LAZY, mappedBy="account")
	private List<Game> games;

	public Account() {
	}

	public String getUsername() {
		return this.username;
	}

	public void setUsername(String username) {
		this.username = username;
	}

	public String getPassword() {
		return this.password;
	}

	public void setPassword(String password) {
		this.password = password;
	}

//	public List<Game> getGames() {
//		return this.games;
//	}
//
//	public void setGames(List<Game> games) {
//		this.games = games;
//	}
//
//	public Game addGame(Game game) {
//		getGames().add(game);
//		game.setAccount(this);
//
//		return game;
//	}
//
//	public Game removeGame(Game game) {
//		getGames().remove(game);
//		game.setAccount(null);
//
//		return game;
//	}

}