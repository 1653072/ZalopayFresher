package RockPaperScissor.Model;

import java.io.Serializable;
import java.math.BigInteger;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;

import java.util.Date;


/**
 * The persistent class for the gameturns database table.
 * 
 */
@Entity
@Table(name="gameturns")
public class GameTurn implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private BigInteger id;

	private byte machineResult;

	@Temporal(TemporalType.TIMESTAMP)
	private Date turnDate;

	private byte turnType;

	private byte userResult;
	
	//Ref of @JsonBackReference: https://stackoverflow.com/questions/37848789/spring-expected-instead-of-t-error-when-returning-list
	//bi-directional many-to-one association to Game
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonBackReference
	@JoinColumn(name="gameID")
	private Game game;

	public GameTurn() {
	}

	public BigInteger getId() {
		return this.id;
	}

//	public void setId(BigInteger id) {
//		this.id = id;
//	}

	public byte getMachineResult() {
		return this.machineResult;
	}

	public void setMachineResult(byte machineResult) {
		this.machineResult = machineResult;
	}

	public Date getTurnDate() {
		return this.turnDate;
	}

	public void setTurnDate(Date turnDate) {
		this.turnDate = turnDate;
	}

	public byte getTurnType() {
		return this.turnType;
	}

	public void setTurnType(byte turnType) {
		this.turnType = turnType;
	}

	public byte getUserResult() {
		return this.userResult;
	}

	public void setUserResult(byte userResult) {
		this.userResult = userResult;
	}

	public Game getGame() {
		return this.game;
	}

	public void setGame(Game game) {
		this.game = game;
	}

}