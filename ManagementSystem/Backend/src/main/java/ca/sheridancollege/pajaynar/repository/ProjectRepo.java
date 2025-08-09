package ca.sheridancollege.pajaynar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import ca.sheridancollege.pajaynar.beans.Project;
import ca.sheridancollege.pajaynar.beans.Users;

public interface ProjectRepo extends JpaRepository<Project, Long> {

	List<Project> findByOwner (Users user);
	
	List<Project> findByNameContainingAndTeamContains ( String prtialName, Users user);
	
	@Query("SELECT p FROM Project p WHERE :user MEMBER OF p.team ")
	List<Project> findByTeam (@Param("user") Users user);
	
	List<Project> findByTeamContainingOrOwner(Users user, Users owner);
}
