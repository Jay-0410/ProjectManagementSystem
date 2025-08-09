package ca.sheridancollege.pajaynar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.service.UserService;

@RestController
@RequestMapping("/api/user")
public class UserController {

	@Autowired
	private UserService userService;
	
	@GetMapping("/profile")
	public ResponseEntity<Users> getUserProfile() throws Exception {
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		Users user = userService.findUserByUsername(auth.getName());
		return new ResponseEntity<Users> (user, HttpStatus.OK);
	
	}
}
