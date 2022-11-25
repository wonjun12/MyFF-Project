import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Styles from './UserDetail.module.scss';
import { Buffer } from "buffer";
import { SetMap} from "../kakao/kakaoAPI"
import CreateMain from "../kakao/kakaoCreateMain";
import UserEdit from "./UserEdit";



const SERVER_URL = "/api/user/"; 
const UserDetail = ()=>{
    const [user, setUser] = useState({});   //유저정보
    const [isFollwing, setIsFollwing] = useState(false);    //팔로우여부
    const [countFollwing, setCountFollwing] = useState(''); //내가팔로잉
    const [countFollwer, setCountFollwer] = useState('');   //나를팔로우
    const [editModalOpen, setEditModalOpen] = useState(false);  //프로필수정모달스위치
    
    const sessionId = sessionStorage.getItem('loginUID');
    const {id} = useParams();
    
    //console.log('sessionID' + sessionId);
    //console.log('paramsID' + id);
    const userInfo = async () => {
        const res = await axios.get(SERVER_URL+id);
        console.log(res.data);
        setUser(res.data.Users);
        setIsFollwing(res.data.isFollwer);
        setCountFollwing(res.data.Users.Follwers.length);
        setCountFollwer(res.data.Users.Follwings.length);
    }
    
    useEffect(()=>{
        userInfo();

    }, []);

    function followFnc(){
        axios.post(SERVER_URL + parseInt(id) + '/follwer').then(res => {
            console.log(res.data);
            const {result} = res.data;
            
            if(result === 'follow'){
                setIsFollwing(!isFollwing); //팔로우>언팔 / 언팔>팔로우
                setCountFollwer(countFollwer + 1);
            }else if(result === 'unfollow'){
                setIsFollwing(!isFollwing);
                setCountFollwer(countFollwer - 1);

            }
        });
    }
    
    const openEditModal = () => {
        setEditModalOpen(true);
    }
    const closeEditModal = () => {
        setEditModalOpen(false);
    }

    return(
        <>
        <div className={Styles.userInfoDiv}>
                {/* <div><img src="./img/profile.png"></img></div> */}
                <div className={Styles.profileImg}>
                    <img src='../img/profile.png'></img>
                    <p>닉네임: {user.NickName}</p>
                </div>
                <div className={Styles.profileContent}>
                    <p>게시글: {user.Boards?.length}</p>
                    <p>팔로워 {countFollwer}</p>
                    <p>팔로잉 {countFollwing}</p>
                    {(sessionId === id)? <button onClick={openEditModal}>프로필 편집</button>
                    : (isFollwing === true)? <button onClick={followFnc}>언팔로우</button> 
                    : <button onClick={followFnc}>팔로우</button>}
                    {editModalOpen && <UserEdit close={closeEditModal}></UserEdit>}   
                    {/* 로그인된 sessionId와 params로 받아오는 id 가 같으면(내프로필이면) 프로필편집버튼, 다르면 팔로우/언팔버튼 */}
                </div>
        </div> 
        <div className={Styles.userMNB}>
            
            <div className={Styles.userPhotoDiv}>
                {user.Boards?.map((board, index) => {
                    
                    const img = Buffer.from(board.Pictures[0].Photo.data).toString('base64');
                    CreateMain(board, img, index, sessionId);

                    return(
                        <div className={Styles.imgDiv} key={index} >
                            <Link to={`/board/${board.BID}`}>
                                <img className={Styles.img} src={`data:image;base64,${img}`}></img>
                            </Link>
                        </div>
                    );
                })}
            </div>
            <div className={Styles.userMapDiv}>
                <SetMap zoom={6}/>
            </div>
        </div>
        </>
    );
}

export default UserDetail;