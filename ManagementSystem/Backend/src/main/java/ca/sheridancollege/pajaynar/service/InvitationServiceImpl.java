package ca.sheridancollege.pajaynar.service;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import ca.sheridancollege.pajaynar.beans.Invitation;
import ca.sheridancollege.pajaynar.beans.Project;
import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.repository.InvitationRepo;

@Service
public class InvitationServiceImpl implements InvitationService {

	@Autowired
	private EmailService emailService;
	
	@Autowired
	private InvitationRepo invitationRepo;
	
	@Autowired
	private ProjectService projectService;
	
	@Autowired
	private UserService userService;
	
	@Override
	public void sendInvitation(String email, Long projectId) throws Exception {
		
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		
		Project project = projectService.getProjectById(projectId);
		
		Users user = userService.findUserByUsername(auth.getName());
		
		if (project == null) {
			throw new Exception("Project not found");
		}
		
		if ( project.getTeam().contains(user)) {
		
		String token = UUID.randomUUID().toString();
		
		Invitation invitation = new Invitation();
		invitation.setEmail(email);
		invitation.setProjectId(projectId);
		invitation.setToken(token);
		
		invitationRepo.save(invitation);
		
		String invitationLink = "http://localhost:8080/accept_invitaion?token=" + token;
		
		emailService.sendEmailWithToken(email, invitationLink);
		}
		
        else {
            throw new Exception("You are not authorized to send invitations for this project");
        }
	}

	@Override
	public Invitation acceptInvitaion(String invitationToken, Long userId) throws Exception {
		 
		Invitation invitation = invitationRepo.findByToken(invitationToken);
		
		if ( invitation == null) {
			throw new Exception ( "Invalid token");
		}
		
		projectService.addUserToProject(invitation.getProjectId(), userId);
		
		return invitation;
	}

	@Override
	public String getInvitationTokenByMail(String email) {
		 Invitation invitation = invitationRepo.findByEmail(email);
		return invitation.getToken();
	}

	@Override
	public void deleteToken(String token) {
	
		invitationRepo.deleteByToken(token);
	}

}
