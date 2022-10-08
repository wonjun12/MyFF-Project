Web Porject

@db connect
    : npm run conn
@node run
    : npm run start
@db disconnect
    : npm run disconn


[windows 설치 파일]
    - mysql
        1) https://dev.mysql.com/downloads/file/?id=512698
        2) "No thanks, just start my download." <- 클릭
        3)  아래 사진 제외하고 전부 NEXT
        ![DB설치](./mysqlSelect.png)

[스크립트 실행 오류]
    1) "Windows PowerShell" <- windows 검색
    2) 관리자 권한 실행
    3) "get-ExecutionPolicy" <- 입력
    4) "RemoteSigned" 아닌것을 확인
    5) "Set-ExecutionPolicy RemoteSigned" <- 입력


[완성 순서]
    1. 3000포트 서버 열기
    2. 기본 Controller, Router 설정
    3. 기본 Mysql DB 연결 완료

[진행 중]
    - 회원 가입 패스워드 암호화 구현
    - 회원 가입 DB 구현
    - 로그인 DB 구현
