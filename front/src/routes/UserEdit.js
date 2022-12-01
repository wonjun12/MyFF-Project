import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Styles from "./UserEdit.module.scss";
import { Buffer } from "buffer";
import Swal from "sweetalert2";

const SERVER_URL = "/api/user/";

const UserEdit = (props) => {

    //새로고침 없이 url 이동
    const navigate = useNavigate();

    //모달 닫기
    const { close } = props;
    const { id } = useParams();

    //submit 초기값 설정
    const [profileDelete, setProfileDelete] = useState(false);
    const [prevCkPwd, setPrevCkPwd] = useState(false);
    const [editNick, setEditNick] = useState("");
    const [originPwd, setOrignPwd] = useState("");
    const [editPwd, setEditPwd] = useState("");
    const [editConfirmPwd, setEditConfirmPwd] = useState("");
    const [birth, setBirth] = useState({
        year: 2022,
        month: 1,
        day: 1,
    });

    //select list 출력
    const [showYear, setShowYear] = useState(false)
    const [showMonth, setShowMonth] = useState(false)
    const [showDay, setShowDay] = useState(false)

    //error 메시지 
    const [nickMsg, setNickMsg] = useState("");
    const [originPwdMsg, setOriginPwdMsg] = useState("");
    const [editPwdMsg, setEditPwdMsg] = useState("");
    const [editConfirmPwdMsg, setEditConfirmPwdMsg] = useState("");
    //const [proFile, setproFile] = useState();

    //유효성 검사
    const [editNickConfirm, setEditNickConfirm] = useState(true);
    //const [editOriginPwdConfirm, setEditOriginPwdConfirm] = useState(false);
    const [editPwdConfirm, setEditPwdConfirm] = useState(true);
    const [editCkPwdConfirm, setEditCkPwdConfirm] = useState(true);



    //프로필사진저장
    const inputRef = useRef(null);
    const [imgFile, setImgFile] = useState();   //파일담는
    const [img, setImg] = useState(""); //미리보기


    //초기 유저 정보 가져오기
    const editInfo = async () => {
        const res = await axios.get(SERVER_URL + id + '/edit');

        
        setEditNick(res.data.Users.NickName);

        let words = new Date(res.data.Users.BirthDay);

        setBirth({
            year: words.getFullYear(),
            month: words.getMonth() + 1,
            day: words.getDate()
        });

        if (res.data.Users.ProFile !== null) {
            //console.log(res.data.Users.ProFile);
            const buffer = Buffer.from(res.data.Users.ProFile).toString('base64');

            setImg(`data:image;base64,${buffer}`);
        } else {
            setImg(`${process.env.PUBLIC_URL}/img/profileEdit.png`);
        }

    }

    useEffect(() => {
        editInfo();
    }, []);


    const now = new Date();     //년도 및 월별에 따른 일수

    let years = [];
    for (let y = now.getFullYear(); y >= 1930; y -= 1) {
        years.push(y);
    }
    let month = [];
    for (let m = 1; m <= 12; m += 1) {
        month.push(m);
    }
    let days = [];
    let date = new Date(birth.year, birth.month, 0).getDate();
    for (let d = 1; d <= date; d += 1) {
        days.push(d);
    }

    function originPwdCk(e) {    //들어가기전 비번체크
        axios.post(SERVER_URL + id + '/pwdck', {
            editPCKName: originPwd
        }).then(res => {
            const { pwdCk } = res.data;
            
            if(pwdCk){
                setPrevCkPwd(pwdCk);
            }else{
                setOriginPwdMsg('입력정보를 확인하세요');
            }

        })
    }

    //닉네임 유효성 검사
    function editNickCkFnc(e) {
        setEditNickConfirm(false);
        setEditNick(e.currentTarget.value);
        let nick = e.currentTarget.value;
        const nickRegEx = /^[A-Za-z0-9가-힣]{2,8}$/;

        if (!nickRegEx.test(e.currentTarget.value)) {
            setNickMsg('2~8자의 영문, 한글, 숫자만 사용 가능합니다');
        } else {
            axios.post('../api/home/nickCk', {
                joinNick: e.currentTarget.value,
            }).then(res => {
                const { result } = res.data;

                if (result === 'no') {

                    if (sessionStorage.getItem('loginUserId') === nick) {
                        setNickMsg('');
                        setEditNickConfirm(true);
                        console.log(nick);
                    } else {
                        setNickMsg('이미 사용중인 닉네임입니다.');
                    }
                } else {
                    setNickMsg('');
                    setEditNickConfirm(true);
                }
            });
        }
    }

    // 비밀번호 유효성 검사
    function editPwdCkFnc(e) {
        setEditPwdConfirm(false);
        setEditPwd(e.currentTarget.value);
        const pwdRegEx = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,16}$/;

        if (!pwdRegEx.test(e.currentTarget.value)) {
            setEditPwdMsg('8~16자 영문 대 소문자, 숫자, 특수문자를 사용하세요.');
        } else {
            setEditPwdMsg('');
            setEditPwdConfirm(true);
        }
    }

    //비밀번호 확인 유효성 검사
    function editCkPwdCkFnc(e) {  
        setEditCkPwdConfirm(false);
        setEditConfirmPwd(e.currentTarget.value);

        if (editPwd !== e.currentTarget.value) {
            setEditConfirmPwdMsg('비밀번호가 일치하지 않습니다.');
        } else {
            setEditConfirmPwdMsg('');
            setEditCkPwdConfirm(true);
        }
    }

    //프로필이미지저장
    function saveImg(e) {    
        e.preventDefault();

        const { files } = e.target;
        console.log(files);

        if (files.length) {
            setImgFile(files[0]);
        }
    }

    //수정 완료 submit
    function userEditPost(e) {   //저장이미지 포스트
        e.preventDefault();
        //console.log(imgFile);
        const config = {
            Headers: {
                "content-type": "multipart/form-data",
            },
        };

        const formData = new FormData();

        if (imgFile) {
            formData.append("file", imgFile);
        }

        if (editNickConfirm && editPwdConfirm && editCkPwdConfirm) {
            const data = {
                editPCKName: originPwd,
                editNickName: editNick,
                editPUPName: editPwd,
                editYearName: birth.year,
                editMonthName: birth.month,
                editDayName: birth.day,
                profileDelete
            }
            formData.append("bodys", JSON.stringify(data));

            axios.post(SERVER_URL + id + '/edit', formData, config).then((res) => {
                //console.log(res.data);
                const { result } = res.data;
                if (result) {

                    sessionStorage.setItem('loginUserId', editNick);

                    window.location.href = `/user/${id}`;
                }
            })
        }
    }

    //이미지 초기화 (없에기)
    function deleteProFile() {
        setImg(`${process.env.PUBLIC_URL}/img/profileEdit.png`);
        setImgFile(null);
        setProfileDelete(true);
    }

    function enterCk(e){    //비밀번호 확인 엔터키입력
        if(e.keyCode === 13){
            originPwdCk();
        }
    }

    useEffect(() => {
        const fileReader = new FileReader();    //프로필사진 미리보기

        if (imgFile) {
            fileReader.readAsDataURL(imgFile);
            fileReader.onload = (e) => {

                const { result } = e.target;
                //console.log(result);
                if (result) {
                    setImg(result);
                }
            }
            setProfileDelete(false);
        }
        return () => {
            fileReader.abort();
        }
    }, [imgFile]);


    //유저 탈퇴
    const deleteUser = async () => {

        Swal.fire({
            title: '정말로 탈퇴 하시겠습니까?',
            text: "탈퇴 후 취소할수 없습니다.",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: '탈퇴하기',
            cancelButtonText:'취소'
          }).then(async (result) => {
            if(result.isConfirmed){
                const res = await axios.post('/api/user/delete');
                const { result } = res.data;

                if(result){
                    Swal.fire(
                      '탈퇴 완료!',
                      '정상적으로 탈퇴되었습니다.',
                      'success',
                    )
                    sessionStorage.removeItem('loginUserId');
                    sessionStorage.removeItem('loginUID');
                    window.location.href = '/';
                }
            }
                


          })
          return;
        
        
    }

    const resetSelect = () => {
        setShowDay(false);
        setShowMonth(false);
        setShowYear(false);
    }

    return (

        <div>
            {(prevCkPwd) ?
                <div className={Styles.editModal} onClick={resetSelect}>
                    <div className={Styles.modalContainer} onClick={(e) => {e.stopPropagation()}}>
                        <div className={Styles.editModalHeader}>
                            <p>프로필편집</p>
                            <span onClick={close}>&times;</span>
                        </div>
                        <div className={Styles.editFormWrapper}>
                            <form className={Styles.editForm}>
                                <div className={Styles.profileEditImg}>
                                    <input hidden='hidden' type='file' accept="image/*" onChange={saveImg}
                                        ref={inputRef}
                                        onClick={(e) => (e.target.value = null)} />
                                    <img onClick={() => inputRef.current.click()} src={img} alt='프로필사진' />
                                    <p onClick={deleteProFile}>기본 이미지로 변경</p>
                                </div>
                                <div className={Styles.editInput}>
                                    <input name="editNickName" value={editNick} onChange={editNickCkFnc} />
                                    <span className={Styles.nickSpan}>{nickMsg}</span>
                                    <input name="editPwdName" placeholder="비밀번호"
                                        value={editPwd}
                                        onChange={editPwdCkFnc}
                                        type="password" />
                                    <span className={Styles.pwdSpan}>{editPwdMsg}</span>
                                    <input name="editConfirmPwdName"
                                        placeholder="비밀번호 재입력"
                                        onChange={editCkPwdCkFnc}
                                        type="password" />
                                    <span className={Styles.pwdCkSpan}>{editConfirmPwdMsg}</span>
                                </div>
                                <div className={Styles.selectDiv}>
                                    <div>
                                        <label>출생년도</label>
                                        <div className={Styles.brithDiv}>
                                            <button type="button" onClick={() => {
                                                setShowMonth(false)
                                                setShowDay(false)
                                                setShowYear(!showYear);
                                            }}> {birth.year}</button>
                                            {
                                                (showYear)? 
                                                <ul className={Styles.yearUl}>
                                                {
                                                    years.map((item) => {
                                                        return (<li value={item} key={item} onClick={(e) => {
                                                            setShowYear(!showYear);
                                                            
                                                            setBirth({ ...birth, year: e.target.value })
                                                        }}>{item}</li>)
                                                    })}
                                                </ul>
                                                : null
                                            }
                                            
                                        </div>
                                        {/* <select id="year"
                                            name="joinYearName" editPwd
                                            value={birth.year}
                                            onChange={(e) => setBirth({ ...birth, year: e.target.value })}>
                                            {years.map(item => (<option value={item} key={item}>{item}</option>))}
                                        </select> */}
                                    </div>
                                    <div>
                                        <label>월</label>
                                        <div className={Styles.brithDiv}>
                                            <button type="button" onClick={() => {
                                                setShowYear(false)
                                                setShowDay(false)
                                                setShowMonth(!showMonth);
                                            }}> {birth.month}</button>
                                            {
                                                (showMonth)? 
                                                <ul className={Styles.monthUl}>
                                                {
                                                month.map((item) => {
                                                    return (<li value={item} key={item} onClick={(e) => {
                                                        setShowMonth(!showMonth);
                                                        
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
                                            onChange={(e) => setBirth({ ...birth, month: e.target.value })}>
                                            {month.map(item => (<option value={item} key={item}>{item}</option>))}
                                        </select> */}
                                    </div>
                                    <div>
                                        <label>일</label>
                                        <div className={Styles.brithDiv}>
                                            <button type="button" onClick={() => {
                                                setShowMonth(false)
                                                setShowYear(false)
                                                setShowDay(!showDay);
                                            }}> {birth.day}</button>
                                            {
                                                (showDay)?
                                                <ul className={Styles.dayhUl}>
                                                    {
                                                    days.map((item) => {
                                                        return (<li value={item} key={item} onClick={(e) => {
                                                            setShowDay(!showDay);
                                                            
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
                                            onChange={(e) => setBirth({ ...birth, day: e.target.value })}>
                                            {days.map(item => (<option value={item} key={item}>{item}</option>))}
                                        </select> */}
                                    </div>
                                </div>
                                <div className={Styles.editBtn}>
                                    <input type="submit" value='수정완료' onClick={userEditPost} />
                                </div>
                            </form>
                        </div>
                        <span className={Styles.userDeleteBtn} onClick={deleteUser}>회원탈퇴</span>
                    </div>

                </div>
                : (<div className={Styles.prevModal}>
                    <div className={Styles.prevModalContainer} onClick={(e) => e.stopPropagation()}>
                        <div className={Styles.prevHeader}>
                            <p>회원정보 수정</p>
                            <span onClick={close}>&times;</span>
                        </div>
                        <div className={Styles.prevText}>
                            <p>회원정보를 수정하시려면 비밀번호를 입력하셔야 합니다</p>
                        </div>
                        <div className={Styles.prevInput}>
                            <input type="password" placeholder="현재비밀번호"
                                value={originPwd} onChange={(e) => setOrignPwd(e.target.value)}
                                onKeyUp={enterCk} />
                            <p>{originPwdMsg}</p>
                        </div>
                        <div className={Styles.prevBtn}>
                            <button onClick={originPwdCk}>확인</button>
                        </div>
                    </div>
                </div>)
            }
        </div>
    );
}

export default UserEdit;