package RockPaperScissor;

import static org.assertj.core.api.Assertions.assertThat;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import java.util.ArrayList;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.test.web.servlet.MockMvc;

import com.fasterxml.jackson.databind.ObjectMapper;

import RockPaperScissor.Config.JwtTokenUtil;
import RockPaperScissor.Model.Account;
import io.jsonwebtoken.lang.Assert;


@SpringBootTest
@AutoConfigureMockMvc
class RockPaperScissorApplicationTests {

	@Autowired
    private MockMvc mockMvc;
	
	@Autowired
	ObjectMapper objectMapper;
	
	@Autowired
	private JwtTokenUtil jwtTokenUtil;
	
	// Token of username "cattran"
	private String oldToken = "Bearer eyJhbGciOiJIUzUxMiJ9.eyJzdWIiOiJjYXR0cmFuIiwiZXhwIjoxNTY0OTIxNTY1LCJpYXQiOjE1NjQ5MDM1NjV9.Nh8ft3kzT9uv78PJ6lISNIPOV8n9hmVyOs4EIYlt0ti7nYIqAxx9DccD0_v01LpV4lk2FZXpZoZH8sJB1vGjDQ";
	private String tokenWithourBearer, realToken, fakeToken, wrongToken;
	
	//---------------------------------------------------------------------
	// NOTATION for TESTING HTTP:
	// If user send wrong URL or wrong/fake token, file WebSecurityConfig.java will do "addFilterBefore" with "jwtRequestFilter".
	// After analyzing the token in those URLs to get username, that username will be "null" and everything will be returned "null" 
	// (Line 49, file JwtRequestFilter.java). Therefore, here the test of HTTP is, I will expect the status os those cases are only "OK".
	//---------------------------------------------------------------------
	
	//---------------------------------------------------------------------
	// FUNCTIONS
	//---------------------------------------------------------------------
	
	private void GenerateTokenForCATTRAN() {
		User user = new User("cattran", "123456", new ArrayList<>());
		UserDetails userDetails = user;
		tokenWithourBearer = jwtTokenUtil.generateToken(userDetails);
		wrongToken = "Bearer " + "BACDDWDXA222312";
		realToken = "Bearer " + tokenWithourBearer;
		fakeToken = realToken + "fake";
	}	
	
	//---------------------------------------------------------------------
	// TEST HTTP
	//---------------------------------------------------------------------

