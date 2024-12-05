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
        // 좋아요 여부 확인
        Optional<Like> existingLike = likeRepository.findByUserIdAndDonation(userId, donation);

        if (existingLike.isPresent()) {
            // 기존 좋아요 삭제
            likeRepository.delete(existingLike.get());
            return "좋아요 취소.";
        }
        else { 
        	// 새로운 좋아요 추가
        	Like like = new Like();
        	like.setUserId(userId);
        	like.setDonation(donation);
        	likeRepository.save(like);

        	return "좋아요 성공!";
        }
    }

    public Long getLikeCount(Donation donation) {
        return likeRepository.countByDonation(donation);
    }
    
}
