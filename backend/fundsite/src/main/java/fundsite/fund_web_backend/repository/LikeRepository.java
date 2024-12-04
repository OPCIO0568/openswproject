package fundsite.fund_web_backend.repository;

import fundsite.fund_web_backend.model.Donation;
import fundsite.fund_web_backend.model.Like;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LikeRepository extends JpaRepository<Like, Long> {
    Optional<Like> findByUserIdAndDonation(Long userId, Donation donation);
    Long countByDonation(Donation donation);
}