	@Test
	public void Register() throws Exception {
		Account user = new Account();
		
		user.setUsername("");
		user.setPassword("");
		mockMvc.perform(post("/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsBytes(user)))
				.andExpect(status().isBadRequest());

		user.setUsername("minhan");
		user.setPassword("123456");
		mockMvc.perform(post("/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsBytes(user)))
				.andExpect(status().isBadRequest());

		user.setUsername("minhan02");
		user.setPassword("123456");
		mockMvc.perform(post("/register")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsBytes(user)))
				.andExpect(status().isOk());
	}
		
	@Test
	public void Login() throws Exception {
		Account user = new Account();
		
		user.setUsername("minhan");
		user.setPassword("123456");
		mockMvc.perform(post("/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsBytes(user)))
				.andExpect(status().isOk());
		
		user.setUsername("123456");
		user.setPassword("123456");
		mockMvc.perform(post("/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsBytes(user)))
				.andExpect(status().isBadRequest());
		
		user.setUsername("quoctk");
		user.setPassword("1234567890");
		mockMvc.perform(post("/login")
				.contentType(MediaType.APPLICATION_JSON)
				.content(objectMapper.writeValueAsBytes(user)))
				.andExpect(status().isBadRequest());
	}
	
	@Test
	public void getTopPlayers() throws Exception {
		GenerateTokenForCATTRAN();
		mockMvc.perform(get("/topplayers")
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.header("Authorization", oldToken))
				.andExpect(status().isOk());
		
		mockMvc.perform(get("/topplayers")
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.header("Authorization", fakeToken))
				.andExpect(status().isOk());
		
		mockMvc.perform(get("/topplayers")
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.header("Authorization", wrongToken))
				.andExpect(status().isOk());
		
		mockMvc.perform(get("/topplayers")
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.header("Authorization", realToken))
				.andExpect(status().isOk());
	}
	
	@Test
	public void getGameHistory() throws Exception {
		GenerateTokenForCATTRAN();
		
		mockMvc.perform(get("/gamehistory")
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.header("Authorization", wrongToken))
				.andExpect(status().isOk());

		mockMvc.perform(get("/gamehistory")
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.header("Authorization", fakeToken))
				.andExpect(status().isOk());
		
		mockMvc.perform(get("/gamehistory")
				.contentType(MediaType.APPLICATION_JSON_VALUE)
				.header("Authorization", realToken))
				.andExpect(status().isOk());
	}
	
	@Test
	public void playGame() throws Exception {
		GenerateTokenForCATTRAN();
		
		mockMvc.perform(post("/play?choose=0")
				.contentType(MediaType.APPLICATION_JSON)
				.header("Authorization", wrongToken))
				.andExpect(status().isOk());

		mockMvc.perform(post("/play?choose=")
				.contentType(MediaType.APPLICATION_JSON)
				.header("Authorization", wrongToken))
				.andExpect(status().isOk());
		
		mockMvc.perform(post("/play?choose=2")
				.contentType(MediaType.APPLICATION_JSON)
				.header("Authorization", realToken))
				.andExpect(status().isOk());
		
		mockMvc.perform(post("/play?choose=1")
				.contentType(MediaType.APPLICATION_JSON)
				.header("Authorization", realToken))
				.andExpect(status().isOk());
		
		mockMvc.perform(post("/play?choose=4")
				.contentType(MediaType.APPLICATION_JSON)
				.header("Authorization", realToken))
				.andExpect(status().isBadRequest());
		
		mockMvc.perform(post("/play?choose=")
				.contentType(MediaType.APPLICATION_JSON)
				.header("Authorization", realToken))
				.andExpect(status().isBadRequest());
		
		mockMvc.perform(post("/play?choose=2")
				.contentType(MediaType.APPLICATION_JSON)
				.header("Authorization", fakeToken))
				.andExpect(status().isOk());
	}
	
	//---------------------------------------------------------------------
	// TEST GRPC
	//---------------------------------------------------------------------
	
	// Ref: https://codenotfound.com/grpc-java-example.html
	
	@Autowired
	private AuthenTestRGPC authenTestRGPC;
	
	@Autowired
	private GameTestGRPC gameTestRGPC;
	 
	@Test
	public void authenTestingGRPC() throws Exception {
		assertThat(authenTestRGPC.login("quoctk", "123456")).isEqualTo("Login successfully");
		assertThat(authenTestRGPC.login("quoctk", "1234567890")).isEqualTo("Login fail");
		assertThat(authenTestRGPC.login("quoctk02", "123456")).isEqualTo("Login fail");
		
		assertThat(authenTestRGPC.register("quoctk", "123456")).isEqualTo("Register fail because username existed. Please choose another one");
		assertThat(authenTestRGPC.register("tuankiet", "123456")).isEqualTo("New account created succussfully");
		assertThat(authenTestRGPC.register("", "")).isEqualTo("Username and password must not be empty");
	}
	
	@Test
	public void gameTestingGRPC() throws Exception {
		Assert.isNull(gameTestRGPC.getTopPlayers("quoctk022", "123456"));
		Assert.notNull(gameTestRGPC.getTopPlayers("quoctk", "123456"));
		
		Assert.isNull(gameTestRGPC.getGameHistory("quoctk022", "123456"));
		Assert.notNull(gameTestRGPC.getGameHistory("quoctk", "123456"));
		
		Assert.isNull(gameTestRGPC.playGame("quoctk", "123456", 3));
		Assert.isNull(gameTestRGPC.playGame("quoctk022", "123456", 1));
		Assert.notNull(gameTestRGPC.playGame("quoctk", "123456", 1));
	}
	
}
