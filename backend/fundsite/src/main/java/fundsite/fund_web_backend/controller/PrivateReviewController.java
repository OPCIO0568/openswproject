package fundsite.fund_web_backend.controller;

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
import fundsite.fund_web_backend.service.FileService;
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
    @Autowired
    private FileService fileService;

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
            String parsedToken = token.replace("Bearer ", "");
            String username = jwtTokenProvider.getUsernameFromToken(parsedToken);
            User user = userService.getUserByUsername(username);

            ObjectMapper objectMapper = new ObjectMapper();
            DonationReview updatedReview = objectMapper.readValue(data, DonationReview.class);

            DonationReview existingReview = donationReviewRepository.findById(reviewId)
                    .orElseThrow(() -> new RuntimeException("Review not found"));

            if (!existingReview.getDonation().getCreater_id().equals(user.getId())) {
                throw new RuntimeException("Not authorized to submit this review.");
            }

            String imagePath = fileService.saveReviewFile(file, reviewId);
            existingReview.setContent(updatedReview.getContent());
            existingReview.setImagePath(imagePath);
            existingReview.setIsReviewed(true);

            donationReviewRepository.save(existingReview);

            return ResponseEntity.ok(Map.of(
                    "status", "success",
                    "message", "리뷰가 성공적으로 제출되었습니다.",
                    "imagePath", imagePath
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

        return ResponseEntity.ok(new DonationReviewDTO(review, username));
    }


}

