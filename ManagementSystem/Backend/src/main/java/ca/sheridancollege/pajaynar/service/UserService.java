package ca.sheridancollege.pajaynar.service;

import ca.sheridancollege.pajaynar.beans.Users;

public interface UserService {

	Users findUserProfileByToken(String token) throws Exception;
	
	Users findUserByUsername(String username) throws Exception;
	
	Users findUserById( Long id) throws Exception;
	
	Users updateUsersProjectSize ( Users user, int number); 
}
