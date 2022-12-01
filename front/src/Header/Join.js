import React from "react";
import Styles from "./Join.module.scss";
import { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

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

    //생일 선택 유무
    const [isBirth, setIsBirth] = useState({
        year:false,
        month: false,
        day: false
    })

    //select list 출력
    const [showYear, setShowYear] = useState(false)
    const [showMonth, setShowMonth] = useState(false)
    const [showDay, setShowDay] = useState(false)
    
    //입력 상태에 따라 오류메세지
    const [emailMsg, setEmailMsg] = useState('');
    const [nickMsg, setNickMsg] = useState('');
    const [pwdMsg, setPwdMsg] = useState('');
    const [ckPwdMsg, setCkPwdMsg] = useState('');
    const [userNameMsg, setUserNameMsg] = useState('');
    
    //유효성 검사 (전부 트루일때 서브밋된다)
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
            //유효성 검사 통과되면 중복검사
            axios.post(`${SERVER_URL}/emailCk`,{     
                joinEmail: e.currentTarget.value,
            }).then(res => {
                
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

    //닉네임유효성
    function joinNickCkFnc(e){
        setNick(e.currentTarget.value);
        const nickRegEx = /^[A-Za-z0-9가-힣]{2,8}$/;
        
        if(!nickRegEx.test(e.currentTarget.value)){
            setNickMsg('2~8자의 영문, 한글, 숫자만 사용 가능합니다');
        }else{
            //중복 검사 요청
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
    //비번유효성
    function joinPwdCkFnc(e){  
        setPwd(e.currentTarget.value);
        const pwdRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

        if(!pwdRegEx.test(e.currentTarget.value)){
            setPwdMsg('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
        }else{
            setPwdMsg('');
            setPwdConfirm(true);
        }
    }

    //비번재입력유효성
    function joinCkPwdCkFnc(e){  
        setCkPwd(e.currentTarget.value);
        
        if(pwd !== e.currentTarget.value){
            setCkPwdMsg('비밀번호가 일치하지 않습니다.');
        }else{
            setCkPwdMsg('');
            setCkPwdConfirm(true);
        }
    }
    //이름유효성
    function joinUserNameCkFnc(e){   
        setUserName(e.currentTarget.value);
        const nameRegEx = /[A-Za-z가-힣]{2,}$/;

        if(!nameRegEx.test(e.currentTarget.value)){
            setUserNameMsg('2자 이상의 한글과 영문 대 소문자를 사용하세요.');
        }else{
            setUserNameMsg('');
            setUserNameConfirm(true);
        }
    }
    

    //회원가입submit
    function joinTest(e){   
        e.preventDefault();
        
        if(emailConfirm === true && nickConfirm === true && 
            pwdConfirm === true && ckPwdConfirm === true && userNameConfirm === true){
        //if(유효성 검사 불린값 === 모두 true 일때 서브밋된다)
        const {joinEmailName, joinNickName, joinPwdName, joinNameName} = e.target;

        axios.post(`${SERVER_URL}/join`,{
            joinEmailName: joinEmailName.value,
            joinNickName: joinNickName.value,
            joinPwdName: joinPwdName.value,
            joinNameName: joinNameName.value,
            joinYearName: birth.year,
            joinMonthName: birth.month,
            joinDayName: birth.day,

        }, {withCredentials: true}).then(res => {
            const {result} = res.data;
            
            if(result === "ok"){
                joinClose();
                Swal.fire({
                    position: 'top-end',
                    icon: 'success',
                    title: '회원가입 완료!',
                    showConfirmButton: false,
                    timer: 1500
                  })
            }
        }).catch((error)=>{
            Swal.fire({
                icon: 'error',
                title: '에러',
                text: '예상치 못한 오류가 났습니다.',
              })
        });
       
    }
}
    //joinClose에 모달 전부 닫는거 가져옴
    const { isJoinOpen, joinClose, allClose } = props;
    
    return(
    <>
        <div> {/* 외부영역 클릭 시 모달 닫음 */}
            <div  className={Styles.joinModal}>
                <div className={Styles.joinModalContainer} onClick={(e) => e.stopPropagation()}> {/* 이벤트전파막음 */}
                    <div className={Styles.logoDiv}>
                        <p onClick={joinClose}>&larr;</p>
                        <h1>MyFF</h1>
                        <p onClick={allClose}>&times;</p>
                    </div>
                    <div className={Styles.joinModalHeader}>
                        <h3>회원가입</h3>
                    </div>
                    <div className={Styles.joinFormWrapper}>
                        <form className={Styles.joinForm} onSubmit={joinTest}>
                            <div className={Styles.inputDiv}>
                                <input name="joinEmailName"
                                    placeholder="이메일"
                                    onChange={joinEmailCkFnc}/>
                                <span>{emailMsg}</span>
                                <input name="joinNickName" 
                                    placeholder="닉네임"
                                    onChange={joinNickCkFnc}/>
                                <span>{nickMsg}</span>
                                <input name="joinPwdName" 
                                    type="password"
                                    placeholder="비밀번호"
                                    onChange={joinPwdCkFnc}/>
                                <span>{pwdMsg}</span>
                                <input name="joinConfirmPwdName"
                                    type="password"
                                    placeholder="비밀번호 재입력"
                                    onChange={joinCkPwdCkFnc}/>
                                <span>{ckPwdMsg}</span>
                                <input name="joinNameName"
                                    placeholder="이름"
                                    onChange={joinUserNameCkFnc}/>
                                    <span>{userNameMsg}</span>
                            </div>
                            <div className={Styles.selectDiv}>
                                <div>
                                    <label for='year'>출생년도</label>
                                    <div className={Styles.brithDiv}>
                                            <button type="button" onClick={() => {
                                                setShowMonth(false)
                                                setShowDay(false)
                                                setShowYear(!showYear);
                                            }}> {(isBirth.year)? birth.year : '선택' }</button>
                                            {
                                                (showYear)? 
                                                <ul className={Styles.yearUl}>
                                                {
                                                    years.map((item) => {
                                                        return (<li value={item} key={item} onClick={(e) => {
                                                            setShowYear(!showYear);
                                                            setIsBirth({...isBirth, year: true});
                                                            setBirth({ ...birth, year: e.target.value })
                                                        }}>{item}</li>)
                                                    })}
                                                </ul>
                                                : null
                                            }
                                            
                                        </div>
                                    {/* <select id="year"
                                        name="joinYearName"
                                        value={birth.year}
                                        onChange={(e) => setBirth({ ...birth, year: e.target.value})}>
                                            {years.map(item => (<option value={item} key={item}>{item}</option>))}
                                    </select> */}
                                </div>
                                <div>
                                    <label for='month'>월</label>
                                    <div className={Styles.brithDiv}>
                                            <button type="button" onClick={() => {
                                                setShowYear(false)
                                                setShowDay(false)
                                                setShowMonth(!showMonth);
                                            }}> {(isBirth.month)? birth.month : '선택' }</button>
                                            {
                                                (showMonth)? 
                                                <ul className={Styles.monthUl}>
                                                {
                                                month.map((item) => {
                                                    return (<li value={item} key={item} onClick={(e) => {
                                                        setShowMonth(!showMonth);
                                                        setIsBirth({...isBirth, month: true});
                                                        setBirth({ ...birth, month: e.target.value })
                                                    }}>{item}</li>)
                                                })}
                                                </ul>
                                                : null
                                            }
                                            
                                        </div>
                                    {/* <select id='month'
                                        name="joinMonthName" 
                                        value={birth.month}
                                        onChange={(e) => setBirth({ ...birth, month: e.target.value})}>
                                            {month.map(item => (<option value={item} key={item}>{item}</option>))}
                                    </select> */}
                                </div>
                                <div>
                                    <label for='day'>일</label>
                                    <div className={Styles.brithDiv}>
                                            <button type="button" onClick={() => {
                                                setShowMonth(false)
                                                setShowYear(false)
                                                setShowDay(!showDay);
                                            }}> {(isBirth.day)? birth.day : '선택' }</button>
                                            {
                                                (showDay)?
                                                <ul className={Styles.dayhUl}>
                                                    {
                                                    days.map((item) => {
                                                        return (<li value={item} key={item} onClick={(e) => {
                                                            setShowDay(!showDay);
                                                            setIsBirth({...isBirth, day: true});
                                                            setBirth({ ...birth, day: e.target.value })
                                                        }}>{item}</li>)
                                                    })}
                                                </ul>
                                                : null
                                            }
                                        </div>
                                    {/* <select id='day'
                                        name="joinDayName"
                                        value={birth.day}
                                        onChange={(e) => setBirth({ ...birth, day: e.target.value})}>
                                            {days.map(item => (<option value={item} key={item}>{item}</option>))}
                                    </select> */}
                                </div>
                            </div>
                            <input className={Styles.joinBtn} type="submit" value="회원가입"/>
                        </form>
                    </div>
                    <div className={Styles.pDiv}>
                        <p onClick={joinClose}>이미 회원이라면 로그인</p>
                    </div>
                </div>
            </div>    
        </div>
    </>
    
    );
}

export default Join;