import React from "react";
import Styles from "./Join.module.scss";
import { useState } from "react";
import axios from "axios";

const SERVER_URL = "/api/home";

const Join = (props) => {
    axios.defaults.withCredentials = true;
    //입력value 세팅
    const [email, setEmail] = useState('');
    const [nick, setNick] = useState('');
    const [pwd, setPwd] = useState('');
    const [ckPwd, setCkPwd] = useState('');
    const [userName, setUserName] = useState('');
    const [birth, setBirth] = useState({
        year: 2022,
        month: 1,
        day: 1,
    });
    
    //입력 상태에 따라 오류메세지
    const [emailMsg, setEmailMsg] = useState('');
    const [nickMsg, setNickMsg] = useState('');
    const [pwdMsg, setPwdMsg] = useState('');
    const [ckPwdMsg, setCkPwdMsg] = useState('');
    const [userNameMsg, setUserNameMsg] = useState('');
    
    //유효성 검사 (전부트루일때 서브밋된다)
    const [emailConfirm, setEmailConfirm] = useState(false);
    const [nickConfirm, setNickConfirm] = useState(false);
    const [pwdConfirm, setPwdConfirm] = useState(false);
    const [ckPwdConfirm, setCkPwdConfirm] = useState(false);
    const [userNameConfirm, setUserNameConfirm] = useState(false);
    
    const now = new Date();     //년도 및 월별에 따른 일수

    let years = [];
    for(let y = now.getFullYear(); y >= 1930; y-= 1){
        years.push(y);
    }
    let month = [];
    for(let m = 1; m <= 12; m +=1){
        month.push(m);
    }
    let days = [];
    let date = new Date(birth.year, birth.month, 0).getDate();
    for(let d = 1; d <= date; d += 1){
        days.push(d);
    }

    function joinEmailCkFnc(e){ //이메일유효성
        setEmail(e.currentTarget.value);
        const emailRegEx = /^[A-Za-z]+[A-Za-z0-9]*[@]{1}[A-Za-z]*[.]{1}[A-Za-z]{2,3}$/;
        //[^첫글자는영문]+[그뒤로영문숫자가능]+[@ 반드시1개존재]+[그뒤로는바로 영문오고]+
        //[앞에몇글자상관없음그리고][.이무조건1개존재]+[그뒤로영문옴근데 최소2자 최대3자 com/net같은]
        
        if(!emailRegEx.test(e.currentTarget.value)){
            setEmailMsg("이메일 양식을 확인해주세요");
        }else{
            axios.post(`${SERVER_URL}/emailCk`,{     //유효성 검사 통과되면 중복검사
                joinEmail: e.currentTarget.value,
            }).then(res => {
                console.log(res.data);
                const {result} = res.data;

                if(result === 'no'){
                    setEmailMsg('이미 사용중인 이메일입니다.');
                }else{
                    setEmailMsg('');
                    setEmailConfirm(true);
                }
            });
        }
    }
    function joinNickCkFnc(e){   //닉네임유효성
        setNick(e.currentTarget.value);
        const nickRegEx = /^[A-Za-z0-9가-힣]{2,8}$/;
        
        if(!nickRegEx.test(e.currentTarget.value)){
            setNickMsg('2~8자의 영문, 한글, 숫자만 사용 가능합니다');
        }else{
            
            axios.post(`${SERVER_URL}/nickCk`, {
                joinNick: e.currentTarget.value,
            }).then(res => {
                const {result} = res.data;

                if(result === 'no'){
                    setNickMsg('이미 사용중인 닉네임입니다.');
                }else{
                    setNickMsg('');
                    setNickConfirm(true);
                }
            });
        }
    }
    function joinPwdCkFnc(e){    //비번유효성
        setPwd(e.currentTarget.value);
        const pwdRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

        if(!pwdRegEx.test(e.currentTarget.value)){
            setPwdMsg('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
        }else{
            setPwdMsg('');
            setPwdConfirm(true);
        }
    }
    function joinCkPwdCkFnc(e){  //비번재입력유효성
        setCkPwd(e.currentTarget.value);
        
        if(pwd !== e.currentTarget.value){
            setCkPwdMsg('비밀번호가 일치하지 않습니다.');
        }else{
            setCkPwdMsg('');
            setCkPwdConfirm(true);
        }
    }
    function joinUserNameCkFnc(e){   //이름유효성
        setUserName(e.currentTarget.value);
        const nameRegEx = /[A-Za-z가-힣]{2,}$/;

        if(!nameRegEx.test(e.currentTarget.value)){
            setUserNameMsg('2자 이상의 한글과 영문 대 소문자를 사용하세요.');
        }else{
            setUserNameMsg('');
            setUserNameConfirm(true);
        }
    }
    
    function joinTest(e){   //회원가입submit
        e.preventDefault();
        
        if(emailConfirm === true && nickConfirm === true && 
            pwdConfirm === true && ckPwdConfirm === true && userNameConfirm === true){
        //if(유효성 검사 불린값 === 모두 true 일때 서브밋된다)
        const {joinEmailName, joinNickName, joinPwdName, joinNameName
            , joinYearName, joinMonthName,joinDayName} = e.target;

        axios.post(`${SERVER_URL}/join`,{
            joinEmailName: joinEmailName.value,
            joinNickName: joinNickName.value,
            joinPwdName: joinPwdName.value,
            joinNameName: joinNameName.value,
            joinYearName: joinYearName.value,
            joinMonthName: joinMonthName.value,
            joinDayName: joinDayName.value,

        }, {withCredentials: true}).then(res => {
            const {result} = res.data;
            
            if(result === "ok"){
                joinClose();
            }
        }).catch((error)=>console.log("회원가입실패"));
       
    }
}
    //joinClose에 모달 전부 닫는거 가져옴
    const { isJoinOpen, joinClose, allClose } = props;
    
    return(
    <>
        <div onClick={allClose}> {/* 외부영역 클릭 시 모달 닫음 */}
            <div  className={Styles.joinModal}>
                <div className={Styles.joinModalContainer} onClick={(e) => e.stopPropagation()}> {/* 이벤트전파막음 */}
                    <div className="joinModalHeader">
                        <h1>MyFF</h1>
                        <h3>회원가입</h3>
                        <p onClick={allClose}>&times;</p>
                    </div>
                    <div className={Styles.joinFormWrapper}>
                        <form className="joinForm" onSubmit={joinTest}>
                            <input name="joinEmailName"
                                placeholder="이메일"
                                onChange={joinEmailCkFnc}/>
                            <p>{emailMsg}</p>
                            <input name="joinNickName" 
                                placeholder="닉네임"
                                onChange={joinNickCkFnc}/>
                            <p>{nickMsg}</p>
                            <input name="joinPwdName" 
                                type="password"
                                placeholder="비밀번호"
                                onChange={joinPwdCkFnc}/>
                            <p>{pwdMsg}</p>
                            <input name="joinConfirmPwdName"
                                type="password"
                                placeholder="비밀번호 재입력"
                                onChange={joinCkPwdCkFnc}/>
                            <p>{ckPwdMsg}</p>
                            <input name="joinNameName"
                                placeholder="이름"
                                onChange={joinUserNameCkFnc}/>
                            <p>{userNameMsg}</p>
                            <label for='year'>출생년도</label>
                            <select id="year"
                                name="joinYearName"
                                value={birth.year}
                                onChange={(e) => setBirth({ ...birth, year: e.target.value})}>
                                    {years.map(item => (<option value={item} key={item}>{item}</option>))}
                            </select>
                            <label for='month'>월</label>
                            <select id='month'
                                name="joinMonthName" 
                                value={birth.month}
                                onChange={(e) => setBirth({ ...birth, month: e.target.value})}>
                                    {month.map(item => (<option value={item} key={item}>{item}</option>))}
                            </select>
                            <label for='day'>일</label>
                            <select id='day'
                                name="joinDayName"
                                value={birth.day}
                                onChange={(e) => setBirth({ ...birth, day: e.target.value})}>
                                    {days.map(item => (<option value={item} key={item}>{item}</option>))}
                            </select>
                            <input type="submit" value="회원가입"/>
                        </form>
                    </div>
                    <hr/>
                    <a onClick={joinClose}>이미 회원이라면 로그인</a>
                </div>
            </div>    
        </div>
    </>
    
    );
}

export default Join;