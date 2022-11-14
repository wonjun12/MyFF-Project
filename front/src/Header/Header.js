import React, { useState } from "react";
import Styles from "./Header.module.scss";
import Login from "./Login";
import {Link} from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";


const SERVER_URL = "/api/user";

function Header() {
  

  const loginCk = () => {
    axios.get(`/api/home/login`)
      .then(res => {
      sessionStorage.setItem('loginUserId', res.data.NickName);
      sessionStorage.setItem('loginUID', res.data.UID);
    })
      .then(() => {
      setSessionId(sessionStorage.getItem('loginUserId'));
    });
  };

  useEffect(() => {
    loginCk();
  }, [])

  const [sessionId, setSessionId] = useState('');
  //세션저장소에 담은 로그인한 이메일or닉네임
  
  
  function logoutFnc(e){
    e.preventDefault();
    const loginUID = sessionStorage.getItem('loginUID');
    axios.post(`${SERVER_URL}/${loginUID}/logout`)
    .then(res => {
      const {result} = res.data;

      if(result === 'ok'){
        sessionStorage.removeItem('loginUserId');
        sessionStorage.removeItem('loginUID');
      }
      window.location.href = '/';
    
    });
  }

  function detailFnc(e){
    e.preventDefault();
    const loginUID = sessionStorage.getItem('loginUID')
    axios.get(`${SERVER_URL}/${loginUID}`);
  }

  const [loginModalOpen, setLoginModalOpen] = useState(false); //로그인모달 스위치
  
  const openLoginModal = () => {
    setLoginModalOpen(true);
  }
  const closeLoginModal = () => {
    setLoginModalOpen(false);
  }

  


  return (
    <div className={Styles.Header}>
      <div className={Styles.logoDiv}>
      <Link to="/"><h1 className={Styles.logoText}>MYFF</h1></Link>
      </div>
      <div className={Styles.mainNav}>
        <div className={Styles.searchDiv}>
          <form className={Styles.searchForm}>
            <select>
              <option>USER</option>
            </select>
            <input type="text"></input>
            <input className={Styles.searchBtn} type="submit" value="검색"></input>
          </form>
        </div>
        <div className={Styles.btnDiv}>
          <a href="/best">
            <h3>Best</h3>
          </a>
          {/* <a href="/new">
            <h3>New</h3>
          </a> */}
          <Link to="/board/write">
            글쓰기
          </Link>
          
          {(sessionId !== null && sessionId !== 'undefined' && sessionId !== '') ? 
            <>
              <a onClick={detailFnc}><h3>{sessionId}</h3></a>
              <form className="logoutForm" onSubmit={logoutFnc}>
                <input type="submit" value="Logout"></input>
              </form>
            </> : 
            <>
            <h3 onClick={openLoginModal}>
              Login
            </h3>
            {loginModalOpen && <Login close={closeLoginModal}></Login>}
          </>}

        </div>
      </div>
    </div>
  );
}


export default Header;
