package ca.sheridancollege.pajaynar.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.MailSendException;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;

@Service
public class EmailServiceImpl implements EmailService{

	@Autowired
	private JavaMailSender mailSender;
	
	@Override
	public void sendEmailWithToken(String email, String link) throws MessagingException {
		
		MimeMessage mimeMessage = mailSender.createMimeMessage();
		MimeMessageHelper helper = new MimeMessageHelper (mimeMessage, "utf-8");
		
		String subject = "Project Invitation";
		String text = "Click the link to join the project : " + link ; 
		
		helper.setSubject(subject);
		helper.setText(text, true);
		helper.setTo(email);
		
		try {
			
			mailSender.send(mimeMessage);
			
		} catch (MailSendException e) {
			
			throw new MailSendException("Failed to send email. Please");
		
		}
	}

}
