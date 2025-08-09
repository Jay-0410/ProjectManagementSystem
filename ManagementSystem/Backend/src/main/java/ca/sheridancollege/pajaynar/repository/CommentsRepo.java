package ca.sheridancollege.pajaynar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.pajaynar.beans.Comments;

public interface CommentsRepo extends JpaRepository< Comments, Long > {
	
	List<Comments> findCommentsByIssueId(Long issueId);
	
	
}
