package RockPaperScissor;

import javax.annotation.PostConstruct;

import org.springframework.stereotype.Component;

import com.quoctk.grpc.rps.AuthenResponse;
import com.quoctk.grpc.rps.AuthenServiceGrpc;
import com.quoctk.grpc.rps.AuthenUser;

import io.grpc.ManagedChannel;
import io.grpc.ManagedChannelBuilder;

@Component
public class AuthenTestRGPC {
	
	private AuthenServiceGrpc.AuthenServiceBlockingStub authenBlockingStub;
	
	@PostConstruct
	private void init() {
		ManagedChannel managedChannel = ManagedChannelBuilder.forAddress("localhost", 6565).usePlaintext().build();
		authenBlockingStub = AuthenServiceGrpc.newBlockingStub(managedChannel);
	}
	
	public String login(String username, String password) {
		AuthenUser user = AuthenUser.newBuilder().setUsername(username).setPassword(password).build();
		AuthenResponse response = authenBlockingStub.login(user);
		return response.getNotice();
	}
	
	public String register(String username, String password) {
		AuthenUser user = AuthenUser.newBuilder().setUsername(username).setPassword(password).build();
		AuthenResponse response = authenBlockingStub.register(user);
		return response.getNotice();
	}
}
