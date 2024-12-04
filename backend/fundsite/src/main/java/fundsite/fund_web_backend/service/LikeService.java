package fundsite.fund_web_backend.service;

import fundsite.fund_web_backend.model.Donation;
import fundsite.fund_web_backend.model.Like;
import fundsite.fund_web_backend.repository.LikeRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class LikeService {

    @Autowired
    private LikeRepository likeRepository;

    public String likeDonation(Long userId, Donation donation) {
        Optional<Like> existingLike = likeRepository.findByUserIdAndDonation(userId, donation);

        if (existingLike.isPresent()) {
            return "이미 좋아요를 누르셨습니다.";
        }

        Like like = new Like();
        like.setUserId(userId);
        like.setDonation(donation);
        likeRepository.save(like);

        return "좋아요 성공!";
    }

    public Long getLikeCount(Donation donation) {
        return likeRepository.countByDonation(donation);
    }
}
