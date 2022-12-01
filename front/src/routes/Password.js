import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Styles from './Password.module.scss'

const SERVER_URL = "/api/home/";

const Password = () => {

  const navigate = useNavigate();
  //get방식의 params
  const params = new URLSearchParams(window.location.search);
  //params의 값을 가져온다.
  const point = {
    warPoint: params.get('warPoint'),
    parPoint: params.get('parPoint'),
  }
  //비밀번호
  const [pwdCk, setPwdCk] = useState("");
  const [pwdMsg, setpwdMsg] = useState("");
  //이메일 or 변경 여부
  const [urlCk, setUrlCk] = useState(false);
  //유효성 검사
  const pwdRef = useRef();
  


  //비밀번호 변경 POST
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
        Swal.fire({
          position: 'top-end',
          icon: 'success',
          title: '비밀번호 변경 완료!',
          showConfirmButton: false,
          timer: 1200
        })
      } else {
        Swal.fire({
          icon: 'error',
          title: '잘못된 접근',
          text: '잘못된 접근입니다!!',
        })
      }
      navigate('/');
    }
  }

//비번유효성
  const pwdCkFnc = (e) => {    
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

  //이메일 보내기
  const emailPostFnc = async (e)=> {
    e.preventDefault();
    const { email } = e.target;
    await axios.post(SERVER_URL+"pwdMail", {
      email: email.value,
    });
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: '이메일을 성공적으로 보냈습니다.',
      showConfirmButton: false,
      timer: 1500
    })
  }

  //스크롤 막기
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    //이메일 or 변경 여부 확인
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
              <button type="submit">전송</button>
            </form>
          </div>
        )}

      </div>
    </>
  );
}

export default Password;