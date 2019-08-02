package RockPaperScissor.Controller;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
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
	public ResponseEntity<?> createAuthenticationToken(@RequestBody JwtRequest authenticationRequest) throws Exception {
		authenticate(authenticationRequest.getUsername(), authenticationRequest.getPassword());
		final UserDetails userDetails = userDetailsService.loadUserByUsername(authenticationRequest.getUsername());
		final String token = jwtTokenUtil.generateToken(userDetails);
		return ResponseEntity.ok(new JwtResponse(token));
	}
	
	@RequestMapping(value = "/register", method = RequestMethod.POST)
	public ResponseEntity<?> saveUser(@RequestBody Account user) throws Exception {
		if (userDetailsService.save(user) != null) 
			return ResponseEntity.ok("Registered account successfully!");
		
		LOGGER.warn("This username {} existed => Register fail => Please choose another one", user.getUsername());
		return ResponseEntity.ok("Register fail, username existed!");
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
