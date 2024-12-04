package fundsite.fund_web_backend.model;

import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import lombok.Getter;
import lombok.Setter;

@Entity
@Getter
@Setter
public class Donation {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private Long creater_id; // 기부게시판 만든이

    private Long donationType; // 기부 타입
    private String title; // 제목
    private String subtitle; // 부제목
    private String description; // 설명
    private String mainImage; // 주 이미지 URL

    private Double goalAmount; // 목표 금액
    private Double collectedAmount = 0.0; // 모인 금액 (0 초기화)

    @OneToMany(mappedBy = "donation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Like> likes = new ArrayList<>();
    
    @OneToMany(mappedBy = "donation", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<DonationHistory> donationHistories = new ArrayList<>();
}
