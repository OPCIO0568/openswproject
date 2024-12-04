package fundsite.fund_web_backend.repository;

import java.util.List;

import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import fundsite.fund_web_backend.model.Donation;

public interface DonationRepository extends JpaRepository<Donation, Long> {
	// 제목으로 검색
    List<Donation> findByTitleContainingIgnoreCase(String title);

    @EntityGraph(attributePaths = {"likes"})
    List<Donation> findByDonationType(Long donationType);
}
