import React, { useEffect, useState, useCallback, useContext } from "react";
import Styles from "./Main.module.scss";
import { kakaoMap, boardMapSearch, mainMapSearch } from "./kakaoMap";
import useBoardData from "../hooks/useBoardData";
import { Buffer } from "buffer";
import { Link } from "react-router-dom";

function Main() {

  const [pageNum, setPageNum] = useState(0);
  const [loading, error, boards, hasMore, user] = useBoardData(pageNum);
  let sessionId = parseInt(sessionStorage.getItem('loginUID'));
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      const observer = new IntersectionObserver((entries) => {

        
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prevPageNum) => prevPageNum + 1);
        } else if (!hasMore) {
          console.log("더 없음");
        }        

      }, { threshold: 1 });

      if (node) observer.observe(node);

    },
    // loading, hasMore 이 있을 경우에만 함수가 생성된다
    [loading, hasMore]
  );

  //유저상세보기
  const profileClickFnc = (fUserID) => {
    console.log(fUserID);
  }

  useEffect(() => {
    kakaoMap(6);
    
  }, []);


  return (
    <div className={Styles.container}>

      <div className={Styles.userMapDiv}>
        {/* 팔로우유저, 지도 보여주는 영역 */}
        <div className={Styles.fwUserDiv}>
          {user.map((fUser, index) => {
            return (
              <div className={Styles.profileDiv} key={index}>
                <img src="./img/profile.png" onClick={() => profileClickFnc(fUser.UID)}></img>
                <span>{fUser.NickName}</span>
              </div>
            );
          })}

          

        </div>
        {/* 지도출력 */}
        <div className={Styles.mapDiv} id="myMap">
        </div>
      </div>

      {/* 게시글 간략보기 */}
      <div className={Styles.boardContainer}>
        {boards?.map((board, index) => {

          //이미지 변환
          const img = Buffer.from(board.Pictures[0].Photo.data).toString('base64');

          //지도 이미지 출력
          mainMapSearch(board, img, index, sessionId);


          //마지막 item에 ref
          if (board.length !== 0 && boards.length === index + 1) {
            return (
              <Link to={`/board/${board.BID}`} key={Math.random()}>

                <div ref={lastElementRef} className={Styles.boardDiv}>
                  <div className={Styles.userDiv}>
                    <img src="./img/profile.png"></img>
                    <h1>{board.User.NickName}</h1>
                  </div>
                  <div className={Styles.boardimgDiv}>
                    <img className={Styles.boardImg} src={`data:image;base64,${img}`} />
                  </div>
                  <div className={Styles.contentsDiv}>
                    <h1>{board.Location}</h1>
                    <p>{board.Content}</p>
                    <div className={Styles.starDiv}>
                      <span className={Styles.star}>⭐{board.Star}</span>
                      <span className={Styles.tag}> #태그 #태그</span>
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
                    <img src="./img/profile.png"></img>
                    {/* <img src="data:image;base64,'+ img +'" style="width: 70px; height: 70px;" onclick="this.remove()" /> */}
                    <h1>{board.User.NickName}</h1>
                  </div>
                  <div className={Styles.boardimgDiv}>
                    <img className={Styles.boardImg} src={`data:image;base64,${img}`} />
                  </div>
                  <div className={Styles.contentsDiv}>
                    <h1>{board.Location}</h1>
                    <p>{board.Content}</p>
                    <div className={Styles.starDiv}>
                      <span className={Styles.star}>⭐{board.Star}</span>
                      <span className={Styles.tag}> #태그 #태그</span>
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
