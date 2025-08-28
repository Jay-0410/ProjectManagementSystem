package ca.sheridancollege.pajaynar.service;

import java.util.List;

import ca.sheridancollege.pajaynar.beans.Message;

public interface MessageService {

	Message sendMessage (String token, Long projectId, String content) throws Exception;
	
	List<Message> getMessagesByProjetId ( Long projectId) throws Exception;
}
