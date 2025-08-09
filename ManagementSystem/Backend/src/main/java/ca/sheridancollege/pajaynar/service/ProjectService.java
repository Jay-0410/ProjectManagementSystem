package ca.sheridancollege.pajaynar.service;

import java.util.List;

import ca.sheridancollege.pajaynar.beans.Chat;
import ca.sheridancollege.pajaynar.beans.Project;
import ca.sheridancollege.pajaynar.beans.Users;

public interface ProjectService {

	Project createProject (Project project, Users user) throws Exception;
	
	List<Project> getProjectByTeam (Users user, String category, String tag) throws Exception;
	
	Project getProjectById (Long projectId) throws Exception;
	
	void deleteProject (Long projectId, Long userId) throws Exception;
	
	Project updateProject (Project updatedProject, Long projectId, Long userId) throws Exception;
	
	void addUserToProject (Long projectId, Long userId) throws Exception;
	
	void removeUserFromProject (Long projectId, Long userId) throws Exception;
	
	Chat getChatByProjectId (Long projectId) throws Exception;
	
	List<Project> searchProjects ( String keyword, Users user ) throws Exception;
}
