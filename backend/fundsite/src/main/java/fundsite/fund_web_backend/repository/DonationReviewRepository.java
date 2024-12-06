package fundsite.fund_web_backend.repository;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import fundsite.fund_web_backend.model.DonationReview;

@Repository
public interface DonationReviewRepository extends JpaRepository<DonationReview, Long> {
}
