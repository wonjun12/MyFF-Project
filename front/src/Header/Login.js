import React from "react";
import { useState } from "react";
import Styles from "./Login.module.scss";
import Join from "./Join";
import axios from "axios";
import { Link } from "react-router-dom";

const SERVER_URL = "/api/home";


const Login = (props) => {

    const [joinModalOpen, setJoinModalOpen] = useState(false);  //회원가입모달 스위치
    const [msg, setMsg] = useState("");     //로그인 유효성 검사 에러 메세지
    

    //회원가입 오픈
    const openJoinModal = () => {
        setJoinModalOpen(true);
        document.body.style.overflow = "hidden";    
    }

    //회원가입 취소
    const closeJoinModal = () => {
        setJoinModalOpen(false);
        document.body.style.overflow = "hidden";
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
            
    //로그인 submit
    function loginFnc(e){   
        e.preventDefault();

        const loginConfig = loginConfirmFnc();
        
        if(loginConfig) {
            const {inputLoginPwd, inputLoginNickNEmail} = e.target;

            axios.post(`${SERVER_URL}/login`,{
                loginENName: inputLoginNickNEmail.value,
                loginPwdName: inputLoginPwd.value,
            }, {withCredentials: true}).then(res => {
                const {result} = res.data;
                
                if(result === "ok"){
                    //setMsg("");
                    //세션저장소에 로그인한 이메일 혹은 닉네임 저장함.
                    sessionStorage.setItem('loginUserId', res.data.NickName);
                    sessionStorage.setItem('loginUID', res.data.UID);
                    window.location.href = "/";
                }else{
                    setMsg("입력정보를 확인해주세요");
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
                    <div className={Styles.logoDiv}>
                        <h1>MYFF</h1>
                        <p onClick={close}>&times;</p>
                    </div>
                    <div className={Styles.loginModalHeader}>
                        <h3>로그인</h3>
                    </div>
                    <div className={Styles.loginFormWrapper}>
                        <form className={Styles.loginForm} onSubmit={loginFnc}>
                            <div className={Styles.inputDiv}>
                                <input
                                    name="inputLoginNickNEmail" 
                                    placeholder="이메일 또는 닉네임"/>
                                <input
                                    type="password" 
                                    name="inputLoginPwd"
                                    placeholder="비밀번호"/>
                            </div>    
                            <div className={Styles.msgP}>{msg}</div>
                            <input className={Styles.loginBtn} type="submit" value="로그인"/>
                        </form>
                    </div>
                    <div className={Styles.pDivWrapper}>
                        <div className={Styles.pDiv}>
                            <Link to='/reset/password'onClick={close}><p>비밀번호 찾기</p></Link>
                            <p className={Styles.criteria}>/</p>
                            <p onClick={openJoinModal}>회원가입</p>
                        </div>
                    </div>
                </div>
            </div>    
        </div>)}
           
        </>

    );
  
}

export default Login;