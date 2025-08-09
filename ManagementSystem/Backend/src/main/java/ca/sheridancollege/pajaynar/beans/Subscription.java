package ca.sheridancollege.pajaynar.beans;

import java.time.LocalDate;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Subscription {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "subscription_seq")
	@SequenceGenerator(name = "subscription_seq", sequenceName = "subscription_seq", allocationSize = 1, initialValue = 1)
	private Long id;
	private LocalDate startDate;
	private LocalDate endDate;
	private PlanType planType;
	private boolean isActive;
	
	@OneToOne
	private Users user;
}
