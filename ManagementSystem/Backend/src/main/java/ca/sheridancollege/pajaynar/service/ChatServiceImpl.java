package ca.sheridancollege.pajaynar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ca.sheridancollege.pajaynar.beans.Chat;
import ca.sheridancollege.pajaynar.repository.ChatRepo;

@Service
public class ChatServiceImpl implements ChatService{

	@Autowired
	private ChatRepo chatRepo;
	
	@Override
	public Chat createdChat(Chat chat) {
		
		return chatRepo.save(chat);
	}

}
