import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Styles from './Password.module.scss'

const SERVER_URL = "/api/home/";

const Password = () => {

  const params = new URLSearchParams(window.location.search);
  const point = {
    warPoint: params.get('warPoint'),
    parPoint: params.get('parPoint'),
  }
  const [emailPost, setEmailPost] = useState("");
  const [pwdCk, setPwdCk] = useState("");
  const [pwdMsg, setpwdMsg] = useState("");
  const [urlCk, setUrlCk] = useState(false);
  const pwdRef = useRef();
  

  const passwordPostFnc = async (e) => {
    e.preventDefault();

    const { newPassword, newPasswordCk } = e.target;

    if (newPassword.value !== "" && newPassword.value === newPasswordCk.value) {

      const res = await axios.post(SERVER_URL+"pwdChange", {
        email: point.warPoint,
        originPwd: point.parPoint,
        newPwd: newPassword.value,
      });
      const { result } = res.data;
      if (result) {
        window.location.href = '/';
      } else {
        alert("아이디 혹은 비밀번호가 올바르지 않습니다.\n다시 접속 해주세요.");
      }
    }
  }

  const pwdCkFnc = (e) => {    //비번유효성
    const pwdRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;
    if (!pwdRegEx.test(pwdRef.current.value)) {
      setpwdMsg('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
    } else if (pwdRef.current.value !== e.target.value) {
      setPwdCk("비밀번호가 일치하지않습니다.");
    } else {
      setpwdMsg("");
      setPwdCk("");
    }
  }

  const emailPostFnc = async (e)=> {
    e.preventDefault();
    const { email } = e.target;
    await axios.post(SERVER_URL+"pwdMail", {
      email: email.value,
    });
    setEmailPost("이메일을 성공적으로 보냈습니다.")
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    if (!!point.warPoint && !!point.parPoint) {
      setUrlCk(true);
    }

  }, [])

  return (
    <>
      <div className={Styles.back} onClick={() => {window.location.href = '/'}}></div>
      <div className={Styles.container}>
        {urlCk ? (
          <div className={Styles.formDiv}>
            <form onSubmit={passwordPostFnc}>
              <h1>MYFF</h1>
              <h2>비밀번호 변경</h2>
              <input type="password" name="newPassword" placeholder="새로운 비밀번호" ref={pwdRef} onChange={pwdCkFnc} />
              <p>{pwdMsg}</p>
              <input type="password" name="newPasswordCk" placeholder="새로운 비밀번호 확인" onChange={(e) => pwdCkFnc(e)} />
              <p>{pwdCk}</p>
              <button type="submit">변경</button>
            </form>
          </div>
        ) : (
          <div className={Styles.formDiv}>
            <form onSubmit={emailPostFnc}>
              <h1>MYFF</h1>
              <h2>비밀번호 찾기</h2>
              <input type="text" name="email" placeholder="이메일을 입력해주세요"/>
              <p>{emailPost}</p>
              <button type="submit">전송</button>
            </form>
          </div>
        )}

      </div>
    </>
  );
}

export default Password;