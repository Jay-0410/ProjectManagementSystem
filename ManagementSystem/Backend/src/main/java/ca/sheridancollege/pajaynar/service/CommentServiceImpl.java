package ca.sheridancollege.pajaynar.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import ca.sheridancollege.pajaynar.beans.Comments;
import ca.sheridancollege.pajaynar.beans.Issue;
import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.repository.CommentsRepo;

@Service
public class CommentServiceImpl implements CommentService{

	@Autowired
	private CommentsRepo commentsRepo;
	
	@Autowired
	private IssueService issueService;
	
	@Autowired
	private UserService userService;
	
	@Override
	public Comments createComment(Long issueId, Long userId, String content) throws Exception {
        
		Optional<Issue> issueOptional = Optional.of(issueService.getIssueById(issueId));
		Optional<Users> userOptional = Optional.of(userService.findUserById(userId));
		
		if ( issueOptional.isEmpty() ) {
			throw new Exception("Issue not found");
		}
		
		if ( userOptional.isEmpty()) {
			throw new Exception("User not found");
		}
		
		Issue issue = issueOptional.get();
		Users user = userOptional.get();
		
		Comments comment  = new Comments();
		comment.setIssue(issue);
		comment.setUser(user);
		comment.setCreatedDateTime(LocalDateTime.now());
		comment.setContent(content);
		
		Comments savedComment = commentsRepo.save(comment);
		issue.getComments().add(savedComment);		
		
		return savedComment;
	}

	@Override
	public void deleteComment(Long commentId, Long userId) throws Exception {
		
		Optional<Comments> commentOptional = commentsRepo.findById(commentId);
        Optional<Users> userOptional = Optional.of(userService.findUserById(userId));
        
        if (commentOptional.isEmpty()) {
        	throw new Exception("Comment not found");
        }
        
        if (userOptional.isEmpty()) {
        	throw new Exception("User not found");
        }
        
        Comments comment = commentOptional.get();
		Users user = userOptional.get();
		
        if (comment.getUser().equals(user)) {
        	commentsRepo.delete(comment);
        } else {
        	throw new Exception("User not authorized to delete this comment");
        }
        
	}

	@Override
	public List<Comments> findCommentsByIssueId(Long IssueId) throws Exception {
		List<Comments> comments = commentsRepo.findCommentsByIssueId(IssueId);
		return comments;
	}

}
