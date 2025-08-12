package ca.sheridancollege.pajaynar.security;

import java.util.Arrays;
import java.util.Collections;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import ca.sheridancollege.pajaynar.filter.JwtFilter;
import jakarta.servlet.http.HttpServletRequest;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

	@Autowired
	private JwtFilter jwtFilter;
	
	@Bean
	SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
		return http.sessionManagement(Management -> Management.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
		    .authorizeHttpRequests(requests -> requests
		    					.requestMatchers("/api/**").authenticated()
		    		            .anyRequest().permitAll())
//		    .httpBasic(Customizer.withDefaults())
		    .addFilterBefore(jwtFilter, UsernamePasswordAuthenticationFilter.class)
		    .csrf(csrf -> csrf.disable())
		    .cors(cors -> cors.configurationSource(corsConfigurationSource()))
		    .build();
		
	}
	
	private CorsConfigurationSource corsConfigurationSource() {
		return new CorsConfigurationSource() {
			
			@Override
			public CorsConfiguration getCorsConfiguration(HttpServletRequest request) {
				CorsConfiguration corsConfig = new CorsConfiguration();
				corsConfig.setAllowedOrigins(Arrays.asList(
						"http://localhost:3000",
						"http://localhost:5174",
						"http://localhost:4200"
						));
				
				corsConfig.setAllowedMethods(Collections.singletonList("*"));
				corsConfig.setAllowCredentials(true);
				corsConfig.setAllowedHeaders(Collections.singletonList("*"));
				corsConfig.setExposedHeaders(Arrays.asList("Authorization"));
				corsConfig.setMaxAge(3600L);
				
				
				return corsConfig;
			}
		};
	}
	
	@Bean
	PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
	
	@Bean
	public AuthenticationManager authenticationManager (AuthenticationConfiguration config) throws Exception {
		return config.getAuthenticationManager();
	}
}
