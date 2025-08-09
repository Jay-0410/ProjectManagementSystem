package ca.sheridancollege.pajaynar.beans;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Invitation {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "invitaion_seq")
	@SequenceGenerator(name = "invitaion_seq", sequenceName = "invitaion_seq", allocationSize = 1, initialValue = 1)
	private Long id;
	
	private String token;
	private String email;
	private Long projectId;
	
}
