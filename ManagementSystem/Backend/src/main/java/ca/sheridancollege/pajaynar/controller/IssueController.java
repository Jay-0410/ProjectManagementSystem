package ca.sheridancollege.pajaynar.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ca.sheridancollege.pajaynar.DTO.IssueDTO;
import ca.sheridancollege.pajaynar.beans.Issue;
import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.request.IssueRequest;
import ca.sheridancollege.pajaynar.response.MessageResponse;
import ca.sheridancollege.pajaynar.service.IssueService;
import ca.sheridancollege.pajaynar.service.UserService;

@RestController
@RequestMapping("/api/issues")
public class IssueController {

	@Autowired 
	private IssueService issueService;
	
	@Autowired
	private UserService userService;
	
	@GetMapping("/{issueId}")
	public ResponseEntity<Issue> getIssueById(
			
			@PathVariable Long issueId
			) throws Exception {
		
		return ( new ResponseEntity<Issue> ( issueService.getIssueById(issueId), HttpStatus.OK) );
	}
	
	@GetMapping("/project/{projectId}")
	public ResponseEntity<List<Issue>> getIssueByProjectId (
			
			@PathVariable Long projectId
			
			) {
		
		return new ResponseEntity<List<Issue>> ( issueService.getIssueByProjectId(projectId), HttpStatus.OK);
	}
	
	@PostMapping
	public ResponseEntity<IssueDTO> createIssue (
			
			@RequestBody IssueRequest issue,
			@AuthenticationPrincipal UserDetails userDetails
			
			) throws Exception {
		
		Users user = userService.findUserByUsername(userDetails.getUsername());
		
		if ( user != null ) {
			
			Issue createdIssue = issueService.createIssue(issue, user);
			
			IssueDTO issueDTO = new IssueDTO();
			issueDTO.setDescription(createdIssue.getDescription());
			issueDTO.setDueDate(createdIssue.getDueDate());
			issueDTO.setId(createdIssue.getId());
			issueDTO.setPriority(createdIssue.getPriority());
			issueDTO.setProject(createdIssue.getProject());
//			issueDTO.setProjectId(createdIssue.getProjectId());
			issueDTO.setStatus(createdIssue.getStatus());
			issueDTO.setTitle(createdIssue.getTitle());
			issueDTO.setTags(createdIssue.getTags());
			issueDTO.setAssignee(createdIssue.getAssignee());
			
			return new ResponseEntity<IssueDTO> (issueDTO, HttpStatus.CREATED);
		}
		
		return null;
	}
	
	@DeleteMapping("/issueId")
	public ResponseEntity<MessageResponse> deleteIssue (
			
			@PathVariable Long issueId,
			@AuthenticationPrincipal UserDetails userDetails
			
            ) throws Exception {
		
		Users user = userService.findUserByUsername(userDetails.getUsername());
		
		issueService.deleteIssue(issueId, user);
		MessageResponse response = new MessageResponse();
		response.setMessage("Issue deleted successfully");
		
		return new ResponseEntity<MessageResponse> (response, HttpStatus.OK);
		
	}
	
	@PutMapping("/{issueId}/assignee/{userId}")
	public ResponseEntity<Issue> addUserToIssue (
			
			@PathVariable Long issueId,
			@PathVariable Long userId
			
			) throws Exception {
		Issue issue = issueService.addUserToIssue(issueId, userId);
		return new ResponseEntity<Issue> (issue, HttpStatus.OK);
	}
	
	@PutMapping("/{issueId}/status/{status}")
	public ResponseEntity<Issue> updateIssueStatus (
			
			@PathVariable String status,
			@PathVariable Long issueId
			
			) throws Exception{
		
		Issue issue = issueService.updateStatus(issueId, status);
		
		return new ResponseEntity<Issue> (issue, HttpStatus.OK);
	}
	
}
