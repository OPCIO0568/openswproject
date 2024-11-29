package fundsite.fund_web_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import fundsite.fund_web_backend.model.DonationHistory;
import fundsite.fund_web_backend.model.User;

public interface DonationHistoryRepository extends JpaRepository<DonationHistory, Long> {
	List<DonationHistory> findByUser(User user);
}
