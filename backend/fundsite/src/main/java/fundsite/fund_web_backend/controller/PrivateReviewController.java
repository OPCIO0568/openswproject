package fundsite.fund_web_backend.controller;

import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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
    public ResponseEntity<DonationReviewDTO> submitReview(
            @PathVariable("reviewId") Long reviewId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String token) {
        String content = request.get("content");
        DonationReview review = donationReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        String username = jwtTokenProvider.getUsernameFromToken(token.replace("Bearer ", ""));
        if (!review.getDonation().getCreater_id().equals(userService.getUserByUsername(username).getId())) {
            throw new RuntimeException("Not authorized to submit this review.");
        }

        review.setContent(content);
        review.setIsCompleted(true);
        donationReviewRepository.save(review);

        return ResponseEntity.ok(new DonationReviewDTO(review));
    }


    @PostMapping("/{reviewId}/comments")
    public ResponseEntity<DonationReviewDTO> addComment(
            @PathVariable("reviewId") Long reviewId,
            @RequestBody Map<String, String> request,
            @RequestHeader("Authorization") String token) {
        String content = request.get("content");

        DonationReview review = donationReviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found"));

        if (!review.getIsCompleted()) {
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

