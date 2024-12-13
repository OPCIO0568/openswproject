package fundsite.fund_web_backend.controller;

import java.nio.file.Files;
import java.nio.file.StandardCopyOption;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;

import fundsite.fund_web_backend.dto.DonationReviewDTO;
import fundsite.fund_web_backend.model.DonationReview;
import fundsite.fund_web_backend.model.ReviewComment;
import fundsite.fund_web_backend.model.User;
import fundsite.fund_web_backend.repository.DonationReviewRepository;
import fundsite.fund_web_backend.repository.ReviewCommentRepository;
import fundsite.fund_web_backend.service.UserService;
import fundsite.fund_web_backend.util.JwtTokenProvider;

@RestController
@RequestMapping("/api/reviews")
public class PrivateReviewController {

    @Autowired
    private DonationReviewRepository donationReviewRepository;
    @Autowired
    private ReviewCommentRepository reviewCommentRepository;
    @Autowired
    private UserService userService;

    private final JwtTokenProvider jwtTokenProvider;
    PrivateReviewController(JwtTokenProvider jwtTokenProvider) {
        this.jwtTokenProvider = jwtTokenProvider;
    }

    @PostMapping("/{reviewId}/submit")
    public ResponseEntity<?> submitReview(
            @PathVariable("reviewId") Long reviewId,
            @RequestHeader("Authorization") String token,
            @RequestParam("file") MultipartFile file,
            @RequestParam("data") String data) {
        try {
            // JWT 토큰에서 사용자 정보 추출
            String parsedToken = token.replace("Bearer ", "");
            String username = jwtTokenProvider.getUsernameFromToken(parsedToken);
            User user = userService.getUserByUsername(username);

            // JSON 데이터를 DonationReview 객체로 변환
            ObjectMapper objectMapper = new ObjectMapper();
            DonationReview updatedReview = objectMapper.readValue(data, DonationReview.class);

            // 기존 리뷰 조회
            DonationReview existingReview = donationReviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found"));

            // 권한 확인
            if (!existingReview.getDonation().getCreater_id().equals(user.getId())) {
                throw new RuntimeException("Not authorized to submit this review.");
            }

            // 파일 저장 처리
            String uploadDir = "/Users/jjs_0/Desktop/mnt/data/reviewImages/" + reviewId;
            String fileName = "review_" + reviewId + "_" + file.getOriginalFilename();
            java.nio.file.Path filePath = java.nio.file.Paths.get(uploadDir, fileName);

            // 디렉토리 생성
            java.nio.file.Files.createDirectories(java.nio.file.Paths.get(uploadDir));

            // 파일 저장
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            // 리뷰 데이터 업데이트
            existingReview.setContent(updatedReview.getContent());
            existingReview.setImagePath("/images/review/" + reviewId + "/" + fileName);
            existingReview.setIsReviewed(true);

            donationReviewRepository.save(existingReview);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "리뷰가 성공적으로 제출되었습니다.",
                    "imagePath", "/images/review/" + reviewId + "/" + fileName
            ));
        } catch (Exception e) {
            return ResponseEntity.status(500).body(Map.of(
                    "status", "error",
                    "message", "리뷰 제출 중 오류가 발생했습니다.",
                    "error", e.getMessage()
            ));
        }
    }



    @PostMapping("/{reviewId}/comments")
    public ResponseEntity<DonationReviewDTO> addComment(
            @PathVariable("reviewId") Long reviewId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String token) {
        String content = request.get("content");

        DonationReview review = donationReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getIsReviewed()) {
            throw new RuntimeException("Review is not completed. Cannot add comments.");
        }

        String username = jwtTokenProvider.getUsernameFromToken(token.replace("Bearer ", ""));
        User user = userService.getUserByUsername(username);

        ReviewComment comment = new ReviewComment();
        comment.setReview(review);
        comment.setContent(content);
        comment.setCreatedBy(user);
        reviewCommentRepository.save(comment);

        return ResponseEntity.ok(new DonationReviewDTO(review));
    }


}

