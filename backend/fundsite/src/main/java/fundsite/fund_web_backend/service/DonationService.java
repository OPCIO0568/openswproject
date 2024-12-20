package fundsite.fund_web_backend.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fundsite.fund_web_backend.model.Donation;
import fundsite.fund_web_backend.model.DonationHistory;
import fundsite.fund_web_backend.model.User;
import fundsite.fund_web_backend.repository.DonationHistoryRepository;
import fundsite.fund_web_backend.repository.DonationRepository;
import fundsite.fund_web_backend.repository.UserRepository;
import jakarta.transaction.Transactional;

@Service
public class DonationService {
	
	@Autowired
    private UserRepository userRepository;

    @Autowired
    private DonationRepository donationRepository;

    @Autowired
    private DonationHistoryRepository donationHistoryRepository;

    @Autowired
    private UserService userService; // UserService 활용

    public List<Donation> getTop3Donations() {
        return donationRepository.findAll().stream().limit(3).toList();
    }

    public List<Donation> getDonationsByTitle(String title) {
        return donationRepository.findByTitleContainingIgnoreCase(title);
    }

    public List<Donation> getDonationsByType(Long donationType) {
        return donationRepository.findByDonationType(donationType);
    }

    public Donation getDonationById(Long id) {
        return donationRepository.findById(id).orElse(null);
    }
    
    @Transactional
    public void donate(Long donationId, String token, double amount) {
        // 사용자 정보 가져오기
        User user = userService.getUserFromToken(token);

        // 기부 항목 가져오기
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        // 사용자 잔액 확인
        if (user.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        // 사용자 잔액 업데이트
        user.setBalance(user.getBalance() - amount);
        userRepository.save(user);

        // 기부 금액 업데이트
        donation.setCollectedAmount(donation.getCollectedAmount() + amount);
        donationRepository.save(donation);

        // 기부 이력 생성 및 저장
        DonationHistory history = new DonationHistory();
        history.setUser(user);
        history.setDonation(donation);
        history.setAmount(amount);
        history.setTimestamp(LocalDateTime.now());
        donationHistoryRepository.save(history);
    }
}
