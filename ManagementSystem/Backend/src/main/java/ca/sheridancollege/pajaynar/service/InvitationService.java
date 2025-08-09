package ca.sheridancollege.pajaynar.service;

import ca.sheridancollege.pajaynar.beans.Invitation;

public interface InvitationService {

	void sendInvitation ( String email, Long projectId) throws Exception;
	
	Invitation acceptInvitaion ( String token, Long userId) throws Exception;
	
	String getInvitationTokenByMail ( String email);
	
	void deleteToken ( String token);
}
