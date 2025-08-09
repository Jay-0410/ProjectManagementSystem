package ca.sheridancollege.pajaynar.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ca.sheridancollege.pajaynar.beans.PlanType;
import ca.sheridancollege.pajaynar.response.PaymentLinkResponse;
import ca.sheridancollege.pajaynar.service.PaymentService;
import ca.sheridancollege.pajaynar.service.UserService;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

	
	@Autowired
	private UserService userService;
	
	@Autowired
	private PaymentService paymentService;
	
	
	@PostMapping("/{planType}")
	public ResponseEntity<PaymentLinkResponse> createPaymentLink (
			
			@PathVariable PlanType planType,
			@AuthenticationPrincipal UserDetails userDetails
			) throws Exception {

		PaymentLinkResponse  paymentLinkResponse = paymentService.createPaymentLink(userService.findUserByUsername(userDetails.getUsername()), planType);
		
		return new ResponseEntity<PaymentLinkResponse> (paymentLinkResponse, HttpStatus.CREATED);
	}
}
