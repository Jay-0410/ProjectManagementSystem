package ca.sheridancollege.pajaynar.beans;

import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.ElementCollection;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToMany;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.OneToOne;
import jakarta.persistence.SequenceGenerator;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

@Entity
@Data
@AllArgsConstructor
@NoArgsConstructor
@ToString(exclude = "chat")
public class Project {

	
	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "project_seq")
	@SequenceGenerator(name = "project_seq", sequenceName = "project_seq", allocationSize = 1, initialValue = 1)
	private Long id;
	
	private String name;
	private String description;
	private String category;
	
	@ElementCollection
	private List<String> tags = new ArrayList<>();

	@JsonIgnore
	@OneToOne(mappedBy = "project" , cascade = CascadeType.ALL, orphanRemoval = true)
	private Chat chat;
	
	@ManyToOne
	@JoinColumn(name = "owner_id")
	private Users owner;

	@OneToMany(mappedBy = "project" , cascade = CascadeType.ALL, orphanRemoval = true)
	private List<Issue> issues = new ArrayList<>();
	
	@ManyToMany
	private List<Users> team = new ArrayList<>();
	
}
