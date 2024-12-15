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
    private UserService userService;
    @Autowired
    private FileService fileService;

    private static final String DONATION_IMAGE_DIR = "C:/Users/jjs_0/Desktop/mnt/data/donation-images/";

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

    public Donation findById(Long id) {
        Optional<Donation> donation = donationRepository.findById(id);
        donation.ifPresent(d -> d.getLikes().size()); // 강제로 연관 데이터 초기화
        return donation.orElse(null);
    }

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

    public Donation updateDonation(Long donationId, Donation newDonationData, MultipartFile file) throws Exception {
        Optional<Donation> optionalDonation = donationRepository.findById(donationId);
        if (!optionalDonation.isPresent()) {
            throw new Exception("Donation with ID " + donationId + " not found.");
        }
        Donation existingDonation = optionalDonation.get();

        // 데이터 업데이트
        existingDonation.setTitle(newDonationData.getTitle());
        existingDonation.setSubtitle(newDonationData.getSubtitle());
        existingDonation.setDescription(newDonationData.getDescription());
        existingDonation.setGoalAmount(newDonationData.getGoalAmount());
        existingDonation.setDonationType(newDonationData.getDonationType());

        // 파일 처리
        if (file != null && !file.isEmpty()) {
            fileService.deleteFile(DONATION_IMAGE_DIR, donationId); // 기존 파일 삭제
            fileService.saveFile(file, DONATION_IMAGE_DIR, donationId, "main1.jpg"); // 새 파일 저장
        }

        return donationRepository.save(existingDonation);
    }

    @Transactional
    public void donate(Long donationId, String token, double amount) {
        User user = userService.getUserFromToken(token);

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation not found"));

        if (user.getBalance() < amount) {
            throw new RuntimeException("Insufficient balance");
        }

        user.setBalance(user.getBalance() - amount);
        userRepository.save(user);

        donation.setCollectedAmount(donation.getCollectedAmount() + amount);
        donationRepository.save(donation);

        DonationHistory history = new DonationHistory();
        history.setUser(user);
        history.setDonation(donation);
        history.setAmount(amount);
        history.setTimestamp(LocalDateTime.now());
        donationHistoryRepository.save(history);

        if (donation.getCollectedAmount() >= donation.getGoalAmount() && !donation.getIsGoalAchieved()) {
            donation.setIsGoalAchieved(true);
            donationRepository.save(donation);

            DonationReview review = new DonationReview();
            review.setDonation(donation);
            review.setIsReviewed(false);
            donationReviewRepository.save(review);
        }
    }

    @Transactional
    public void deleteDonation(Long donationId, String token) {
        User user = userService.getUserFromToken(token);

        Donation donation = donationRepository.findById(donationId)
                .orElseThrow(() -> new RuntimeException("Donation board not found."));

        if (!donation.getCreater_id().equals(user.getId())) {
            throw new RuntimeException("You are not authorized to delete this donation board.");
        }

        try {
            fileService.deleteFile(DONATION_IMAGE_DIR, donationId);
        } catch (Exception e) {
            System.err.println("Error deleting files: " + e.getMessage());
        }

        donationRepository.delete(donation);
    }
}
