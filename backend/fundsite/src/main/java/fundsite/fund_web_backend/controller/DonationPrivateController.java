package fundsite.fund_web_backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import fundsite.fund_web_backend.model.Donation;
import fundsite.fund_web_backend.model.User;
import fundsite.fund_web_backend.service.DonationService;
import fundsite.fund_web_backend.service.FileService;
import fundsite.fund_web_backend.service.LikeService;
import fundsite.fund_web_backend.service.UserService;
import fundsite.fund_web_backend.util.JwtTokenProvider;

@RestController
@RequestMapping("/api/private/donations")
public class DonationPrivateController {

    @Autowired
    private DonationService donationService;

    @Autowired
    private LikeService likeService;

    @Autowired
    private UserService userService;

    @Autowired
    private FileService fileService;

    private final JwtTokenProvider jwtTokenProvider;

    DonationPrivateController(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    /**
     * 기부 게시판 생성
     */
    @PostMapping("/create")
    public ResponseEntity<?> createDonationBoard(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file,
            @RequestParam("data") String data) {
        try {
            String parsedToken = token.replace("Bearer ", "");
            String username = jwtTokenProvider.getUsernameFromToken(parsedToken);

            User user = userService.getUserByUsername(username);
            Long userId = user.getId();

            ObjectMapper objectMapper = new ObjectMapper();
            Donation donation = objectMapper.readValue(data, Donation.class);

            donation.setCreater_id(userId);

            Donation savedDonation = donationService.createDonation(donation);
            String imagePath = fileService.saveFile(file, savedDonation.getId());
            savedDonation.setMainImage(imagePath);

            Donation updatedDonation = donationService.createDonation(savedDonation);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "기부 게시판이 성공적으로 생성되었습니다.",
                    "data", updatedDonation
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "기부 게시판 생성 중 오류가 발생했습니다.",
                    "error", e.getMessage()
            ));
        }
    }
    
    /**
     * 기부 게시판 삭제
     */
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteDonationBoard(
            @RequestHeader("Authorization") String token,
            @PathVariable("id") Long donationId) { // 명시적으로 변수 이름 설정
        try {
            String parsedToken = token.replace("Bearer ", "");
            donationService.deleteDonation(donationId, parsedToken);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "기부 게시판이 성공적으로 삭제되었습니다."
            ));
        } catch (RuntimeException e) {
            return ResponseEntity.status(403).body(Map.of(
                    "status", "error",
                    "message", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "기부 게시판 삭제 중 오류가 발생했습니다.",
                    "error", e.getMessage()
            ));
        }
    }




    /**
     * 좋아요 처리
     */
    @PostMapping("/like/{id}")
    public ResponseEntity<?> likeDonation(
            @PathVariable("id") Long donationId,
            @RequestHeader("Authorization") String token) {
        try {
            // 토큰에서 사용자 이름 추출
            String parsedToken = token.replace("Bearer ", "");
            String username = jwtTokenProvider.getUsernameFromToken(parsedToken);

            // 사용자 정보 조회
            User user = userService.getUserByUsername(username);

            // 기부 정보 조회
            Donation donation = donationService.getDonationById(donationId);

            if (donation == null) {
                return ResponseEntity.status(404).body(Map.of(
                    "error", "Donation not found"
                ));
            }

            // 좋아요 처리
            String result = likeService.likeDonation(user.getId(), donation);

            // 결과 반환
            return ResponseEntity.ok(Map.of(
                "message", result
            ));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                "error", "잘못된 요청입니다.",
                "details", e.getMessage()
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                "error", "좋아요 처리 중 오류 발생",
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
            String token = authorizationHeader.replace("Bearer ", "");

            if (!payload.containsKey("id") || !payload.containsKey("amount")) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Invalid or missing donation ID or amount"));
            }

            Long id = Long.parseLong(payload.get("id").toString());
            Double amount = Double.parseDouble(payload.get("amount").toString());

            if (amount <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "Amount must be greater than 0"));
            }

            donationService.donate(id, token, amount);

            return ResponseEntity.ok(Map.of("message", "Donation successful"));
        } catch (RuntimeException e) {
            return ResponseEntity.status(500)
                    .body(Map.of("error", "An unexpected error occurred: " + e.getMessage()));
        }
    }
}
