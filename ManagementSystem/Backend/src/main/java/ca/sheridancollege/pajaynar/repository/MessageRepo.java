package ca.sheridancollege.pajaynar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.pajaynar.beans.Message;

public interface MessageRepo extends JpaRepository<Message, Long>{
	List<Message> findByChatIdOrderByCreatedAtAsc(Long chatId);
}
