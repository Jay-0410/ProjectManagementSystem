package ca.sheridancollege.pajaynar.service;

import ca.sheridancollege.pajaynar.beans.PlanType;
import ca.sheridancollege.pajaynar.beans.Subscription;
import ca.sheridancollege.pajaynar.beans.Users;

public interface SubscriptionService {

	Subscription createSubscription( Users user);
	
	Subscription getUsersSubscription(Long userId) throws Exception;
	
	Subscription upgradeSubscription ( Long userId, PlanType planType);
	
	boolean isSubscriptionActive ( Subscription subscription);
}
