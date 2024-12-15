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
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import fundsite.fund_web_backend.model.DonationHistory;
import fundsite.fund_web_backend.model.User;
import fundsite.fund_web_backend.service.DonationHistoryService;
import fundsite.fund_web_backend.service.FileService;
import fundsite.fund_web_backend.service.UserService;
import fundsite.fund_web_backend.util.JwtTokenProvider;

@RestController
@RequestMapping("/api/users")
public class UserController {

	private final UserService userService;
    private final DonationHistoryService donationHistoryService;
    private final JwtTokenProvider jwtTokenProvider;
    @Autowired
    private FileService fileService;

    public UserController(UserService userService, 
                          DonationHistoryService donationHistoryService,
                          JwtTokenProvider jwtTokenProvider) {
        this.userService = userService;
        this.donationHistoryService = donationHistoryService;
        this.jwtTokenProvider = jwtTokenProvider; // 주입 추가
    }

    /**
     * 사용자 정보 조회
     */
    @GetMapping("/mypage")
    public ResponseEntity<User> getUserInfo(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        User user = userService.getUserFromToken(token);
        return ResponseEntity.ok(user);
    }

    /**
     * 사용자 기부 내역 조회
     */
    @GetMapping("/donations")
    public ResponseEntity<List<DonationHistory>> getUserDonations(@RequestHeader("Authorization") String authorizationHeader) {
        String token = authorizationHeader.replace("Bearer ", "");
        List<DonationHistory> donationHistories = donationHistoryService.getDonationHistoriesByToken(token);
        return ResponseEntity.ok(donationHistories);
    }

    /**
     * 사용자 잔액 추가
     */
    @PostMapping("/addbalance")
    public ResponseEntity<Map<String, String>> addBalance(
            @RequestHeader("Authorization") String authorizationHeader,
            @RequestBody Map<String, Double> payload) {
        String token = authorizationHeader.replace("Bearer ", "");
        Double amount = payload.get("amount");
        userService.addBalanceByToken(token, amount);
        return ResponseEntity.ok(Map.of("message", "Balance added successfully"));
    }
    
    @PostMapping("/uploadProfileImage")
    public ResponseEntity<?> uploadProfileImage(
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file) {
        try {
            String parsedToken = token.replace("Bearer ", "");
            String username = jwtTokenProvider.getUsernameFromToken(parsedToken);

            User user = userService.getUserByUsername(username);
            String imagePath = fileService.saveUserProfileFile(file, user.getId(), user.getUsername());

            user.setProfilepath(imagePath);
            userService.saveUser(user);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "프로필 이미지가 성공적으로 업로드되었습니다.",
                    "imagePath", imagePath
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "프로필 이미지 업로드 중 오류가 발생했습니다.",
                    "error", e.getMessage()
            ));
        }
    }

}
