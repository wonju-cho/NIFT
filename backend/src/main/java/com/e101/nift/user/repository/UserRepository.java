package com.e101.nift.user.repository;

<<<<<<< HEAD
import org.springframework.stereotype.Repository;

@Repository
public class UserRepository {
=======
import com.e101.nift.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByKakaoId(String kakaoId);
>>>>>>> 406ced2d1fb6b88b4234573762974b09701046ec
}
