package fundsite.fund_web_backend.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import fundsite.fund_web_backend.dto.DonationDTO;
import fundsite.fund_web_backend.model.Donation;
import fundsite.fund_web_backend.model.DonationHistory;
import fundsite.fund_web_backend.model.DonationReview;
import fundsite.fund_web_backend.model.User;
import fundsite.fund_web_backend.repository.DonationHistoryRepository;
import fundsite.fund_web_backend.repository.DonationRepository;
import fundsite.fund_web_backend.repository.DonationReviewRepository;
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
    private DonationReviewRepository donationReviewRepository;
    @Autowired
    private UserService userService; // UserService 활용 
    @Autowired
    private FileService fileService;
 
    
    public List<Donation> getAllDonation() {
        return donationRepository.findAll();
    }

    public List<Donation> getDonationsByTitle(String title) {
        return donationRepository.findByTitleContainingIgnoreCase(title);
    }
    @Transactional
    public List<Donation> getDonationsByType(Long donationType) {
        return donationRepository.findByDonationType(donationType);
    }
    public Donation getDonationById(Long id) {
        return donationRepository.findById(id).orElse(null);
    }
    
    public Donation createDonation(Donation donation) {
        return donationRepository.save(donation);
    }
    
    public User getUserByCreaterId(Long createrId) {
        return userRepository.findById(createrId)
                .orElseThrow(() -> new RuntimeException("User not found with ID: " + createrId));
    }
 // findById 메서드 추가
    public Donation findById(Long id) {
        Optional<Donation> donation = donationRepository.findById(id);
        if (donation.isPresent()) {
            // 강제로 연관 데이터를 초기화
            donation.get().getLikes().size();
        }
        return donation.orElse(null);
    }

    // save 메서드 추가
    public Donation save(Donation donation) {
        return donationRepository.save(donation);
    }

    public DonationDTO convertToDTO(Donation donation) {
        DonationDTO dto = new DonationDTO();
        dto.setId(donation.getId());
        dto.setTitle(donation.getTitle());
        dto.setSubtitle(donation.getSubtitle());
        dto.setDescription(donation.getDescription());
        dto.setGoalAmount(donation.getGoalAmount());
        dto.setDonationType(donation.getDonationType());
        return dto;
    }

 // Update Donation
    public Donation updateDonation(Long donationId, Donation newDonationData, MultipartFile file) throws Exception {
        // 1. 기존 데이터 조회
        Optional<Donation> optionalDonation = donationRepository.findById(donationId);
        if (!optionalDonation.isPresent()) {
            throw new Exception("Donation with ID " + donationId + " not found.");
        }
        Donation existingDonation = optionalDonation.get();

        // 2. 데이터 업데이트
        existingDonation.setTitle(newDonationData.getTitle());
        existingDonation.setSubtitle(newDonationData.getSubtitle());
        existingDonation.setDescription(newDonationData.getDescription());
        existingDonation.setGoalAmount(newDonationData.getGoalAmount());
        existingDonation.setDonationType(newDonationData.getDonationType());

        // 3. 파일 업데이트 처리
        if (file != null && !file.isEmpty()) {
            // 기존 파일 삭제
            fileService.deleteFile(donationId);

            // 새 파일 저장
            fileService.saveFile(file, donationId);
        }

        // 4. 데이터 저장
        return donationRepository.save(existingDonation);
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

        // 목표 금액 도달 여부 확인 후 후기 생성
        if (donation.getCollectedAmount() >= donation.getGoalAmount() && !donation.getIsGoalAchieved()) {
            donation.setIsGoalAchieved(true); // 목표 도달 상태 업데이트
            donationRepository.save(donation);

            // 빈 후기 생성
            DonationReview review = new DonationReview();
            review.setDonation(donation);
            review.setIsReviewed(false); // 초기 상태
            donationReviewRepository.save(review);
        }
    }

    
    @Transactional
    public void deleteDonation(Long donationId, String token) {
        // JWT 토큰에서 사용자 정보 가져오기
        User user = userService.getUserFromToken(token);

        // 삭제하려는 기부 게시판 가져오기
        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation board not found."));

        // 작성자 확인
        if (!donation.getCreater_id().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this donation board.");
        }

        // 업로드된 파일 삭제
        try {
            fileService.deleteFile(donationId);
        } catch (Exception e) {
            System.err.println("Error deleting files: " + e.getMessage());
        }

        // Donation 삭제 (CascadeType.REMOVE 설정으로 연관 데이터 자동 삭제)
        donationRepository.delete(donation);
    }


}
