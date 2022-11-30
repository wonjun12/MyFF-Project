import React, { useEffect, useState, useCallback } from "react";
import Styles from "./Main.module.scss";
import useBoardData from "../hooks/useBoardData";
import { Buffer } from "buffer";
import { Link, useParams } from "react-router-dom";

const Best = ({ isTag }) => {

  const tag = useParams('name');
  const [page, setPage] = useState({
    tag: tag.name,
    path: 'best',
    num: 0,
  });
  const [loading, error, boards, hasMore] = useBoardData(page, !!isTag);

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

  const boardStar = (star) => {
    let arr = [];
    for (let i = 0; i < parseInt(star); i++) {
      arr.push(<div key={i}>★</div>);
    }
    return arr;
  }

  const boardComponet = (board) => {
    //이미지 변환
    let profile = `${process.env.PUBLIC_URL}/img/profile.png`;
    if (board.User.Profile) {
      profile = Buffer.from(board.User.Profile).toString('base64');
    }
    const img = Buffer.from(board.Pictures[0].Photo.data).toString('base64');

    return (
      <>
        <div className={Styles.userDiv}>
          <img src={(board.User.Profile) ?
            `data:image;base64,${profile}` : profile}></img>
          <h1>{board.User.NickName}</h1>
        </div>
        <div className={Styles.boardimgDiv}>
          <img className={Styles.boardImg} src={`data:image;base64,${img}`} />
        </div>
        <div className={Styles.contentsDiv}>
          <h1>{board.PlaceName}</h1>
          <h2>{board.Location}</h2>
          <p>{board.Content}</p>
          <p className={Styles.tag}>
            {board.Hashtags?.map(({ title }) => {
              return (
                <span>{`#${title}`}</span>
              );
            })}
          </p>
          <div className={Styles.starDiv}>
            <span className={Styles.like}><span>❤</span>{board.BoardLikes.length}</span>
            <span className={Styles.star}>
              {boardStar(board.Star)}
            </span>
          </div>
        </div>
      </>
    );
  }

  return (
    <div className={Styles.container} style={{ paddingTop: '20px' }}>
      {/* 게시글 간략보기 */}
      <div className={Styles.boardContainer}>
        {boards?.map((board, index) => {
          //마지막 item에 ref
          if (board.length !== 0 && boards.length === index + 1) {
            return (
              <Link to={`/board/${board.BID}`} key={Math.random()}>
                <div ref={lastElementRef} className={Styles.boardDiv}>
                  {boardComponet(board, index)}
                </div>
              </Link>
            );
          } else {
            return (
              <Link to={`/board/${board.BID}`} key={Math.random()}>
                <div className={Styles.boardDiv}>
                  {boardComponet(board, index)}
                </div>
              </Link>
            );
          }
        })}
      </div>
      {loading && <div className={Styles.loader}></div>}
    </div>
  );
}

export default Best;