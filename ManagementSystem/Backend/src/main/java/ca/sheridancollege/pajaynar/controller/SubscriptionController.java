package ca.sheridancollege.pajaynar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ca.sheridancollege.pajaynar.beans.PlanType;
import ca.sheridancollege.pajaynar.beans.Subscription;
import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.service.SubscriptionService;
import ca.sheridancollege.pajaynar.service.UserService;

@RestController
@RequestMapping("/api/subscription")
public class SubscriptionController {

	@Autowired
	private SubscriptionService subscriptionService;
	
	@Autowired
	private UserService userService;
	
	@GetMapping("/user")
	public ResponseEntity<Subscription> getUserSubscription (
			
			@AuthenticationPrincipal UserDetails userDetails
			
			) throws Exception {
		
		Users user = userService.findUserByUsername(userDetails.getUsername());
		
		Subscription subscription = subscriptionService.getUsersSubscription(user.getId());
		
		return new ResponseEntity<Subscription> ( subscription, HttpStatus.OK);
	}
	 
	@PatchMapping("/upgrade")
	public ResponseEntity<Subscription> upgradeSubscription (
			
			@AuthenticationPrincipal UserDetails userDetails,
			@RequestParam("planType") PlanType planType
			
			) throws Exception {
		
		Users user = userService.findUserByUsername(userDetails.getUsername());
		
		Subscription upgradedSubscription = subscriptionService.upgradeSubscription(user.getId(), planType);
		
		return new ResponseEntity<Subscription>( upgradedSubscription, HttpStatus.OK);
	}
	
	
	
}
