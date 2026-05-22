package com.mustafaz.book.auth;

import lombok.*;

@Builder
@Data
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationResponse {
    private String token;
}
