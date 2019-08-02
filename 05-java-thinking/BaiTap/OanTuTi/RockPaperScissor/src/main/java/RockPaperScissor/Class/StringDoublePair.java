package RockPaperScissor.Class;

import java.text.DecimalFormat;

public class StringDoublePair {
	private String username;
	private Double winRating;
	
	public String getUsername() {
		return username;
	}
	
	public void setUsername(String username) {
		this.username = username;
	}
	
	public Double getWinRating() {
		DecimalFormat decimalFormat = new DecimalFormat("#.##");
		return Double.valueOf(decimalFormat.format(winRating));
	}
	
	public void setWinRating(Double winRating) {
		this.winRating = winRating;
	}

	public StringDoublePair(String username, Double winRating) {
		super();
		this.username = username;
		this.winRating = winRating;
	}

	public StringDoublePair() {
		super();
		// TODO Auto-generated constructor stub
	}
	
}
