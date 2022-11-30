import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Styles from './UserDetail.module.scss';
import { Buffer } from "buffer";
import { SetMap } from "../kakao/kakaoAPI"
import CreateMain from "../kakao/kakaoCreateMain";
import UserEdit from "./UserEdit";



const SERVER_URL = "/api/user/";
const UserDetail = () => {
  const [user, setUser] = useState({});   //유저정보
  const [isFollwing, setIsFollwing] = useState(false);    //팔로우여부
  const [countFollwing, setCountFollwing] = useState(''); //내가팔로잉
  const [countFollwer, setCountFollwer] = useState('');   //나를팔로우
  const [editModalOpen, setEditModalOpen] = useState(false);  //프로필수정모달스위치
  const [img, setImg] = useState("");

  const sessionId = sessionStorage.getItem('loginUID');
  const { id } = useParams();

  //////////////////////////////////
  const [birth, setBirth] = useState({
    year: 2022,
    month: 1,
    day: 1,
  });
  //////////////////////////////////


  //console.log('sessionID' + sessionId);
  //console.log('paramsID' + id);
  const userInfo = async () => {
    const res = await axios.get(SERVER_URL + id);
    console.log(res.data);
    setUser(res.data.Users);
    setIsFollwing(res.data.isFollwer);
    setCountFollwing(res.data.Users.Follwers.length);
    setCountFollwer(res.data.Users.Follwings.length);

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
      setImg(`${process.env.PUBLIC_URL}/img/profile.png`);
    }
  }

  useEffect(() => {
    userInfo();

  }, []);

  function followFnc() {
    axios.post(SERVER_URL + parseInt(id) + '/follwer').then(res => {
      console.log(res.data);
      const { result } = res.data;

      if (result === 'follow') {
        setIsFollwing(!isFollwing); //팔로우>언팔 / 언팔>팔로우
        setCountFollwer(countFollwer + 1);
      } else if (result === 'unfollow') {
        setIsFollwing(!isFollwing);
        setCountFollwer(countFollwer - 1);

      }
    });
  }

  const openEditModal = () => {
    setEditModalOpen(true);
    document.body.style.overflow = "hidden";
  }
  const closeEditModal = () => {
    setEditModalOpen(false);
    document.body.style.overflow = "unset";
  }

  return (
    <>
      <div className={Styles.container}>
        <div className={Styles.userInfoDiv}>
          {/* <div><img src="./img/profile.png"></img></div> */}

          <div className={Styles.profileImg}>
            <img src={img}></img>
            <div>
              <p>{user.NickName}</p>
              <span>{birth.year}.{birth.month}.{birth.day}</span>
            </div>
          </div>
          <div className={Styles.profileContent}>
            <div className={Styles.profileCount}>
              <div>
                <p>게시글</p>
                <span>{user.Boards?.length}</span>
              </div>
              <div>
                <p>팔로워</p>
                <span>{countFollwer}</span>
              </div>
              <div>
                <p>팔로잉</p>
                <span>{countFollwing}</span>
              </div>
            </div>
            <div className={Styles.profileBtn}>
              {(sessionId !== 'undefined') ?
                (sessionId === id) ? <button onClick={openEditModal}>프로필 편집</button>
                  : (isFollwing) ? <button onClick={followFnc}>언팔로우</button>
                    : <button onClick={followFnc}>팔로우</button>
                : null}
            </div>
            {editModalOpen && <UserEdit close={closeEditModal}></UserEdit>}

          </div>
        </div>
        <div className={Styles.userMNB}>
          <div className={Styles.userPhotoDiv}>
            {(user.Boards?.length > 0) ? (
              (user.Boards?.map((board, index) => {

                const img = Buffer.from(board.Pictures[0].Photo.data).toString('base64');
                CreateMain(board, img, index, sessionId);
                return (
                  <div className={Styles.imgDiv} key={index} >
                    <Link to={`/board/${board.BID}`}>
                      <img className={Styles.img} src={`data:image;base64,${img}`}></img>
                    </Link>
                  </div>
                );
              }))
            ) : (
              <div className={Styles.noBoard}>
                <p>맛집을 찾아보세요!</p>
              </div>

            )}
          </div>
          <div className={Styles.userMapDiv}>
            <SetMap zoom={6} />
          </div>
        </div>
      </div>
    </>
  );
}

export default UserDetail;