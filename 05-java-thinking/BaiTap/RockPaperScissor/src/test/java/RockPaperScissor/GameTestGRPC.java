package RockPaperScissor;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Component;

import com.quoctk.grpc.rps.GameRequest;
import com.quoctk.grpc.rps.GameResponse;
import com.quoctk.grpc.rps.GameServiceGrpc;
import com.quoctk.grpc.rps.ListGameHistory;
import com.quoctk.grpc.rps.ListTopPlayers;
import com.quoctk.grpc.rps.User;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

@Component
public class GameTestGRPC {
	
	private GameServiceGrpc.GameServiceBlockingStub gameBlockStub;
	
	@PostConstruct
	private void init() {
		ManagedChannel managedChannel = ManagedChannelBuilder.forAddress("localhost", 6565).usePlaintext().build();
		gameBlockStub = GameServiceGrpc.newBlockingStub(managedChannel);
	}
	
	ListTopPlayers getTopPlayers(String username, String password) {
		User user = User.newBuilder().setUsername(username).setPassword(password).build();
		ListTopPlayers result = gameBlockStub.getTopPlayers(user);
		if (result.toString().length() == 0) return null;
		return result;
	}
	
	ListGameHistory getGameHistory(String username, String password) {
		User user = User.newBuilder().setUsername(username).setPassword(password).build();
		ListGameHistory result = gameBlockStub.getGameHistory(user);
		if (result.toString().length() == 0) return null;
		return result;
	}
	
	GameResponse playGame(String username, String password, int choose) {
		User user = User.newBuilder().setUsername(username).setPassword(password).build();
		GameRequest gameRequest = GameRequest.newBuilder().setUser(user).setChoose(choose).build();
		GameResponse result = gameBlockStub.playGame(gameRequest);
		if (result.toString().length() == 0) return null;
		return result;
	}
}
