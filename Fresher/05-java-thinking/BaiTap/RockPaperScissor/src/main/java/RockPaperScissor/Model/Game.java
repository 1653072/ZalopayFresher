package RockPaperScissor.Model;

import java.io.Serializable;
import java.math.BigInteger;

import javax.persistence.*;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;

import java.util.Date;
import java.util.List;


/**
 * The persistent class for the games database table.
 * 
 */
@Entity
@Table(name="games")
public class Game implements Serializable {
	private static final long serialVersionUID = 1L;

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private BigInteger id;
	
	@Column(columnDefinition = "default 0")
	private byte gameResult;

	@Temporal(TemporalType.TIMESTAMP)
	private Date startDate;
	
	//Ref of @JsonBackReference & @JsonManagedReference: https://stackoverflow.com/questions/37848789/spring-expected-instead-of-t-error-when-returning-list
	//bi-directional many-to-one association to Account
	@ManyToOne(fetch = FetchType.LAZY)
	@JsonBackReference
	@JoinColumn(name="username")
	private Account account;

	//bi-directional many-to-one association to GameTurn
	@OneToMany(fetch = FetchType.LAZY, mappedBy="game")
	@JsonManagedReference
	private List<GameTurn> gameturns;

	public Game() {
	}

	public BigInteger getId() {
		return this.id;
	}

//	public void setId(BigInteger id) {
//		this.id = id;
//	}

	public byte getGameResult() {
		return this.gameResult;
	}

	public void setGameResult(byte gameResult) {
		this.gameResult = gameResult;
	}

	public Date getStartDate() {
		return this.startDate;
	}

	public void setStartDate(Date startDate) {
		this.startDate = startDate;
	}

	public Account getAccount() {
		return this.account;
	}

	public void setAccount(Account account) {
		this.account = account;
	}

}