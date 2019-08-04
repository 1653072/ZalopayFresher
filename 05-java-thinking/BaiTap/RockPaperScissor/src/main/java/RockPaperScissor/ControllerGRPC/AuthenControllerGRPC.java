package RockPaperScissor.ControllerGRPC;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.lognet.springboot.grpc.GRpcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.quoctk.grpc.rps.AuthenResponse;
import com.quoctk.grpc.rps.AuthenServiceGrpc;
import com.quoctk.grpc.rps.AuthenUser;

import RockPaperScissor.Controller.RpsController;
import RockPaperScissor.Model.Account;
import RockPaperScissor.Repository.AccountRepository;
import io.grpc.stub.StreamObserver;

@GRpcService
public class AuthenControllerGRPC extends AuthenServiceGrpc.AuthenServiceImplBase {
	@Autowired
	private PasswordEncoder bcryptEncoder;
    
    @Autowired
	private AccountRepository accountRepo;
    
    private static final Logger LOGGER = LogManager.getLogger(RpsController.class);
    
    //-----------------------------------------------------------
  	// MAPPING PATH
  	//-----------------------------------------------------------
    
    public void login(AuthenUser authUser, StreamObserver<AuthenResponse> responseObserver) {
    	AuthenResponse response;
    	
    	if (accountRepo.existsById(authUser.getUsername()) ) {
    		Account userDB = accountRepo.findById(authUser.getUsername()).get();
    		if (bcryptEncoder.matches(authUser.getPassword(), userDB.getPassword())) {
    			LOGGER.info("Username {}: Login successfully", authUser.getUsername());
                response = AuthenResponse.newBuilder().setNotice("Login successfully").build();
                responseObserver.onNext(response);
                responseObserver.onCompleted();
                return;
    		}
    	}
    	
    	LOGGER.info("Username {}: Login fail", authUser.getUsername());
        response = AuthenResponse.newBuilder().setNotice("Login fail").build();
    	
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
    
    public void register(AuthenUser authUser, StreamObserver<AuthenResponse> responseObserver) {
    	AuthenResponse response;
    	
        if(accountRepo.existsById(authUser.getUsername())) 
        {
            LOGGER.info("This username {} existed => Register fail => Please choose another one", authUser.getUsername());
            response = AuthenResponse.newBuilder().setNotice("Register fail because username existed. Please choose another one").build();
            responseObserver.onNext(response);
            responseObserver.onCompleted();
            return;
        }
        
        Account newUser = new Account();
		newUser.setUsername(authUser.getUsername());
		newUser.setPassword(bcryptEncoder.encode(authUser.getPassword()));
		LOGGER.info("New account created with username {}", authUser.getUsername());
		accountRepo.save(newUser);
		
        response = AuthenResponse.newBuilder().setNotice("New account created succussfully").build();
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    } 
}
