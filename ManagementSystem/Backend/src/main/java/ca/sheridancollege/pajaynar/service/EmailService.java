package ca.sheridancollege.pajaynar.service;

public interface EmailService {

	void sendEmailWithToken(String email, String link) throws Exception;
}
