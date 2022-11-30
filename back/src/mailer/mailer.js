import 'dotenv/config';
import nodemail from 'nodemailer';

const transporter = nodemail.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth:{
        user: process.env.MAIL_ID,
        pass: process.env.MAIL_PWD
    }
})

const SendMail = async (pwd, toMail) => {
    const options = {
        from: `"Myff Project" <${process.env.MAIL_ID}>`,
        to: toMail,
        subject: 'MyFF 비밀번호 변경메일입니다.',
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

    await transporter.sendMail(options);
}

export default SendMail;