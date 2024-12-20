package fundsite.fund_web_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import fundsite.fund_web_backend.model.Donation;
import fundsite.fund_web_backend.service.DonationService;

@RestController
@RequestMapping("/api/donations")
public class DonationController {

    @Autowired
    private DonationService donationService;


    /**
     * 상위 3개의 기부 항목 반환
     */
    @GetMapping("/top3")
    public List<Donation> getTopDonations() {
        return donationService.getTop3Donations();
    }

    /**
     * 제목 또는 기부 타입으로 기부 항목 검색
     */
    /**
     * JSON 데이터를 받아 기부 항목 검색
     * @param searchCriteria 검색 조건(JSON 형식)
     * @return 검색 결과
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
    
    
    
    @PostMapping("/detail")
    public ResponseEntity<?> getDonationDetail(@RequestBody Map<String, Object> payload) {
        try {
            // 요청 데이터 검증
            if (!payload.containsKey("id") || payload.get("id") == null) {
                return ResponseEntity.badRequest().body(Map.of("error", "Donation ID is required"));
            }

            Long id;
            try {
                id = Long.parseLong(payload.get("id").toString());
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest().body(Map.of("error", "Donation ID must be a valid number"));
            }

            // 기부 항목 조회
            Donation donation = donationService.getDonationById(id);

            // 항목이 없는 경우
            if (donation == null) {
                return ResponseEntity.status(404).body(Map.of("error", "Donation not found"));
            }

            // JSON 응답 반환
            return ResponseEntity.ok(Map.of(
                    "id", donation.getId(),
                    "title", donation.getTitle(),
                    "subtitle", donation.getSubtitle(),
                    "description", donation.getDescription(),
                    "goalAmount", donation.getGoalAmount(),
                    "collectedAmount", donation.getCollectedAmount(),
                    "donationType", donation.getDonationType(),
                    "mainImage", donation.getMainImage()
            ));

        } catch (Exception e) {
            // 예외 처리
            return ResponseEntity.status(500).body(Map.of(
                    "error", "An unexpected error occurred",
                    "details", e.getMessage()
            ));
        }
    }
    

    /**
     * 기부 처리
     */
    @PostMapping("/donate")
    public ResponseEntity<Map<String, String>> donate(
            @RequestBody Map<String, Object> payload,
            @RequestHeader("Authorization") String authorizationHeader) {

        try {
            // Authorization 헤더에서 토큰 추출
            String token = authorizationHeader.replace("Bearer ", "");

            // 요청 데이터 검증
            if (!payload.containsKey("id") || !payload.containsKey("amount")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid or missing donation ID or amount"));
            }

            Long id;
            Double amount;

            try {
                id = Long.parseLong(payload.get("id").toString());
                amount = Double.parseDouble(payload.get("amount").toString());
            } catch (NumberFormatException e) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Donation ID and amount must be valid numbers"));
            }

            if (amount <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Amount must be greater than 0"));
            }

            // 기부 처리
            donationService.donate(id, token, amount);

            // JSON 형태의 응답 반환
            return ResponseEntity.ok(Map.of("message", "Donation successful"));

        } catch (RuntimeException e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }

}
