package RockPaperScissor.Class;

public class StringIntegerPair {
	private String username;
	private long winsNumber;
	
	public StringIntegerPair() {
		super();
		// TODO Auto-generated constructor stub
	}
	
	public StringIntegerPair(String username, long winsNumber) {
		super();
		this.username = username;
		this.winsNumber = winsNumber;
	}
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public long getWinsNumber() {
		return winsNumber;
	}
	
	public void setWinsNumber(long winsNumber) {
		this.winsNumber = winsNumber;
	}
}
