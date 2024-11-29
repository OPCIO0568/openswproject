package fundsite.fund_web_backend.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import fundsite.fund_web_backend.model.DonationHistory;
import fundsite.fund_web_backend.model.User;
import fundsite.fund_web_backend.service.DonationHistoryService;
import fundsite.fund_web_backend.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final DonationHistoryService donationHistoryService;

    public UserController(UserService userService, DonationHistoryService donationHistoryService) {
        this.userService = userService;
        this.donationHistoryService = donationHistoryService;
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
}
