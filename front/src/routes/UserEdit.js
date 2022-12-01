import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Styles from "./UserEdit.module.scss";
import { Buffer } from "buffer";
import Swal from "sweetalert2";

const SERVER_URL = "/api/user/";

const UserEdit = (props) => {

    const navigate = useNavigate();
    const { close } = props;
    const { id } = useParams();

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

    const [nickMsg, setNickMsg] = useState("");
    const [originPwdMsg, setOriginPwdMsg] = useState("");
    const [editPwdMsg, setEditPwdMsg] = useState("");
    const [editConfirmPwdMsg, setEditConfirmPwdMsg] = useState("");
    //const [proFile, setproFile] = useState();

    const [editNickConfirm, setEditNickConfirm] = useState(true);
    //const [editOriginPwdConfirm, setEditOriginPwdConfirm] = useState(false);
    const [editPwdConfirm, setEditPwdConfirm] = useState(true);
    const [editCkPwdConfirm, setEditCkPwdConfirm] = useState(true);



    //프로필사진저장
    const inputRef = useRef(null);
    const [imgFile, setImgFile] = useState();   //파일담는
    const [img, setImg] = useState(""); //미리보기

    const editInfo = async () => {
        const res = await axios.get(SERVER_URL + id + '/edit');
        console.log(res.data);
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

    function editCkPwdCkFnc(e) {  //비번재입력유효성
        setEditCkPwdConfirm(false);
        setEditConfirmPwd(e.currentTarget.value);

        if (editPwd !== e.currentTarget.value) {
            setEditConfirmPwdMsg('비밀번호가 일치하지 않습니다.');
        } else {
            setEditConfirmPwdMsg('');
            setEditCkPwdConfirm(true);
        }
    }

    function saveImg(e) {    //프로필이미지저장
        e.preventDefault();

        const { files } = e.target;
        console.log(files);

        if (files.length) {
            setImgFile(files[0]);
        }
    }

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

    //프로필 삭제, 프로필 formDate로 보내기, get 프로필 보여주기
    return (

        <div onClick={close}>
            {(prevCkPwd) ?
                <div className={Styles.editModal}>
                    <div className={Styles.modalContainer} onClick={(e) => e.stopPropagation()}>
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
                                        <label for='year'>출생년도</label>
                                        <select id="year"
                                            name="joinYearName" editPwd
                                            value={birth.year}
                                            onChange={(e) => setBirth({ ...birth, year: e.target.value })}>
                                            {years.map(item => (<option value={item} key={item}>{item}</option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label for='month'>월</label>
                                        <select id='month'
                                            name="joinMonthName"
                                            value={birth.month}
                                            onChange={(e) => setBirth({ ...birth, month: e.target.value })}>
                                            {month.map(item => (<option value={item} key={item}>{item}</option>))}
                                        </select>
                                    </div>
                                    <div>
                                        <label for='day'>일</label>
                                        <select id='day'
                                            name="joinDayName"
                                            value={birth.day}
                                            onChange={(e) => setBirth({ ...birth, day: e.target.value })}>
                                            {days.map(item => (<option value={item} key={item}>{item}</option>))}
                                        </select>
                                    </div>
                                </div>
                                <div className={Styles.editBtn}>
                                    <input type="submit" value='수정완료' onClick={userEditPost} />
                                </div>
                            </form>
                        </div>
                        <p className={Styles.userDeleteBtn} onClick={deleteUser}>회원탈퇴</p>
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