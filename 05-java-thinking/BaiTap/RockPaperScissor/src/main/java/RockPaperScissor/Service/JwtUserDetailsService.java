package RockPaperScissor.Service;

import java.util.ArrayList;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import RockPaperScissor.Model.Account;
import RockPaperScissor.Repository.AccountRepository;

@Service("JwtUserDetailsService")
public class JwtUserDetailsService implements UserDetailsService {
	@Autowired
	private AccountRepository accountRepo;
	
	@Autowired
	private PasswordEncoder bcryptEncoder;
	
	private static final Logger LOGGER = LogManager.getLogger(JwtUserDetailsService.class);
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		Account var = accountRepo.findById(username).get();
		
		if (var == null) {
			LOGGER.error("Username {} doesn't exist!", username);
			throw new UsernameNotFoundException("Username " + username + " does not exist!");
		}
			
		return new User(var.getUsername(), var.getPassword(), new ArrayList<>());
	}
	
	public Account save(Account user) {
		if (accountRepo.existsById(user.getUsername())) 
			return null;
		
		Account newUser = new Account();
		newUser.setUsername(user.getUsername());
		newUser.setPassword(bcryptEncoder.encode(user.getPassword()));
		
		LOGGER.info("New account created with username {}", user.getUsername());
		return accountRepo.save(newUser);
	}
}
