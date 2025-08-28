package ca.sheridancollege.pajaynar.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ca.sheridancollege.pajaynar.beans.Message;
import ca.sheridancollege.pajaynar.request.CreateMessageRequest;
import ca.sheridancollege.pajaynar.service.MessageService;
import ca.sheridancollege.pajaynar.service.ProjectService;
import ca.sheridancollege.pajaynar.service.UserService;

@RestController
@RequestMapping("/api/messages")
public class MessageController {

	@Autowired
	private MessageService messageService;
	
	@Autowired
	private ProjectService projectService;
	
	@Autowired
	private UserService userService;
	
	@PostMapping("/send")
	public ResponseEntity<Message> sendMessage (
			
			@RequestBody CreateMessageRequest request
			
			) throws Exception {
		
		Message sentMessage = messageService.sendMessage(request.getToken(), request.getProjectId(), request.getContent());
		
		return new ResponseEntity<Message> (sentMessage, HttpStatus.OK);
	}
	
	@GetMapping("/chat/{projectId}")
	public ResponseEntity<List<Message>> getMessagesByProjectId (
			
			@PathVariable Long projectId
			
			) throws Exception {
		
		List<Message> messages = messageService.getMessagesByProjetId(projectId);
		System.out.println("Sender: " + messages.get(messages.size() - 1).getSender().getUsername());
		return new ResponseEntity<List<Message>> (messages, HttpStatus.OK);
	}
}
