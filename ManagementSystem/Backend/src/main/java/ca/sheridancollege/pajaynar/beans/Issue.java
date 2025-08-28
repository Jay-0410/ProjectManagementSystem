package ca.sheridancollege.pajaynar.beans;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import jakarta.persistence.SequenceGenerator;
import lombok.Data;
import lombok.ToString;

@Entity
@Data
@ToString(exclude = {"project", "comments", "assignee"})
public class Issue {

	@Id
	@GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "issue_seq")
	@SequenceGenerator(name = "issue_seq", sequenceName = "issue_seq", allocationSize = 1, initialValue = 1)
	private Long id;
	
	private String title;
	private String description;
	private String status;
	private String priority;
	private LocalDate dueDate;
	private List<String> tags = new ArrayList<>();
	
	
	@ManyToOne
	private Users assignee;
	
	@ManyToOne
	@JsonBackReference
	private Project project;
	
	@JsonIgnore
	@OneToMany(mappedBy = "issue" , cascade = CascadeType.ALL , orphanRemoval = true)
	private List<Comments> comments = new ArrayList<>();
	
	
}
