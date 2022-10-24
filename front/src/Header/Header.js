import React, { useState } from "react";
import Styles from "./Header.module.scss";
import Modal from 'react-awesome-modal';

import axios from "axios";
const SERVER_URL = "http://localhost:4000/";
function loginTest() {
    const id ="집돌이";
    const pwd = "123456789";
    
    axios.post(SERVER_URL,{
      id: id,
      pwd: pwd
    }).then(res => {
        console.log(res.data);
    });
  }




function Header() {

  const [visible, setvisible] = useState(false);
  const openModal = () =>{
    setvisible(true);
    document.body.style = 'overflow: hidden';
  }
  const closeModal = () =>{
    setvisible(false);
    document.body.style = 'overflow: auto';
  }

  //테스트
  
  
  return (
    <div className={Styles.Header}>
      <div className={Styles.logoDiv}>
        <h1 className={Styles.logoText}>MYFF</h1>
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
          <a href="/new">
            <h3>New</h3>
          </a>
          <div>
            <a onClick={openModal}>
              <h3>Login</h3>
            </a>

            <Modal onClickAway={closeModal} visible={visible} width="400" height="300" effect="fadeInDown">
              <div>
                <div className={Styles.modalHead}>
                  <h1 className={Styles.loginText}>로그인</h1>
                  <input className={Styles.exitBtn} value="X" type="button" onClick={closeModal}/>
                </div>
                <div className={Styles.modalContent}>
                  아이디 <input type="text" placeholder="아이디"/>
                  비밀번호 <input type="text" placeholder="아이디"/>
                </div>
                <div>
                  <a href="#">아이디찾기</a>
                  <a href="#">비밀번호찾기</a>
                </div>
                <div className={Styles.modalBtn}>
                  <input className={Styles.loginBtn} type="button" value="로그인" onClick={loginTest}/>
                  <input className={Styles.joinBtn} type="button" value="회원가입" />
                </div>
             </div>
            </Modal>
          </div>
          
        </div>
      </div>
    </div>
  );
}


export default Header;
