import React from "react";
import Styles from "./Join.module.scss";
import { useState } from "react";
import Login from "./Login";
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
            // joinYearName: inputJoinYear.value,
            // joinMonthName: inputJoinMonth.value,
            // joinDayName: inputJoinDay.value,

        }, {withCredentials: true}).then(res => {
            const {result} = res.data;
            
            if(result === "ok"){
                joinClose();
            }
        }).catch((error)=>console.log("회원가입실패"));
    
        
    }

    const { isJoinOpen, joinClose } = props;

    return(
    
        <>
           <div className={Styles.joinModal}>
                    <div>
                        <div className={Styles.joinModalContainer}>
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
                                    <select name="joinMonthName" selected={inputJoinMonth}
                                        onChange={e => setInputJoinMonth(e.target.value)}>
                                        <option selected>월</option>
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
                                    <select name="joinDayName" selected={inputJoinDay}
                                        onChange={e => setInputJoinDay(e.target.value)}>
                                        <option selected>일</option>
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