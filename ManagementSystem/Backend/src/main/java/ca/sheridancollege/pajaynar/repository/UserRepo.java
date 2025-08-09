package ca.sheridancollege.pajaynar.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import ca.sheridancollege.pajaynar.beans.Users;

@Repository
public interface UserRepo extends JpaRepository<Users, Long> {

	Users findByUsername(String username);
	
}
