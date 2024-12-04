package fundsite.fund_web_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fundsite.fund_web_backend.model.Donation;
import fundsite.fund_web_backend.service.DonationService;
import fundsite.fund_web_backend.service.LikeService;

@RestController
@RequestMapping("/api/public/donations")
public class DonationPublicController {

    @Autowired
    private DonationService donationService;

    @Autowired
    private LikeService likeService;
    
    @GetMapping("/all")
    public ResponseEntity<?> getAllDonations() {
        try {
            // DonationService를 통해 모든 기부 데이터를 조회
            List<Donation> donations = donationService.getAllDonation();

            // 데이터가 비어 있는 경우 처리
            if (donations.isEmpty()) {
                return ResponseEntity.status(204).body(Map.of(
                    "status", "success",
                    "message", "현재 등록된 기부 게시판 정보가 없습니다.",
                    "data", List.of()
                ));
            }

            // 응답 데이터를 구조화하여 반환
            List<Map<String, Object>> responseData = donations.stream()
                    .map(donation -> Map.<String, Object>of(
                        "id", donation.getId(),
                        "title", donation.getTitle(),
                        "subtitle", donation.getSubtitle(),
                        "description", donation.getDescription(),
                        "goalAmount", donation.getGoalAmount(),
                        "collectedAmount", donation.getCollectedAmount(),
                        "donationType", donation.getDonationType(),
                        "mainImage", donation.getMainImage(),
                        "createrId", donation.getCreater_id()
                    ))
                    .toList();

            return ResponseEntity.ok(Map.of(
                "status", "success",
                "message", "모든 기부 게시판 정보가 성공적으로 반환되었습니다.",
                "data", responseData
            ));

        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "status", "error",
                "message", "모든 기부 게시판 정보를 조회하는 중 오류가 발생했습니다.",
                "details", e.getMessage()
            ));
        }
    }




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
