package ca.sheridancollege.pajaynar.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ca.sheridancollege.pajaynar.beans.Chat;
import ca.sheridancollege.pajaynar.beans.Message;
import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.repository.MessageRepo;

@Service
public class MessageServiceImpl implements MessageService {

	@Autowired
	private MessageRepo messageRepo;
	
	@Autowired
	private UserService userService;
	
	@Autowired
	private ProjectService projectService;
	
	
	
	@Override
	public Message sendMessage(Long senderId, Long projectId, String content) throws Exception {
		
		Users sender = userService.findUserById(senderId);
		Chat chat = projectService.getChatByProjectId(projectId);
		
		Message message = new Message();
		message.setContent(content);
		message.setSender(sender);
		message.setCreatedAt(LocalDateTime.now());
		message.setChat(chat);
		
		Message savedMessage = messageRepo.save(message);
		
		chat.getMessages().add(savedMessage);
		
		return savedMessage;
	}

	@Override
	public List<Message> getMessagesByProjetId(Long projectId) throws Exception {

		Chat chat = projectService.getChatByProjectId(projectId);
		
		List<Message> findByChatIdOrderByCreatedAtAsc = messageRepo.findByChatIdOrderByCreatedAtAsc(chat.getId());
		
		return findByChatIdOrderByCreatedAtAsc;
	}

}
