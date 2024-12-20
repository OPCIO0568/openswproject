package fundsite.fund_web_backend.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
@Entity
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)	
    private String username; // 아이디 (로그인용)

    private String profilepath; // 프로필 사진 경로
    
    @Column(nullable = false)
    private String password; // 비밀번호

    @Column(nullable = false)
    private String nickname; // 닉네임

    private Double balance; // 보유 금액
    
    public void setBalance(double balance) {
        this.balance = balance; // 필요한 경우 변환
    }
    
    public Double getBalance() {
        return balance;
    }
}
