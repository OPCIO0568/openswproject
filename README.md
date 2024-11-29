# 카드 포인트 기부 사이트

이 프로젝트는 카드 포인트를 이용하여 다양한 기부 활동을 지원할 수 있는 웹 애플리케이션입니다. 사용자는 포인트로 기부하거나 기부 내역을 확인하며, 관리자는 기부 정보를 관리할 수 있습니다.

---

## 🌟 주요 기능
- **회원가입 및 로그인**:
  - 사용자는 계정을 생성하고 로그인할 수 있습니다.
- **기부 목록 조회**:
  - 진행 중인 기부 캠페인을 확인할 수 있습니다.
- **기부 상세 보기**:
  - 특정 기부 캠페인의 세부 정보를 확인합니다.
- **기부하기**:
  - 카드 포인트를 사용해 원하는 금액을 기부할 수 있습니다.
- **기부 내역 관리**:
  - 사용자는 자신의 기부 내역을 확인할 수 있습니다.

---

## 🛠️ 기술 스택
### **백엔드**
- Java 17
- Spring Boot 3.0+
- JPA (Hibernate)
- MySQL

### **프론트엔드**
- React 18
- React Router DOM
- Axios

---

## 🚀 설치 및 실행

### **1. 백엔드**
1. 프로젝트 클론:
   ```
   bash
   git clone <repository-url>
   cd backend
   ```

2. 데이터베이스 설정:
- src/main/resources/application.properties 파일에서 MySQL 정보를 수정합니다.
```
spring.datasource.url=jdbc:mysql://localhost:3306/donation_db
spring.datasource.username=root
spring.datasource.password=admin
```

3. Spring Boot 서버 실행:
  ```bash
./gradlew bootRun
```
### **2. 프론트엔드**

1. React 프로젝트 클론:
  ```
cd frontend
npm install
```
2. React 개발 서버 실행
  ```
npm start
```
## 📖 API 설명
### **1. 사용자**

|HTTP Method|Endpoint|Description|
|:---|---:|:---:|
|POST|/register|사용자 회원가입|
|POST|/perform_login|사용자 로그인|
|GET|/mypage|사용자 기부 내역 조회|

### **2. 기부**
|HTTP Method|Endpoint|Description|
|:---|---:|:---:|
|GET|/api/donations/top3|상위 3개 기부 캠페인 조회|
|GET|/api/donations/{id}|특정 기부 캠페인 상세 조회|
|POST|//donation/{id}/donate|특정 캠페인에 기부액 추가|

## 📂 프로젝트 구조
### **백엔드**
  ```
src/
├── main/
│   ├── java/com/example/fundsite/
│   │   ├── controller/
│   │   ├── model/
│   │   ├── repository/
│   │   ├── service/
│   │   └── config/
│   └── resources/
│       ├── application.properties
│       └── static/
└── test/
```
### **프론트엔드**
```
src/
├── components/
│   ├── TopDonations.js
│   ├── DonationDetail.js
│   ├── Register.js
│   └── Login.js
├── App.js
└── index.js
```

## 📜 사용 예시

### **기부 목록 조회**
1. 브라우저에서 http://localhost:3000으로 이동.
2. 진행 중인 기부 목록이 표시됩니다.
   
### **기부하기**
1. 기부 목록에서 상세 보기를 클릭.
2. 원하는 금액을 입력하고 "기부하기" 버튼을 클릭.

## 🤝 기여
1. 저장소를 포크합니다.
2. 새로운 브랜치를 생성합니다:

```
git checkout -b feature-branch
```
3. 변경 사항을 커밋합니다:
```
git commit -m "Add new feature"
```
4. 브랜치에 푸시합니다:
```
git push origin feature-branch
```
5. Pull Request를 생성합니다.
   - - -

## 📧 문의

이 프로젝트에 대한 문의는 email@example.com으로 연락해주세요.
