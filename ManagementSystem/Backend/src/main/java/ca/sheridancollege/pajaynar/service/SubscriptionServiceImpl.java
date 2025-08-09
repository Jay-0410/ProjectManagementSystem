package ca.sheridancollege.pajaynar.service;

import java.time.LocalDate;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ca.sheridancollege.pajaynar.beans.PlanType;
import ca.sheridancollege.pajaynar.beans.Subscription;
import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.repository.SubscriptionRepo;

@Service
public class SubscriptionServiceImpl implements SubscriptionService{
	
	@Autowired
	private SubscriptionRepo subscriptionRepo;
	
	@Autowired
	private UserService userService;
	

	@Override
	public Subscription createSubscription(Users user) {
		Subscription subscripition = new Subscription();
		subscripition.setUser(user);
		subscripition.setStartDate(LocalDate.now());
		subscripition.setEndDate(LocalDate.now().plusMonths(12));
		subscripition.setActive(true);
		subscripition.setPlanType(PlanType.FREE);
		return subscriptionRepo.save(subscripition);
	}

	@Override
	public Subscription getUsersSubscription(Long userId) throws Exception {
		
		Subscription subscription  = subscriptionRepo.findByUserId(userId);
		
		if ( !isSubscriptionActive(subscription)) {
			subscription.setPlanType(PlanType.FREE);
			subscription.setStartDate(LocalDate.now());
			subscription.setEndDate(LocalDate.now().plusMonths(12));
			
		}
		
		return subscriptionRepo.save(subscription) ;
	}

	@Override
	public Subscription upgradeSubscription(Long userId, PlanType planType) {
		Subscription subscription = subscriptionRepo.findByUserId(userId);
		if (subscription != null) {
			subscription.setPlanType(planType);
			subscription.setStartDate(LocalDate.now());
			if (planType == PlanType.ANNUALLY) {
				subscription.setEndDate(LocalDate.now().plusMonths(12));
			} else {
				subscription.setEndDate(LocalDate.now().plusMonths(1));
			}
			return subscriptionRepo.save(subscription);
		}
		return null;
	}

	@Override
	public boolean isSubscriptionActive(Subscription subscription) {
		
		if (subscription.getPlanType().equals(PlanType.FREE)) {
			return true;
		}
		
		LocalDate currentDate = LocalDate.now();
		LocalDate endDate = subscription.getEndDate();
		
		return endDate.isAfter(currentDate) || endDate.isEqual(currentDate);
	}

}