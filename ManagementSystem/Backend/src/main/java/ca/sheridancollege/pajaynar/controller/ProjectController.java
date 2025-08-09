package ca.sheridancollege.pajaynar.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import ca.sheridancollege.pajaynar.beans.Chat;
import ca.sheridancollege.pajaynar.beans.Invitation;
import ca.sheridancollege.pajaynar.beans.Project;
import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.request.InviteRequest;
import ca.sheridancollege.pajaynar.response.MessageResponse;
import ca.sheridancollege.pajaynar.service.InvitationService;
import ca.sheridancollege.pajaynar.service.ProjectService;
import ca.sheridancollege.pajaynar.service.UserService;

@RestController
@RequestMapping("api/project")
public class ProjectController {

	@Autowired
	private ProjectService projectService;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private InvitationService invitationService;
	
	@GetMapping("")
	public ResponseEntity<List<Project>> getProjects (
		
			@RequestParam(required = false) String catagory,
			@RequestParam(required = false) String tag,
			@AuthenticationPrincipal UserDetails userDetails
			
			) throws Exception{
		
		Users user = userService.findUserByUsername(userDetails.getUsername());
		
		List<Project> projects = projectService.getProjectByTeam(user, catagory, tag);
		
		return new ResponseEntity<List<Project>> (projects, HttpStatus.OK);
	}
	
	@GetMapping("/{projectId}")
	public ResponseEntity<Project> getProjectById(
			
			@PathVariable Long projectId
			
			) throws Exception {
		
		Project project = projectService.getProjectById(projectId);
		
		return new ResponseEntity<Project> ( project, HttpStatus.OK);
	}
	
	@PostMapping("")
	public ResponseEntity<Project> createProject (
			
			@RequestBody Project project,
			@AuthenticationPrincipal UserDetails userDetails
            
            ) throws Exception {
		System.out.println(userDetails.getUsername());
		Users user = userService.findUserByUsername(userDetails.getUsername());
		
		Project createdProject = projectService.createProject(project, user);
		System.out.println(createdProject);
		return ResponseEntity.status(HttpStatus.CREATED).body(createdProject);
	}
	
	@PatchMapping("/{projectId}")
	public ResponseEntity<Project> updateProject (
			
			@PathVariable Long projectId,
			@RequestBody Project project,
			@AuthenticationPrincipal UserDetails userDetails
			
			) throws Exception {
		
		Users user = userService.findUserByUsername(userDetails.getUsername());
		Project updatedProject = projectService.updateProject(project, projectId, user.getId() );
		
		return new ResponseEntity<Project> (updatedProject, HttpStatus.OK);
	}
	
	@DeleteMapping("/{projectId}")
	public ResponseEntity<MessageResponse> deleteProject (
			
			@PathVariable Long projectId,
			@AuthenticationPrincipal UserDetails userDetails
            
            ) throws Exception {
	
		Users user = userService.findUserByUsername(userDetails.getUsername());
		
		projectService.deleteProject(projectId, user.getId());
		
		return new ResponseEntity<MessageResponse> ( new MessageResponse("Project Deleted Successfully"), HttpStatus.OK);
	}
	
	@GetMapping("/search")
	public ResponseEntity<List<Project>> searchProjects (
			
			@RequestParam(required = false) String keyword,
			@AuthenticationPrincipal UserDetails userDetails
			
			) throws Exception {
		
		Users user = userService.findUserByUsername(userDetails.getUsername());
		
		List<Project> projects = projectService.searchProjects( keyword , user);
		
		return new ResponseEntity<List<Project>> ( projects, HttpStatus.OK);
	}
	
	@GetMapping("/{projectId}/chat")
	public ResponseEntity<Chat> getChatByProjectId (
			
			@PathVariable Long projectId			
			
			) throws Exception {
		
		Chat chat = projectService.getChatByProjectId(projectId);
		
		return new ResponseEntity<Chat> ( chat, HttpStatus.OK);
	}
	
	@PostMapping("/{projectId}/invite")
	public ResponseEntity<MessageResponse> inviteProject (
			
			@PathVariable Long projectId,
			@RequestBody InviteRequest request
            	
			) throws Exception {
		
		invitationService.sendInvitation(request.getEmail(), projectId);
		
		return new ResponseEntity<MessageResponse> (new MessageResponse("Invitation Sent Successfully"), HttpStatus.OK);
	}
	
	@GetMapping("/accept_invitation")
	public ResponseEntity<Invitation> acceptInviteProject (
			
			@RequestParam String invitationToken,
			@AuthenticationPrincipal UserDetails userDetails
			
			) throws Exception {
		
		Users user = userService.findUserByUsername(userDetails.getUsername());
		
		Invitation invitation = invitationService.acceptInvitaion(invitationToken, user.getId());
		
		return new ResponseEntity<Invitation> (invitation, HttpStatus.ACCEPTED);
	}
}
