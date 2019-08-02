package RockPaperScissor.ControllerGRPC;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.lognet.springboot.grpc.GRpcService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;

import com.quoctk.grpc.rps.AuthenRequest;
import com.quoctk.grpc.rps.AuthenResponse;
import com.quoctk.grpc.rps.AuthenServiceGrpc;
import com.quoctk.grpc.rps.AuthenUser;
import com.quoctk.grpc.rps.TYPEAUTHEN;

import RockPaperScissor.Controller.RpsController;
import RockPaperScissor.Model.Account;
import RockPaperScissor.Repository.AccountRepository;
import io.grpc.stub.StreamObserver;

@GRpcService
public class AuthenService extends AuthenServiceGrpc.AuthenServiceImplBase {
	@Autowired
	private PasswordEncoder bcryptEncoder;
    
    @Autowired
	private AccountRepository accountRepo;
    
    private static final Logger LOGGER = LogManager.getLogger(RpsController.class);
    
    //-----------------------------------------------------------
  	// MAPPING PATH
  	//-----------------------------------------------------------
    
    public void authen(AuthenRequest authRequest, StreamObserver<AuthenResponse> responseObserver) {
    	AuthenResponse response;
        switch (authRequest.getType()) {
            case LOGIN:
                response = this.login(authRequest.getUser());
                break;
            case REGISTER:
                response = this.register(authRequest.getUser());
                break;
            default:
                response = AuthenResponse.newBuilder().setNotice("Request type is inappropriate").build();
                LOGGER.error("Request type is inappropriate");
        }
        
        responseObserver.onNext(response);
        responseObserver.onCompleted();
    }
    
    private AuthenResponse login(AuthenUser user) {
    	if (accountRepo.existsById(user.getUsername()) ) {
    		Account userDB = accountRepo.findById(user.getUsername()).get();
    		if (bcryptEncoder.matches(user.getPassword(), userDB.getPassword())) {
    			LOGGER.info("Username {}: Login successfully", user.getUsername());
                return AuthenResponse.newBuilder().setType(TYPEAUTHEN.LOGIN).setNotice("Login successfully").build();
    		}
    	}
    	
    	LOGGER.info("Username {}: Login fail", user.getUsername());
        return AuthenResponse.newBuilder().setType(TYPEAUTHEN.LOGIN).setNotice("Login fail").build();
    }
    
    private AuthenResponse register(AuthenUser user) {
        if(accountRepo.existsById(user.getUsername())) 
        {
            LOGGER.info("This username {} existed => Register fail => Please choose another one", user.getUsername());
            return AuthenResponse.newBuilder().setType(TYPEAUTHEN.REGISTER).setNotice("Register fail because username existed. Please choose another one").build();
        }
        
        Account newUser = new Account();
		newUser.setUsername(user.getUsername());
		newUser.setPassword(bcryptEncoder.encode(user.getPassword()));
		LOGGER.info("New account created with username {}", user.getUsername());
		accountRepo.save(newUser);
		
        return AuthenResponse.newBuilder().setType(TYPEAUTHEN.REGISTER).setNotice("New account created succussfully").build();
    } 
}
