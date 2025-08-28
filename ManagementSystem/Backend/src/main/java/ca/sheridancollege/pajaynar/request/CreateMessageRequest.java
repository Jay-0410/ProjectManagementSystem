package ca.sheridancollege.pajaynar.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class CreateMessageRequest {

	private String token;
	private String content;
	private Long projectId;
	
}
