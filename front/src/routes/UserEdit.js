import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Styles from "./UserEdit.module.scss";

const SERVER_URL = "/api/user/"; 

const UserEdit = (props) => {

    const {close} = props;
    const {id} = useParams();
    
    const [editNick, setEditNick] = useState("");
    const [originPwd, setOrignPwd] = useState("");
    const [editPwd, setEditPwd] = useState("");
    const [editConfirmPwd, setEditConfirmPwd] = useState("");
    const [birth, setBirth] = useState({
        year: 2022,
        month: 1,
        day: 1,
    });

    const [nickMsg, setNickMsg] = useState("");
    const [originPwdMsg, setOriginPwdMsg] = useState("");
    const [editPwdMsg, setEditPwdMsg] = useState("");
    const [editConfirmPwdMsg, setEditConfirmPwdMsg] = useState("");

    const [editNickConfirm, setEditNickConfirm] = useState(false);
    const [editOriginPwdConfirm, setEditOriginPwdConfirm] = useState(false);
    const [editPwdConfirm, setEditPwdConfirm] = useState(false);
    const [editCkPwdConfirm, setEditCkPwdConfirm] = useState(false);

    const editInfo = async () =>{
        const res = await axios.get(SERVER_URL+id+'/edit');
        console.log(res.data);
        setEditNick(res.data.Users.NickName);
        
        let words = new Date(res.data.Users.BirthDay);
        
        setBirth({year: words.getFullYear(),
                month: words.getMonth() + 1,
                day: words.getDate()});
        
    }
    
    useEffect(()=>{
        editInfo();
    }, []);


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

    function editNickCkFnc(e){
        setEditNick(e.currentTarget.value);
        const nickRegEx = /^[A-Za-z0-9가-힣]{2,8}$/;
        
        if(!nickRegEx.test(e.currentTarget.value)){
            setNickMsg('2~8자의 영문, 한글, 숫자만 사용 가능합니다');
        }else{
            
            axios.post('../api/home/nickCk', {
                joinNick: e.currentTarget.value,
            }).then(res => {
                const {result} = res.data;

                if(result === 'no'){
                    setNickMsg('이미 사용중인 닉네임입니다.');
                }else{
                    setNickMsg('');
                    setEditNickConfirm(true);
                }
            });
        }


    }

    //프로필사진저장
    const inputRef = useRef(null);
    const [imgFile, setImgFile] = useState();   //파일담는
    const [img, setImg] = useState("../img/profileEdit.png"); //미리보기

    function saveImg(e){
        e.preventDefault();

        const {files} = e.target;
        console.log(files);

        if(files.length){
            setImgFile(files[0]);
        }
    }

    useEffect(()=>{
        const fileReader = new FileReader();

        if(imgFile){
            fileReader.readAsDataURL(imgFile);
            fileReader.onload = (e) =>{
                
                const { result } = e.target;
                console.log(result);
                if(result){
                    setImg(result);
                }
            }
        }
        return () => {
            fileReader.abort();
        }
    }, [imgFile]);

    //프로필 삭제, 프로필 formDate로 보내기, get 프로필 보여주기
    return(
        <div onClick={close}>
            <div className={Styles.editModal}>
                <div className={Styles.modalContainer} onClick={(e)=> e.stopPropagation()}>
                    <div className={Styles.editModalHeader}>
                        <h1>프로필편집</h1>
                        <p onClick={close}>&times;</p>
                    </div>
                    <div className={Styles.editFormWrapper}>
                        <form>
                            <div className={Styles.profileEditImg}>
                                <input hidden='hidden' type='file' accept="image/*" onChange={saveImg}
                                    ref={inputRef}
                                    onClick={(e) => (e.target.value = null)}/>
                                {/* <img  src="../img/profileEdit.png"></img> */}
                                <img onClick={() => inputRef.current.click()} src={img}></img>
                                
                            </div>
                            <div>
                                <input name="editNickName" value={editNick}
                                 onChange={editNickCkFnc}/>
                                <p>{nickMsg}</p>
                                <input name="orignPwdName" placeholder="현재비밀번호"/>
                                <input name="editPwdName" placeholder="비밀번호"/>
                                <input name="editConfirmPwdName" placeholder="비밀번호 재입력"/>
                            </div>
                            <div>
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
                            </div>
                            <input type="submit" value='수정완료'/>
                        </form>
                    </div>
                    <input value="탈퇴"></input>
                </div>
            </div>
        </div>
    );
}

export default UserEdit;