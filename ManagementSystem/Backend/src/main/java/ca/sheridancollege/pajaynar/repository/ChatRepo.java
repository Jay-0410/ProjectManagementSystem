package ca.sheridancollege.pajaynar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.pajaynar.beans.Chat;

public interface ChatRepo extends JpaRepository<Chat, Long> {

	
}
