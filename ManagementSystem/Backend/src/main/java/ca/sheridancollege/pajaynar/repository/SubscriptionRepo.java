package ca.sheridancollege.pajaynar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.pajaynar.beans.Subscription;

public interface SubscriptionRepo extends JpaRepository<Subscription, Long>{

	Subscription findByUserId( Long userId);
	
	
}
