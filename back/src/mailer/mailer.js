import 'dotenv/config';
import nodemail from 'nodemailer';

//보낼 메일 설정
const transporter = nodemail.createTransport({
    //어떤 서비스를 사용할거인가
    service: 'gmail',
    host: 'smtp.gmail.com',
    //어떤 포트를 사용할것인가
    port: 587,
    secure: false,
    //사용할 사용자 아이디 및 비밀번호
    //실제 사용하는 유저가 필요함
    auth:{
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PWD
    }
})

//이메일 전송 함수
const SendMail = async (pwd, toMail) => {
    //설정 옵션
    const options = {
        //보내는이
        from: `"Myff Project" <${process.env.MAIL_ID}>`,
        //받는이
        to: toMail,
        //제목
        subject: 'MyFF 비밀번호 변경메일입니다.',
        //내용
        html: `
        <div style='display: flex; flex-direction: row; justify-content: center; flex-wrap:wrap;'>
                <p style='width:100%; font-size:25px; text-align:center; font-weight:bold;'>비밀번호 재설정 이메일입니다!!! </p>
                <p>
                    잊으신 비밀번호 재설정을 위해 아래의 주소로 접속하여 입력해주세요!!! <br/>
                    ${process.env.BACK_URL}/reset/password?warPoint=${toMail}&parPoint=${pwd}
                </p>
            </div
        `
    };

    //실질적 이메일 보내기
    await transporter.sendMail(options);
}

export default SendMail;