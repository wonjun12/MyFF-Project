집에서 테스시 수정 부분 (localhost)
- back  
> .env  
>> BACK_URL 수정  
> index.js  
>> cors정책 주석 해제  
> socket/socket.js  
>> socketIO(server) => socketIO(server, options)로 변경
  

- front  
> setupProxy  
>> url 수정  
> socket/socket.js  
>> url 수정  
> index.html  
>> kakaoAPI(appkey) 수정   
>> myff-master에 있는 값  