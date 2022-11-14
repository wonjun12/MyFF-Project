import React from "react";
import { useState } from "react";
import Styles from "./Login.module.scss";
import Join from "./Join";
import axios from "axios";

const SERVER_URL = "http://localhost:4000/";


const Login = (props) => {

    const [joinModalOpen, setJoinModalOpen] = useState(false);  //회원가입모달 스위치
    const [msg, setMsg] = useState("");     //로그인 유효성 검사 에러 메세지
    

    const openJoinModal = () => {
        setJoinModalOpen(true);
    }

    const closeJoinModal = () => {
        setJoinModalOpen(false);
    }
    const { isOpen, close } = props;    //헤더에서 받아오는 모달 스위치

    function loginConfirmFnc(){    //로그인 유효성검사
        
        const inputId = document.getElementsByName('inputLoginNickNEmail')[0];
        const inputPwd = document.getElementsByName('inputLoginPwd')[0];
        
        if(inputId.value === '' || inputPwd.value === ''){
            if(inputId.value === '' && inputPwd.value === ''){
                setMsg("이메일 또는 닉네임을 입력하세요");
                inputId.focus();
            }else if(inputId.value === ''){
                setMsg("이메일 또는 닉네임을 입력하세요");
                inputId.focus();
            }else if(inputPwd.value === '' && inputId.value !== ''){
                
                setMsg("비밀번호를 입력하세요");
                inputPwd.focus();
            }
            return false;
        }else{
            setMsg('');
            
            return true;
        }
    }
            
    
    function loginFnc(e){   //회원가입 submit
        e.preventDefault();

        const loginConfig = loginConfirmFnc();
        
        if(loginConfig) {
            const {inputLoginPwd, inputLoginNickNEmail} = e.target;

            axios.post(SERVER_URL + "login",{
                loginENName: inputLoginNickNEmail.value,
                loginPwdName: inputLoginPwd.value,
            }, {withCredentials: true}).then(res => {
                console.log(res.data);
                const {result} = res.data;
                
                if(result === "ok"){
                    console.log(res.data);
                    //세션저장소에 로그인한 이메일 혹은 닉네임 저장함.
                    sessionStorage.setItem('loginUserId', res.data.NickName);
                    sessionStorage.setItem('loginUID', res.data.UID);
                    window.location.href = "/";
                }
                
            });
        }     
    }

    return(
        <>
        {/* 외부영역클릭시 모달 닫힘 */}
        {joinModalOpen? <Join joinClose={closeJoinModal} allClose={close}></Join> :   
        (<div onClick={close}> 
            <div className={Styles.loginModal}>
                <div className={Styles.modalContainer} onClick={(e) => e.stopPropagation()}>
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
                            <input
                                type="password" 
                                name="inputLoginPwd"
                                placeholder="비밀번호"/>
                            <div className={Styles.msgP}>{msg}</div>
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