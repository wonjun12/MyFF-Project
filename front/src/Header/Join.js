import React from "react";
import Styles from "./Join.module.scss";
import { useState } from "react";
import axios from "axios";

const SERVER_URL = "http://localhost:4000/";



const Join = (props) => {
    
    const [inputJoinEmail, setInputJoinEmail] = useState("");
    const [inputJoinNickName, setInputJoinNickName] = useState("");
    const [inputJoinPwd, setInputJoinPwd] = useState("");
    const [inputJoinConfirmPwd, setInputJoinConfirmPwd] = useState("");
    const [inputJoinName, setInputJoinName] = useState("");
    const [inputJoinYear, setInputJoinYear] = useState("");
    const [inputJoinMonth, setInputJoinMonth] = useState("");
    const [inputJoinDay, setInputJoinDay] = useState("");

    function joinTest(e){
        e.preventDefault();
        const {joinEmailName, joinNickName, joinPwdName, joinNameName, joinYearName, joinMonthName,joinDayName}
             = e.target;
        axios.post(SERVER_URL + "join",{
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
    //joinClose에 모달 전부 닫는거 가져옴
    const { isJoinOpen, joinClose } = props;
    
    return(
    
    <>
        <div onClick={joinClose}> {/* 외부영역 클릭 시 모달 닫음 */}
            <div  className={Styles.joinModal}>
                <div className={Styles.joinModalContainer} onClick={(e) => e.stopPropagation()}> {/* 이벤트전파막음 */}
                    <div className="joinModalHeader">
                        <h1>MyFF</h1>
                        <h3>회원가입</h3>
                        <p onClick={joinClose}>&times;</p>
                    </div>
                    <div className="joinFormWrapper">
                        <form className="joinForm" onSubmit={joinTest}>
                            <input name="joinEmailName"
                                value={inputJoinEmail}
                                onChange={e => setInputJoinEmail(e.target.value)}
                                placeholder="이메일"/>
                            
                            <input name="joinNickName" 
                                value={inputJoinNickName}
                                onChange={e => setInputJoinNickName(e.target.value)}
                                placeholder="닉네임"/>
                            <input name="joinPwdName" 
                                value={inputJoinPwd}
                                type="password"
                                onChange={e => setInputJoinPwd(e.target.value)}
                                placeholder="비밀번호"/>
                            
                            <input name="joinConfirmPwdName"
                                value={inputJoinConfirmPwd}
                                type="password"
                                onChange={e => setInputJoinConfirmPwd(e.target.value)}
                                placeholder="비밀번호 재입력"/>
                            
                            <input name="joinNameName"
                                value={inputJoinName}
                                onChange={e => setInputJoinName(e.target.value)}
                                placeholder="이름"/>
                            
                            <input name="joinYearName"
                                value={inputJoinYear}
                                onChange={e => setInputJoinYear(e.target.value)}
                                placeholder="출생년도"/>
                            <select name="joinMonthName" value={inputJoinMonth}
                                onChange={e => setInputJoinMonth(e.target.value)}>
                                <option>월</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                            </select>
                            <select name="joinDayName" value={inputJoinDay}
                                onChange={e => setInputJoinDay(e.target.value)}>
                                <option>일</option>
                                <option>1</option>
                                <option>2</option>
                                <option>3</option>
                                <option>4</option>
                                <option>5</option>
                                <option>6</option>
                                <option>7</option>
                                <option>8</option>
                                <option>9</option>
                                <option>10</option>
                                <option>11</option>
                                <option>12</option>
                                <option>13</option>
                                <option>14</option>
                                <option>15</option>
                                <option>16</option>
                                <option>17</option>
                                <option>18</option>
                                <option>19</option>
                                <option>20</option>
                                <option>21</option>
                                <option>22</option>
                                <option>23</option>
                                <option>24</option>
                                <option>25</option>
                                <option>26</option>
                                <option>27</option>
                                <option>28</option>
                                <option>29</option>
                                <option>30</option>
                                <option>31</option>
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