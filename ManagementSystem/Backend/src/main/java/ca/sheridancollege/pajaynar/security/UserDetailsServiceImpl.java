package ca.sheridancollege.pajaynar.security;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import ca.sheridancollege.pajaynar.repository.UserRepo;

@Service
public class UserDetailsServiceImpl implements UserDetailsService {

	@Autowired
	private UserRepo userRepo;
	
	@Override
	public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
		// TODO Auto-generated method stub
		
		//Find the user based on the username
		ca.sheridancollege.pajaynar.beans.Users user = userRepo.findByUsername(username);
		
		//If the user doesn't exist, throw an exception
		if ( user == null) {
			throw new UsernameNotFoundException("User "+ username + " was not found in database");
		}
		
		
//{  If it role base , follow this code - 
//		//Get a list of roles for that user
//		List<String> roleNameList = da.getRolesById(user.getUserId());
//		System.out.println("Role Name List : " + roleNameList);
//		// Change the list of the user's roles into a list of GrantedAuthority
//		List<GrantedAuthority> grantList = new ArrayList<GrantedAuthority>();
//		
//		if(roleNameList !=null) {
//			for (String role : roleNameList) {
//				grantList.add(new SimpleGrantedAuthority(role));
//			}
//		}
//}		
		
		List<GrantedAuthority> grantList = new ArrayList<GrantedAuthority>();
		
		UserDetails userDetails = (UserDetails)
						new org.springframework.security.core.userdetails.User(user.getUsername(), user.getPassword(), grantList);
		
		return userDetails;
	}

}
