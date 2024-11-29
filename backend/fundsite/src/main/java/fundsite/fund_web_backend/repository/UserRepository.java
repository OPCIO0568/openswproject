package fundsite.fund_web_backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import fundsite.fund_web_backend.model.User;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUsername(String username);
    
    
}
