package ca.sheridancollege.pajaynar.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ca.sheridancollege.pajaynar.beans.Issue;
import ca.sheridancollege.pajaynar.beans.Project;
import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.repository.IssueRepo;
import ca.sheridancollege.pajaynar.request.IssueRequest;

@Service
public class IssueServiceImpl implements IssueService {
	
	@Autowired
	private IssueRepo issueRepo;
	
	@Autowired
	private ProjectService projectService;
	
	@Autowired
	private UserService userService;

	@Override
	public Issue getIssueById(Long issueId) throws Exception {

		Optional<Issue> issue = issueRepo.findById(issueId);
		
		if ( issue.isPresent()) {
			return issue.get();
		}
		throw new Exception ("Issue not found");
	}

	@Override
	public List<Issue> getIssueByProjectId(Long projectId) {
		return issueRepo.findByProjectId(projectId);
	}

	@Override
	public Issue createIssue(Long issueId, IssueRequest issueRequest, Users user) throws Exception {
		System.out.println("createIssue called with issueId: " + issueId + " and user: " + user.getUsername());
		Project project = projectService.getProjectById(issueRequest.getProjectId());
		
		
		if (issueId != null) {
		    Issue existingIssue = getIssueById(issueId);
		    existingIssue.setTitle(issueRequest.getTitle());
		    existingIssue.setDescription(issueRequest.getDescription());
		    existingIssue.setStatus(issueRequest.getStatus());
		    existingIssue.setPriority(issueRequest.getPriority());
		    existingIssue.setDueDate(issueRequest.getDueDate());
		    existingIssue.setProject(project);
		    existingIssue.setAssignee(
		        issueRequest.getAssignee() != null 
		            ? userService.findUserByUsername(issueRequest.getAssignee().getUsername()) 
		            : null
		    );
		    return issueRepo.save(existingIssue);
		}
		Issue issue = new Issue();
		issue.setTitle(issueRequest.getTitle());
		issue.setDescription(issueRequest.getDescription());
		issue.setStatus(issueRequest.getStatus());
		issue.setPriority(issueRequest.getPriority());
		issue.setDueDate(issueRequest.getDueDate());
//		issue.setProjectId(project.getId());
		issue.setProject(project);
		System.out.println("Assignee: " + issueRequest.getAssignee());
		issue.setAssignee(issueRequest.getAssignee() != null ? userService.findUserByUsername(issueRequest.getAssignee().getUsername()) : null);
		return issueRepo.save(issue);
	}

	@Override
	public void deleteIssue(Long issueId, Users user) throws Exception {
		System.out.println("deleteIssue called with issueId: " + issueId + " and user: " + user.getUsername());
		Issue issue = getIssueById(issueId);
		if ( issue.getAssignee() != null && !issue.getAssignee().getUsername().equals(user.getUsername())) {
            throw new Exception ("You cannot delete this issue");
        }
		issueRepo.deleteById(issueId);
		System.out.println("Issue deleted: " + issueId);
	}

	

	@Override
	public Issue updateStatus(Long issueId, String status) throws Exception {
		
		Issue issue = getIssueById(issueId);
		issue.setStatus(status);
		return issueRepo.save(issue);
	}

	@Override
	public Issue addUserToIssue(Long issueId, Long userId) throws Exception {
		Users assignee = userService.findUserById(userId);
		Issue issue = getIssueById(issueId);
		issue.setAssignee(assignee); 
		
		return issueRepo.save(issue);
	}
	
}
