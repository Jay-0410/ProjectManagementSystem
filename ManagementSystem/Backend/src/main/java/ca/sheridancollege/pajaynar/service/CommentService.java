package ca.sheridancollege.pajaynar.service;

import java.util.List;

import ca.sheridancollege.pajaynar.beans.Comments;

public interface CommentService {

	Comments createComment ( Long issueId, Long userId, String comment) throws Exception;
	
	void deleteComment (Long commentId, Long userId) throws Exception;
	
	List<Comments> findCommentsByIssueId (Long IssueId) throws Exception;
 }
