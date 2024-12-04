package fundsite.fund_web_backend.controller;

import fundsite.fund_web_backend.model.Donation;
import fundsite.fund_web_backend.service.DonationService;
import fundsite.fund_web_backend.service.LikeService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;
import java.util.List;

@RestController
@RequestMapping("/api/public/donations")
public class DonationPublicController {

    @Autowired
    private DonationService donationService;

    @Autowired
    private LikeService likeService;


    /**
     * 제목 또는 기부 타입으로 기부 항목 검색
     */
    @PostMapping("/search")
    public ResponseEntity<?> searchDonations(@RequestBody Map<String, Object> searchCriteria) {
        String title = (String) searchCriteria.get("title");
        Long donationType = searchCriteria.get("donationType") != null
                ? Long.valueOf(searchCriteria.get("donationType").toString())
                : null;

        if (title == null && donationType == null) {
            return ResponseEntity.badRequest()
                    .body("검색 조건(title 또는 donationType)을 하나 이상 제공해야 합니다.");
        }

        try {
            List<Donation> results;
            if (title != null) {
                results = donationService.getDonationsByTitle(title);
            } else {
                results = donationService.getDonationsByType(donationType);
            }
            return ResponseEntity.ok(results);
        } catch (Exception e) {
            return ResponseEntity.status(500).body("검색 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    /**
     * 좋아요 개수 조회
     */
    @PostMapping("/likes/count")
    public ResponseEntity<?> getLikeCount(@RequestBody Map<String, Object> payload) {
        try {
            if (!payload.containsKey("id") || payload.get("id") == null) {
                return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Donation ID is required"));
            }

            Long donationId;
            try {
                donationId = Long.parseLong(payload.get("id").toString());
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Donation ID must be a valid number"));
            }

            Donation donation = donationService.getDonationById(donationId);

            if (donation == null) {
                return ResponseEntity.status(404).body(Map.of("status", "error", "message", "Donation not found"));
            }

            Long likeCount = likeService.getLikeCount(donation);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "좋아요 개수가 성공적으로 반환되었습니다.",
                    "data", Map.of("likeCount", likeCount)
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "좋아요 개수 조회 중 오류가 발생했습니다.",
                    "details", e.getMessage()
            ));
        }
    }



    /**
     * 기부 게시판 상세 조회
     */
    @PostMapping("/detail")
    public ResponseEntity<?> getDonationDetail(@RequestBody Map<String, Object> payload) {
        try {
            if (!payload.containsKey("id") || payload.get("id") == null) {
                return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Donation ID is required"));
            }

            Long id;
            try {
                id = Long.parseLong(payload.get("id").toString());
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(Map.of("status", "error", "message", "Donation ID must be a valid number"));
            }

            Donation donation = donationService.getDonationById(id);

            if (donation == null) {
                return ResponseEntity.status(404).body(Map.of("status", "error", "message", "Donation not found"));
            }

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "기부 게시판 상세 정보가 성공적으로 반환되었습니다.",
                    "data", Map.of(
                        "id", donation.getId(),
                        "collectedAmount", donation.getCollectedAmount(),
                        "createrId", donation.getCreater_id(),
                        "description", donation.getDescription(),
                        "donationType", donation.getDonationType(),
                        "goalAmount", donation.getGoalAmount(),
                        "mainImage", donation.getMainImage(),
                        "subtitle", donation.getSubtitle(),
                        "title", donation.getTitle()
                    )
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "An unexpected error occurred",
                    "details", e.getMessage()
            ));
        }
    }

}