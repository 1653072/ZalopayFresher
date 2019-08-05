package RockPaperScissor.Class;

import java.math.BigInteger;
import java.util.Date;

public class GameResultResponse {
	private BigInteger gameID;
	private Date gameStartDate;
	private byte machineResult;
	private byte userResult;
	private int turnType;
	private Date turnDate;
    private int gameResult;
    
	public BigInteger getGameID() {
		return gameID;
	}
	
	public void setGameID(BigInteger gameID) {
		this.gameID = gameID;
	}
	
	public Date getGameStartDate() {
		return gameStartDate;
	}
	
	public void setGameStartDate(Date gameStartDate) {
		this.gameStartDate = gameStartDate;
	}
	
	public byte getMachineResult() {
		return machineResult;
	}
	
	public void setMachineResult(byte machineResult) {
		this.machineResult = machineResult;
	}
	
	public byte getUserResult() {
		return userResult;
	}
	
	public void setUserResult(byte userResult) {
		this.userResult = userResult;
	}
	
	public int getTurnType() {
		return turnType;
	}
	
	public void setTurnType(int turnType) {
		this.turnType = turnType;
	}
	
	public Date getTurnDate() {
		return turnDate;
	}
	
	public void setTurnDate(Date turnDate) {
		this.turnDate = turnDate;
	}
	
	public int getGameResult() {
		return gameResult;
	}

	public GameResultResponse(BigInteger gameID, Date gameStartDate, byte machineResult, byte userResult, int turnType,
			Date turnDate, int gameResult) {
		super();
		this.gameID = gameID;
		this.gameStartDate = gameStartDate;
		this.machineResult = machineResult;
		this.userResult = userResult;
		this.turnType = turnType;
		this.turnDate = turnDate;
		this.gameResult = gameResult;
	}
    
}
