import React from "react";
import { useState } from "react";
import Styles from "./Login.module.scss";
import Join from "./Join";

import axios from "axios";

const SERVER_URL = "http://localhost:4000/";


const Login = (props) => {
    
    // const [inputLoginNickNEmail, setInputLoginNickNEmail] = useState("");
    // const [inputLoginPwd, setInputLoginPwd] = useState("");

    function loginFnc(e){
        e.preventDefault();
        
        
        const {inputLoginPwd, inputLoginNickNEmail} = e.target;

        axios.post(SERVER_URL + "login",{
            loginENName: inputLoginNickNEmail.value,
            loginPwdName: inputLoginPwd.value,
        }, {withCredentials: true}).then(res => {
            console.log(res.data);
            const {result} = res.data;
            
            if(result === "ok"){
                setJoinModalOpen(false);
                window.location.href = "/";
            }
        });
    }

    const [joinModalOpen, setJoinModalOpen] = useState(false);  

    const openJoinModal = () => {
        
        setJoinModalOpen(true);
        
    }

    const closeJoinModal = () => {
        setJoinModalOpen(false);
         
    }

    const { isOpen, close } = props;

    return(
        <>
        {joinModalOpen? <Join joinClose={closeJoinModal}></Join> : 
        (<div className={Styles.loginModal} id="loginModal">
        <div >
            <div className={Styles.modalContainer}>
                <div className="loginModalHeader">
                    <h1>MyFF</h1>
                    <h3>로그인</h3>
                    <p onClick={close}>&times;</p>
                </div>
                <div className="loginFormWrapper">
                    <form className="loginForm" onSubmit={loginFnc}>
                        <input
                        name="inputLoginNickNEmail" 
                            placeholder="이메일 또는 닉네임"/>
                        <input type="password" 
                            name="inputLoginPwd"
                            placeholder="비밀번호"/>
                        <input type="submit" value="로그인"/>
                    </form>
                </div>
                
                <hr/>
                <a>아이디 찾기</a>
                <a>비밀번호 찾기</a>
                <a>
                    <p onClick={openJoinModal}>회원가입</p>
                    
                </a>
        </div>
    </div>
</div>)}
           
        </>

    );
  
}

export default Login;