package com.e101.nift.common.security;

import com.e101.nift.user.entity.User;
import com.e101.nift.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User.UserBuilder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Service
@RequiredArgsConstructor
public class CustomUserDetailsService implements UserDetailsService {

    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = new User(Long.valueOf(1), "1", "1", "1"); // 대충 박아놓은 것

        UserBuilder userBuilder = org.springframework.security.core.userdetails.User.builder()
                .username(user.getKakaoId()) // ✅ 카카오 ID를 username으로 사용
                .password("") // ✅ 비밀번호 없음 ("" 또는 null 가능)
                .authorities(Collections.singletonList(new SimpleGrantedAuthority("ROLE_USER")));

        return userBuilder.build();
    }
}
