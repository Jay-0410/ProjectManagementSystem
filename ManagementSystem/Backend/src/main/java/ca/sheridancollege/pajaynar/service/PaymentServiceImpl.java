package ca.sheridancollege.pajaynar.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.razorpay.PaymentLink;
import com.razorpay.RazorpayClient;

import ca.sheridancollege.pajaynar.beans.PlanType;
import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.response.PaymentLinkResponse;

@Service
public class PaymentServiceImpl implements PaymentService{

	@Value("${razorpay.api.key}")
	private String apiKey;
	
	@Value("${razorpay.api.secret}")
	private String apiSecret;
	
	@Override
	public PaymentLinkResponse createPaymentLink(Users user, PlanType planType) throws Exception {
    
		int amount = 799 * 100 ;
		
		if( planType.equals(PlanType.ANNUALLY)) {
			amount = amount * 12;
			amount = (int) (amount * 0.7); // 30% OFF
		}
		
		try {
			RazorpayClient razorpayClient = new RazorpayClient (apiKey, apiSecret);
			
			JSONObject paymentLinkRequest = new JSONObject();
			paymentLinkRequest.put("amount", amount);
			paymentLinkRequest.put("currency", "INR");
			
			JSONObject customerDetails = new JSONObject();
			customerDetails.put("name", user.getFullName());
			customerDetails.put("email", user.getUsername());
			
			paymentLinkRequest.put("customer", customerDetails);
			
			JSONObject notify = new JSONObject();
			notify.put("email", true);
			
			paymentLinkRequest.put("notify", notify);
			
			paymentLinkRequest.put("callback_url", "http://localhost:5173/upgrade_plan/success?planType=" + planType);
			
			PaymentLink payment = razorpayClient.paymentLink.create(paymentLinkRequest);
			
			PaymentLinkResponse paymentLinkResponse = new PaymentLinkResponse ( payment.get("id"), payment.get("short_url"));
			
			return paymentLinkResponse;
			
		} catch (Exception e) {
            e.printStackTrace();
        }
		
		return null;
	}

}
