package ca.sheridancollege.pajaynar.service;

import java.security.NoSuchAlgorithmException;
import java.util.Base64;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;
import java.util.function.Function;

import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

@Service
public class JwtService {

	private String secretKey = "";
	
	public JwtService ( ) {
		try {
			KeyGenerator keyGen = KeyGenerator.getInstance("HmacSHA256");
			SecretKey sk = keyGen.generateKey();
			secretKey = Base64.getEncoder().encodeToString(sk.getEncoded());
		} catch (NoSuchAlgorithmException e) {
			e.printStackTrace();
		}
	}
	
	public String generateToken(String username) {
		
		//1. Define the claims
		Map<String, Object> claims = new HashMap<>();
		
		//2.Generate Token
		return Jwts
			.builder()
			.claims()
			.add(claims)
			.subject(username)
			.issuedAt( new Date(System.currentTimeMillis()))
			.expiration( new Date(System.currentTimeMillis() + 1000*60*10))
			.and()
			.signWith(getKey())
			.compact();
		
		
		//return "";
    }

	private SecretKey getKey() {
		byte[] keyBytes = Decoders.BASE64.decode(secretKey);
		return Keys.hmacShaKeyFor(keyBytes);
		//return null;
	}
	
	public boolean validateToken(String token, UserDetails userDetails) {
		String username = extractUsername(token);
		return (username.equals(userDetails.getUsername()) && !isTokenExpired(token));
		//return true;
	}
	
	private boolean isTokenExpired(String token) {
		System.out.println("Inside isTokenExpired");
		return extractExpiration(token).before(new Date());
	}
	
	private Date extractExpiration(String token) {
		System.out.println("Inside extractExpiration");
		return extractClaim(token, Claims::getExpiration);
	}
	
	public String extractUsername(String token) {
		return extractClaim ( token , Claims::getSubject);
	}
	
	private <T> T extractClaim(String token , Function<Claims, T> claimResolver) {
		System.out.println("Inside extractClaim");
		final Claims claims = extractAllClaims(token);
		return claimResolver.apply(claims);
	}
	
	private Claims extractAllClaims ( String token) {
		System.out.println("Inside extractAllClaims");
		System.out.println("token " + token);
		System.out.println(Jwts
				.parser()
				.verifyWith(getKey())
				.build()
				.parseSignedClaims(token)
				.getPayload());
		return Jwts
				.parser()
				.verifyWith(getKey())
				.build()
				.parseSignedClaims(token)
				.getPayload();
	}
	
	
}
