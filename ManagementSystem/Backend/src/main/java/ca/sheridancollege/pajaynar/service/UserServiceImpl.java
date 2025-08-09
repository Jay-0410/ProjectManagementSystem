package ca.sheridancollege.pajaynar.service;

import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.repository.UserRepo;
import ca.sheridancollege.pajaynar.response.AuthResponse;

@Service
public class UserServiceImpl implements UserService {
	
	@Autowired
	private UserRepo userRepo;
	
	@Autowired
	private AuthenticationManager authenticationManager;
	
	@Autowired
	private JwtService jwtService;
	
	@Autowired
	private PasswordEncoder passwordEncoder;

	public boolean isUserExists(String username) {
//        System.out.println("Inside isUserExists - UserService");
//        System.out.println(userRepo.findByUsername(username));
		if ( userRepo.findByUsername(username) != null ) {
			return true;
		}
        return false;
    }
	
	public Users registerUser(Users user) {
//		System.out.println("Inside registerUser - UserService");
		Users newUser = new Users();
//		System.out.println(newUser.getId());
		newUser.setFullName(user.getFullName());
		newUser.setUsername(user.getUsername());
		newUser.setPassword(passwordEncoder.encode(user.getPassword()));
		
		return userRepo.save(newUser);
	}

	public AuthResponse signupResponse(String username) {
		String token = jwtService.generateToken(username);
		String message = "Signup successful";
		AuthResponse authResponse = new AuthResponse(message, token);
		
		return authResponse;
	}
	
	public AuthResponse varifyUser(Users user) {
		
		Authentication authentication = authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), user.getPassword()));
		
		if (authentication.isAuthenticated()) {
			String token = jwtService.generateToken(user.getUsername());
			String message = "Login successful";
			return new AuthResponse(message, token);
		}
		
		return null;
	}

	@Override
	public Users findUserProfileByToken(String token) throws Exception {
		System.out.println("Inside findUserProfileByToken - before extracting username ");
		 String username = jwtService.extractUsername(token);
		 System.out.println("Inside findUserProfileByToken - after extracting username " + username);
		return findUserByUsername(username);
	}

	@Override
	public Users findUserByUsername(String username) throws Exception {
		
		Users user = userRepo.findByUsername(username);
		
		if(user == null) {
			throw new Exception("User not found");
		}
		
		return user;
	}

	@Override
	public Users findUserById(Long id) throws Exception {
		 
		Optional<Users> optionalUser = userRepo.findById(id);
		
		if ( optionalUser.isEmpty()) {
			throw new Exception("User not found");
        }
		return optionalUser.get();
	}

	@Override
	public Users updateUsersProjectSize(Users user, int number) {
		user.setProjectSize(user.getProjectSize() + number);
		return userRepo.save(user);
	}
}
