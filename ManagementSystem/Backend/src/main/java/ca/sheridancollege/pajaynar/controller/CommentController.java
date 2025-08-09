package ca.sheridancollege.pajaynar.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import ca.sheridancollege.pajaynar.beans.Comments;
import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.request.CreateCommentRequest;
import ca.sheridancollege.pajaynar.response.MessageResponse;
import ca.sheridancollege.pajaynar.service.CommentService;
import ca.sheridancollege.pajaynar.service.UserService;

@RestController
@RequestMapping("/api/comments")
public class CommentController {

	@Autowired
	private CommentService commentService;
	
	@Autowired
	private UserService userService;
	
	@PostMapping
	public ResponseEntity<Comments> createComment (
		
			@RequestBody CreateCommentRequest req,
			@AuthenticationPrincipal UserDetails userDetails
			
			) throws Exception{
		
		Users user = userService.findUserByUsername(userDetails.getUsername());
		Comments createdComment = commentService.createComment( req.getIssueId(), user.getId(), req.getCommentContent());
		
		return new ResponseEntity<Comments>(createdComment, HttpStatus.CREATED);
	}
	
	@DeleteMapping("/{commentId}")
	public ResponseEntity<MessageResponse> deleteComment (
			
			@PathVariable Long commentId,
			@AuthenticationPrincipal UserDetails userDetails
            
            ) throws Exception {
		Users user = userService.findUserByUsername(userDetails.getUsername());
		commentService.deleteComment( commentId, user.getId() );
		return new ResponseEntity<MessageResponse>( new MessageResponse("Comment deleted successfully"), HttpStatus.OK);
	}
	
	@GetMapping("/{issueId}")
	public ResponseEntity<List<Comments>> getCommentsByIssueId (
			
			@PathVariable Long issueId,
			@AuthenticationPrincipal UserDetails userDetails
			
			) throws Exception{
		
		Users user = userService.findUserByUsername(userDetails.getUsername());
		List<Comments> comments = commentService.findCommentsByIssueId(issueId);
		
		return new ResponseEntity<List<Comments>> (comments, HttpStatus.OK);
	}
}
