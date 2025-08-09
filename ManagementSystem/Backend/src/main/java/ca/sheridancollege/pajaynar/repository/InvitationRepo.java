package ca.sheridancollege.pajaynar.repository;

import org.springframework.data.jpa.repository.JpaRepository;

import ca.sheridancollege.pajaynar.beans.Invitation;

public interface InvitationRepo extends JpaRepository<Invitation, Long> {
    
        Invitation findByEmail(String email);
        
        Invitation findByToken(String token);
        
        Invitation deleteByToken(String token);
}
