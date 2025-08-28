package ca.sheridancollege.pajaynar.request;

import java.time.LocalDate;

import ca.sheridancollege.pajaynar.beans.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IssueRequest {

	private String title;
	private String description;
	private String status;
	private Long projectId;
	private String priority;
	private LocalDate dueDate;
	private Long userId;
	private Users assignee; // Assuming Users is a class representing the user entity
	
}
