import React, { useEffect, useState, useCallback } from "react";
import Styles from "./Main.module.scss";
import useBoardData from "../hooks/useBoardData";
import { Buffer } from "buffer";
import { Link } from "react-router-dom";
import { SetMap } from "../kakao/kakaoAPI";
import CreateMain from "../kakao/kakaoCreateMain";

function Main() {

  let sessionId = sessionStorage.getItem('loginUID');

  const [page, setPage] = useState({
    path: 'main',
    num: 0,
    style: {
      paddingTop: '0px'
    }
  });
  const [loading, error, boards, hasMore, user] = useBoardData(page);

  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      const observer = new IntersectionObserver((entries) => {


        if (entries[0].isIntersecting && hasMore) {
          setPage({
            ...page,
            num: page.num + 1
          });
        } else if (!hasMore) {
          console.log("더 없음");
        }

      }, { threshold: 1 });

      if (node) observer.observe(node);

    },
    // loading, hasMore 이 있을 경우에만 함수가 생성된다
    [loading, hasMore]
  );


  useEffect(() => {
    if (sessionId === null || sessionId === 'undefined' || sessionId === '') {
      setPage({
        ...page,
        path: 'best',
        style: {
          paddingTop: '20px'
        }
      });
    }
  }, []);

  return (
    <div className={Styles.container} style={page.style}>
      {page.path === 'main' &&
        <div className={Styles.userMapDiv}>
          {/* 팔로우유저, 지도 보여주는 영역 */}
          <div className={Styles.fwUserDiv}>
            {user?.map((fUser, index) => {
              let profile = "./img/profile.png";
              if (fUser.Profile) {
                profile = Buffer.from(fUser.Profile).toString('base64');
              }
              return (
                <Link to={`/user/${fUser.UID}`} key={index}>
                  <div className={Styles.profileDiv} >
                    <img src={(fUser.Profile) ?
                      `data:image;base64,${profile}` : profile}></img>
                    <span>{fUser.NickName}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <SetMap />
        </div>
      }

      {/* 게시글 간략보기 */}
      <div className={Styles.boardContainer}>

        {boards?.map((board, index) => {

          //이미지 변환
          let profile = "./img/profile.png";
          if (board.User.Profile) {
            //console.log(board.User.Profile);
            profile = Buffer.from(board.User.Profile).toString('base64');
          }
          
          const img = Buffer.from(board.Pictures[0].Photo.data).toString('base64');

          //지도 이미지 출력
          page.path === 'main' && CreateMain(board, img, index, parseInt(sessionId));


          //마지막 item에 ref
          if (board.length !== 0 && boards.length === index + 1) {
            return (
              <Link to={`/board/${board.BID}`} key={Math.random()}>

                <div ref={lastElementRef} className={Styles.boardDiv}>
                  <div className={Styles.userDiv}>

                    <img src={(board.User.Profile) ?
                      `data:image;base64,${profile}` : profile}></img>

                    <h1>{board.User.NickName}</h1>
                  </div>
                  <div className={Styles.boardimgDiv}>
                    <img className={Styles.boardImg} src={`data:image;base64,${img}`} />
                  </div>
                  <div className={Styles.contentsDiv}>
                    <h1>{board.Location}</h1>
                    <p>{board.Content}</p>
                    <div className={Styles.starDiv}>
                      <span className={Styles.like}><span>❤</span>{board.BoardLikes?.length}</span>
                      <span className={Styles.star}>⭐{board.Star}</span>
                    </div>
                  </div>
                </div>

              </Link>
            );
          } else {
            return (
              <Link to={`/board/${board.BID}`} key={Math.random()}>

                <div key={Math.random()} className={Styles.boardDiv}>
                  <div className={Styles.userDiv}>
                    <img src={(board.User.Profile) ?
                      `data:image;base64,${profile}` : profile}></img>

                    <h1>{board.User.NickName}</h1>
                  </div>
                  <div className={Styles.boardimgDiv}>
                    <img className={Styles.boardImg} src={`data:image;base64,${img}`} />
                  </div>
                  <div className={Styles.contentsDiv}>
                    <h1>{board.Location}</h1>

                    <p>{(board.Content.length > 35) ? board.Content.substr(0, 30) + '...' : board.Content}</p>
                    <div className={Styles.starDiv}>
                      {console.log(board)}
                      <span className={Styles.like}><span>❤</span>{board.BoardLikes?.length}</span>
                      <span className={Styles.star}>⭐{board.Star}</span>
                      {/* <span className={Styles.tag}> #태그 #태그</span> */}
                    </div>
                  </div>
                </div>

              </Link>
            );
          }
        })}
        {loading && <div>loading...</div>}
        {error && <div>error...</div>}

      </div>
    </div>
  );
}

export default Main;
