package ca.sheridancollege.pajaynar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.response.AuthResponse;
import ca.sheridancollege.pajaynar.service.SubscriptionService;
import ca.sheridancollege.pajaynar.service.UserServiceImpl;

@RestController
@RequestMapping("/auth")
public class AuthController {
	
	@Autowired
	private UserServiceImpl userService;
	
	@Autowired
	private SubscriptionService subscriptionService;
	
	@PostMapping("/signup")
	public ResponseEntity<AuthResponse> registerUser( @RequestBody Users user) throws Exception {
		System.out.println("Registering user: " + user.getUsername());
		Users registeredUser = userService.registerUser(user);
		
		subscriptionService.createSubscription(registeredUser);
		
		return new ResponseEntity<AuthResponse>(userService.signupResponse(registeredUser.getUsername()), HttpStatus.CREATED);		
	}

	@PostMapping("/login")
	public ResponseEntity<AuthResponse> loginUser(@RequestBody Users user) throws Exception {
     
		return new ResponseEntity<AuthResponse>(userService.varifyUser(user), HttpStatus.OK);
	}
	
	@GetMapping("/isLoggedIn")
	public ResponseEntity<Boolean> isLoggedIn (
			@RequestParam String token
			) {
		try {
		return new ResponseEntity<Boolean>(userService.isLoggedIn(token), HttpStatus.OK); }
		catch (Exception e) {
            return new ResponseEntity<Boolean>(false, HttpStatus.OK);
        }
	}
}

	
