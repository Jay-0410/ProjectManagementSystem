package ca.sheridancollege.pajaynar.DTO;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import ca.sheridancollege.pajaynar.beans.Project;
import ca.sheridancollege.pajaynar.beans.Users;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class IssueDTO {

	private Long id;
	private String title;
	private String description;
	private String status;
	private Long projectId;
	private String priority;
	private LocalDate dueDate;
	private List<String> tags = new ArrayList<>();
	private Project project;
	private Users assignee;	
}
