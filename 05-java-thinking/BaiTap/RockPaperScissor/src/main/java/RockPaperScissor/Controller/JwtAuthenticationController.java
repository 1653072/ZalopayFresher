package RockPaperScissor.Controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import RockPaperScissor.Config.JwtTokenUtil;
import RockPaperScissor.Model.Account;
import RockPaperScissor.Model.JwtRequest;
import RockPaperScissor.Model.JwtResponse;
import RockPaperScissor.Service.JwtUserDetailsService;

//Ref: https://www.javainuse.com/spring/jwt

@RestController
@CrossOrigin
public class JwtAuthenticationController {
	@Autowired
	private AuthenticationManager authenticationManager;

	@Autowired
	private JwtTokenUtil jwtTokenUtil;

	@Autowired
	private JwtUserDetailsService userDetailsService;
	
	private static final Logger LOGGER = LogManager.getLogger(JwtAuthenticationController.class);
	
	//-----------------------------------------------------------
	// MAPPING PATH
	//-----------------------------------------------------------
	
	@RequestMapping(value = "/login", method = RequestMethod.POST)
	public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) {
		try
		{
			authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
			final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
			final String token = jwtTokenUtil.generateToken(userDetails);
			return ResponseEntity.ok(new JwtResponse(token));
		}
		catch (Exception e) {
			LOGGER.error(e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("BAD_REQUEST");
		}
	}
	
	@RequestMapping(value = "/register", method = RequestMethod.POST)
	public ResponseEntity<?> saveUser(@RequestBody Account user) {
		try {
			Account var = userDetailsService.save(user);
			
			if (var == null) {
				LOGGER.warn("This username {} existed or username/password is empty => Register fail", user.getUsername());
				return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Existed username or username/password is empty => Register fail");
			}
				
			return ResponseEntity.ok("Registered account successfully!");
		}
		catch (Exception e) {
			LOGGER.error(e.getMessage());
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Username or password can not be empty");
		}
	}
	
	public void authenticate(String username, String password) throws Exception {
		try {
			authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(username, password));
		} 
		catch (DisabledException e) {
			LOGGER.error("USER_DISABLED: {}", e.toString());
			throw new Exception("USER_DISABLED", e);
		} 
		catch (BadCredentialsException e) {
			LOGGER.error("INVALID_CREDENTIALS: {}", e.toString());
			throw new Exception("INVALID_CREDENTIALS", e);
		}
	}
}
