# 구상

1. 목표치 금액을 넘기면 리뷰 데이터베이스에 깡통 데이터를 넣도록 하였음(넘기는거 donation_id 만)
2. 그럼 리뷰 데이터베이스를 조회를 하면 깡통 데이터를 조회할수 있음 
3. 기부게시글 작성자만 리뷰를 쓸수있음
4. 리뷰 작성후 밑에 댓글도 쓸수있음

# *** 이거 보는법 ***
(첫api는 front → back / 다음 api는 back → front)

## 1. 게시글 수정 api

```html
PUT /api/private/donations/update/14 HTTP/1.1
Host: localhost:8080
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJqanMwNjMwMSIsImlhdCI6MTczMzQ3NDc3OCwiZXhwIjoxNzMzNDc4Mzc4fQ.tf7Va__7SibkAZNJVLKHguchWon3CG7bnVhvBkPkkHs
Cookie: JSESSIONID=260D3DDB6694BCEF3255B5FB385D8589
Content-Length: 467
Content-Type: multipart/form-data; boundary=----WebKitFormBoundary7MA4YWxkTrZu0gW

------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="file"; filename="[PROXY]"
Content-Type: <Content-Type header here>

(data)
------WebKitFormBoundary7MA4YWxkTrZu0gW
Content-Disposition: form-data; name="data"

{
    "title": "Help this poor student",
    "subtitle": "u can rescue him",
    "description": "Maybe, he will die soonnnnnnn........",
    "goalAmount":5000.0 ,
    "donationType": 2
}
------WebKitFormBoundary7MA4YWxkTrZu0gW--

```

```html
{
    "id": 14,
    "title": "Help this poor student",
    "subtitle": "u can rescue him",
    "description": "Maybe, he will die soonnnnnnn........",
    "goalAmount": 5000.0,
    "donationType": 2
}
```

## 2. 모든 리뷰게시판 보기

```html
GET /api/public/reviews/all HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=260D3DDB6694BCEF3255B5FB385D8589
```

```html
[
    {
        "id": 1,
        "content": "We are thrilled to announce that we have reached our goal. Thank you for your support!",
        "isCompleted": true,
        "donationTitle": "Help this poor student"
    }
]
```

## 3. 게시글의 댓글보기([http://localhost:8080/api/public/reviews/{reviewId}/comments](http://localhost:8080/api/public/reviews/%7BreviewId%7D/comments))

```html
GET /api/public/reviews/1/comments HTTP/1.1
Host: localhost:8080
Cookie: JSESSIONID=260D3DDB6694BCEF3255B5FB385D8589
```

```html
[
    {
        "id": 1,
        "createdAt": "2024-12-06T17:04:16.086904",
        "createdBy": {
            "username": "jjs06301",
            "id": 5
        },
        "content": "Congratulations on reaching your goal!"
    }
]
```

## 4. 리뷰 게시글 쓰기([http://localhost:8080/api/reviews/{reviewId}/submit](http://localhost:8080/api/reviews/%7BreviewId%7D/submit))

```html
POST /api/reviews/1/submit HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: ••••••
Cookie: JSESSIONID=260D3DDB6694BCEF3255B5FB385D8589
Content-Length: 107

{
  "content": "We are thrilled to announce that we have reached our goal. Thank you for your support!"
}
```

```html
{
    "id": 1,
    "content": "We are thrilled to announce that we have reached our goal. Thank you for your support!",
    "isCompleted": true,
    "donationTitle": "Help this poor student"
}
```

## 5. 리뷰 게시글의 댓글 쓰기([http://localhost:8080/api/reviews/{reviewId}/comments](http://localhost:8080/api/reviews/%7BreviewId%7D/comments))

```html
POST /api/reviews/1/comments HTTP/1.1
Host: localhost:8080
Content-Type: application/json
Authorization: ••••••
Cookie: JSESSIONID=260D3DDB6694BCEF3255B5FB385D8589
Content-Length: 29

{
  "content": "힝힝힝..."
}

```

```html
{
    "id": 1,
    "content": "We are thrilled to announce that we have reached our goal. Thank you for your support!",
    "isCompleted": true,
    "donationTitle": "Help this poor student"
}
```

# 요구사항

1. 기부사이트 소개 페이지 추가
2. 리뷰페이지 추가(위 요구사항 대로)
