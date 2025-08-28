package ca.sheridancollege.pajaynar.service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ca.sheridancollege.pajaynar.beans.Chat;
import ca.sheridancollege.pajaynar.beans.Project;
import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.repository.ProjectRepo;

@Service
public class ProjectServiceImpl implements ProjectService {
	
	@Autowired
	private ProjectRepo projectRepo;

	@Autowired
	private UserService userService;
	
	@Autowired
	private ChatService chatService;
	
	@Override
	public Project createProject(Project project, Users user) throws Exception {
		
		// Build the project entity
		Project newProject = new Project();
		newProject.setOwner(user);
		newProject.setTags(project.getTags());
		newProject.setName(project.getName());
		newProject.setCategory(project.getCategory());
		newProject.setDescription(project.getDescription());
		newProject.getTeam().add(user);
		
		// Save the project
		
		Project savedProject = projectRepo.save(newProject);
		
		//create chat and associate it with the project
		Chat chat = new Chat();
		chat.setProject(savedProject);
		Chat projectChat = chatService.createdChat(chat);;
		
		//link the chat with the project and save again
		savedProject.setChat(projectChat);
		return projectRepo.save(savedProject);
	}

	@Override
	public List<Project> getProjectByTeam(Users user, String category, String tag) throws Exception {
		 
		List<Project> projects = projectRepo.findByTeamContainingOrOwner(user, user);
		
		if ( category != null ) {
			projects = projects.stream().filter(project -> project.getCategory().equals(category)).collect(Collectors.toList());
		}
		
		if ( tag != null ) {
			projects = projects.stream().filter(project -> project.getTags().contains(tag))
					.collect(Collectors.toList());
		}
		
		return projects;
	}

	@Override
	public Project getProjectById(Long projectId) throws Exception {
		
		Optional<Project> project = projectRepo.findById(projectId);
		
		if ( project.isEmpty() ) {
			throw new Exception("Project not found");
		}
		
		return project.get();
	}

	@Override
	public void deleteProject(Long projectId, Long userId) throws Exception {
		Project project = getProjectById(projectId);
		
		if ( !project.getOwner().getId().equals(userId) ) {
			throw new Exception("You are not the owner of this project");
		}
		
		projectRepo.deleteById(projectId);
	}

	@Override
	public Project updateProject(Project updatedProject, Long projectId, Long userId) throws Exception {
		 
		Project project = getProjectById(projectId);
		
		if ( !project.getTeam().contains(userService.findUserById(userId))) {
            throw new Exception("You are not the owner of this project");
        }
		
		project.setName(updatedProject.getName());
		project.setDescription(updatedProject.getDescription());
		project.setTags(updatedProject.getTags());
		
		return projectRepo.save(project);
	}

	@Override
	public void addUserToProject(Long projectId, Long userId) throws Exception {
		 
		Project project = getProjectById(projectId);
		
		Users user = userService.findUserById(userId);
		
		if (!( project.getTeam().contains(user) )) {
			
			project.getTeam().add(user);
			project.getChat().getUsers().add(user);
			
			projectRepo.save(project);
		}
		
	}

	@Override
	public void removeUserFromProject(Long projectId, Long userId) throws Exception {
		 
		Project project = getProjectById(projectId);
		
		Users user = userService.findUserById(userId);
		
		if ( project.getTeam().contains(user) ) {
			
			project.getTeam().remove(user);
			project.getChat().getUsers().remove(user);
			
			projectRepo.save(project);
		}
		
	}

	@Override
	public Chat getChatByProjectId(Long projectId) throws Exception {
		 
		return getProjectById(projectId).getChat();
	}

	@Override
	public List<Project> searchProjects(String keyword, Users user) throws Exception {
		 
		return projectRepo.findByNameContainingAndTeamContains(keyword, user);
	}

	
}
