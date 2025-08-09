package ca.sheridancollege.pajaynar.service;

import ca.sheridancollege.pajaynar.beans.PlanType;
import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.response.PaymentLinkResponse;

public interface PaymentService {

	PaymentLinkResponse createPaymentLink(Users user, PlanType planType) throws Exception;
}
