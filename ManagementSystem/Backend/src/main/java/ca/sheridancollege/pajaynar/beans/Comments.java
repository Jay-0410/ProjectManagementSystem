package ca.sheridancollege.pajaynar.beans;

import java.time.LocalDateTime;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Entity
@Data	
@AllArgsConstructor
@NoArgsConstructor
public class Comments {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "comments_seq")
	@SequenceGenerator(name = "comments_seq", sequenceName = "comments_seq", allocationSize = 1, initialValue = 1)
	private Long id;

	private String content;
	private LocalDateTime createdDateTime;
	
	@ManyToOne
	private Users user;
	
	@ManyToOne
	private Issue issue;
}
