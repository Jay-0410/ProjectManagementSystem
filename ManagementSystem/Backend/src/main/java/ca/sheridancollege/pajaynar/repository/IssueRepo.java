package ca.sheridancollege.pajaynar.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.pajaynar.beans.Issue;

public interface IssueRepo extends JpaRepository<Issue, Long> {

	public List<Issue> findByProjectId(Long projectId);
}
