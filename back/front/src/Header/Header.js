import React, { useState } from "react";
import Styles from "./Header.module.scss";
import Login from "./Login";
import {Link} from "react-router-dom";
import axios from "axios";


const SERVER_URL = "http://localhost:4000/";

function Header() {
  
  let sessionId = sessionStorage.getItem('loginUserId');  //세션저장소에 담은 로그인한 이메일or닉네임
  
  function logoutFnc(e){
    e.preventDefault();
    axios.post(SERVER_URL + 'user/' + sessionStorage.getItem('loginUID') + '/logout')
    .then(res => {
      const {result} = res.data;

      if(result === 'ok'){
        sessionStorage.removeItem('loginUserId');
        sessionStorage.removeItem('loginUID');
        window.location.href = '/';
      }
    
    });
  }

  function detailFnc(e){
    e.preventDefault();
    axios.get(SERVER_URL + "user/" + sessionStorage.getItem('loginUID'));
  }




  const [loginModalOpen, setLoginModalOpen] = useState(false); //로그인모달 스위치
  
  const openLoginModal = () => {
    setLoginModalOpen(true);
    //document.getElementById("myMap")?.setAttribute("hidden", "hidden");
  }
  const closeLoginModal = () => {
    
    setLoginModalOpen(false);
    //document.getElementById("myMap")?.removeAttribute("hidden");
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
          
          {sessionId !== null ? 
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
