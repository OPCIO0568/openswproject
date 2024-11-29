package fundsite.fund_web_backend.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import fundsite.fund_web_backend.model.DonationHistory;
import fundsite.fund_web_backend.model.User;
import fundsite.fund_web_backend.repository.DonationHistoryRepository;

@Service
public class DonationHistoryService {

    @Autowired
    private DonationHistoryRepository donationHistoryRepository;

    @Autowired
    private UserService userService; // UserService 활용

    /**
     * JWT 토큰을 이용하여 특정 사용자의 기부 이력을 조회합니다.
     * @param token JWT 토큰
     * @return 사용자의 기부 이력 목록
     */
    public List<DonationHistory> getDonationHistoriesByToken(String token) {
        // 토큰에서 사용자 정보 추출
        User user = userService.getUserFromToken(token);

        // 사용자 ID를 이용해 기부 이력 조회
        return donationHistoryRepository.findByUser(user);
    }
}
