import axios from "axios";
import React, { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useUserData from "../hooks/useUserData";
import Styles from "./BestUser.module.scss";
import { Buffer } from "buffer";

const BestUser = () => {
  const [page, setPage] = useState(0);
  const [loading, error, users, hasMore] = useUserData(page);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      const observer = new IntersectionObserver((entries) => {


        if (entries[0].isIntersecting && hasMore) {
          setPage(page.num + 1);
        } else if (!hasMore) {
          console.log("더 없음");
        }

      }, { threshold: 1 });

      if (node) observer.observe(node);

    },
    // loading, hasMore 이 있을 경우에만 함수가 생성된다
    [loading, hasMore]
  );

  const userCkFnc = (e) => {
    const userID = sessionStorage.getItem("loginUID");
    if(userID === null || userID === 'undefined' || userID === ""){
      alert(userID);
      e.preventDefault();
    }
  }

  return (
    <div className={Styles.container}>
      {users?.map((user, idx) => {

        //프로필 이미지 변환
        let profile = "./img/profile.png";
        if (user.Profile) {
          profile = Buffer.from(user.Profile).toString('base64');
        }

        const date = new Date(user.Boards[0]?.createdAt);
        const newBoardDate = 
          `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;

        if (users.length !== 0 && users.length === idx + 1) {
          return (
            <div className={Styles.userContainer} key={idx} ref={lastElementRef}>
              <div className={Styles.userDiv}>
                <Link to={`/user/${user.UID}`}>
                  <img src={(user.Profile) ?
                    `data:image;base64,${profile}` : profile}></img>
                </Link>
                <h1>{user.NickName}</h1>
                <div className={Styles.followerDiv}>
                  <span>{user.Follwings?.length}<br/>팔로워</span>
                  <span>{user.Follwers?.length}<br/>팔로잉</span>
                </div>
                <p>게시글 수 : {user.Boards?.length}</p>
                <p>최근 게시물 : {newBoardDate}</p>
              </div>
              <div className={Styles.boardDiv}>
                {user.Boards?.map((board, idx) => {
                  //게시글 이미지 변환
                  const img = Buffer.from(board.Pictures[0].Photo.data).toString('base64');
                  return (
                    <Link to={`/board/${board.BID}`} key={idx}>
                      <img src={`data:image;base64,${img}`}></img>
                    </Link>
                  );

                })}
              </div>
            </div>
          );
        } else {
          return (
            <div className={Styles.userContainer} key={idx}>
              <div className={Styles.userDiv}>
                <Link to={`/user/${user.UID}`}>
                  <img src={(user.Profile) ?
                    `data:image;base64,${profile}` : profile}></img>
                </Link>
                <h1>{user.NickName}</h1>
                <div className={Styles.followerDiv}>
                  <span>{user.Follwings?.length}<br/>팔로워</span>
                  <span>{user.Follwers?.length}<br/>팔로잉</span>
                </div>
                <p>게시글 수 : {user.Boards?.length}</p>
                {(user.Boards.length !== 0) && <p>최근 게시물 : {newBoardDate}</p>}
              </div>
              <div className={Styles.boardDiv}>
                {user.Boards?.map((board, idx) => {
                  //게시글 이미지 변환
                  const img = Buffer.from(board.Pictures[0].Photo.data).toString('base64');
                  return (
                    <Link to={`/board/${board.BID}`} key={idx}>
                      <img src={`data:image;base64,${img}`}></img>
                    </Link>
                  );

                })}
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}

export default BestUser;