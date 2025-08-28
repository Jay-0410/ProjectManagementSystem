package ca.sheridancollege.pajaynar.service;

import java.util.List;
import java.util.Optional;

import ca.sheridancollege.pajaynar.beans.Issue;
import ca.sheridancollege.pajaynar.beans.Users;
import ca.sheridancollege.pajaynar.request.IssueRequest;

public interface IssueService {

	Issue getIssueById(Long issueId) throws Exception;
	
	List<Issue> getIssueByProjectId(Long projectId);
	
	Issue createIssue ( Long issueId, IssueRequest issueRequest, Users user) throws Exception;
	
	void deleteIssue ( Long issueId, Users user) throws Exception;
	
	Issue addUserToIssue ( Long issueId, Long userId) throws Exception;
	
	Issue updateStatus ( Long issueId, String status) throws Exception;
	
	
}
