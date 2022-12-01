import axios from "axios";
import React, { Component, useCallback, useEffect, useState } from "react";
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
        }

      }, { threshold: 1 });

      if (node) observer.observe(node);

    },
    // loading, hasMore 이 있을 경우에만 함수가 생성된다
    [loading, hasMore]
  );

  //유저 정보 DIV 한개
  const userComponet = (user) => {

    //프로필 이미지 변환
    let profile = `${process.env.PUBLIC_URL}/img/profile.png`;
    if (user.Profile) {
      profile = Buffer.from(user.Profile).toString('base64');
    }
    return (
      <>
        <div className={Styles.userDiv}>
          <Link to={`/user/${user.UID}`}>
            <img src={(user.Profile) ?
              `data:image;base64,${profile}` : profile}></img>
          </Link>
          <h1>{user.NickName}</h1>
          <div className={Styles.followerDiv}>
            <span>{user.Follwings?.length}<br />팔로워</span>
            <span>{user.Follwers?.length}<br />팔로잉</span>
          </div>
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
      </>
    );
  }

  return (
    <div className={Styles.container}>
      {users?.map((user, idx) => {
        if (users.length !== 0 && users.length === idx + 1) {
          return (
            <div className={Styles.userContainer} key = { idx } ref = { lastElementRef } >
              {userComponet(user)}
            </div>
          );
        } else {
          return (
            <div className={Styles.userContainer} key={idx}>
              {userComponet(user)}
            </div>
          );
        }
      })}
      {loading && <div className={Styles.loader}></div>}
    </div>
  );
}

export default BestUser;