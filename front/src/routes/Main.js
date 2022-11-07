import React, { useEffect, useState, useCallback } from "react";
import Styles from "./Main.module.scss";
import {kakaoMap, boardMapSearch, mainMapSearch} from "./kakaoMap";
import useBoardData from "../hooks/useBoardData";

function Main() {
  console.log('!!!!');

  const [pageNum, setPageNum] = useState(0);
  const [loading, error, boards, hasMore] = useBoardData(pageNum);
  
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPageNum((prevPageNum) => prevPageNum + 1);
        } else if (!hasMore) {
          console.log("더 없음");
        }
      }, {threshold: 1});
      
      if (node) observer.observe(node);
      
    },
    // loading, hasMore 이 있을 경우에만 함수가 생성된다
    [loading, hasMore]
  );

  useEffect(() => {
    kakaoMap(6);
  }, []);

  return (
    <div className={Styles.container}>
      <div className={Styles.mapDiv} id="myMap">
      </div>

      <div className={Styles.boardContainer}>

        {boards?.map((board, index) => {
          //마지막 item에 ref
          if (board.length !== 0 && boards.length === index + 1) {
            return (
              <div key={Math.random()} ref={lastElementRef} className={Styles.boardDiv}>
                <div className={Styles.userDiv}>
                  <img src="./img/profile.jpeg"></img>
                  <h1>{board.User.NickName}</h1>
                </div>
                <div className={Styles.boardimgDiv}>
                  <img className={Styles.boardImg} src="./img/test.jfif"></img>
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
            );
          } else {
            return(
              <div key={Math.random()} className={Styles.boardDiv}>
                <div className={Styles.userDiv}>
                  <img src="./img/profile.jpeg"></img>
                  {/* <img src="data:image;base64,'+ img +'" style="width: 70px; height: 70px;" onclick="this.remove()" /> */}
                  <h1>{board.User.NickName}</h1>
                </div>
                <div className={Styles.boardimgDiv}>
                  <img className={Styles.boardImg} src="./img/test.jfif"></img>
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
