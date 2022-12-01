import React, { useEffect, useState, useCallback } from "react";
import Styles from "./Main.module.scss";
import useBoardData from "../hooks/useBoardData";
import { Buffer } from "buffer";
import { Link, useParams } from "react-router-dom";

//main과 같음 (tag 유무 확인만 있음)
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

  //시간 계산
  const setTimeer = (createdAt) => {
    //게시물 작성날짜 시간 가져오기
    const create = new Date(createdAt);
    //현재 시각 가져옴
    const date = new Date();
    //년수 출력
    
    let times = Math.ceil((date.getTime() - create.getTime()) / 1000);

    if(times < 60){
      return `${times}초 전`
    }else{
      times = Math.floor(times / 60);
      if(times < 60){
        return `${times}분 전`
      } else{
        times =  Math.floor(times / 60);
        if(times < 24){
          return `${times}시간 전`
        }else{
          times =  Math.floor(times / 24);
          if(times < 30){
            return `${times}일 전`
          }else{
            times =  Math.floor(times / 30);
            if(times < 12){
              return `${times}달 전`
            }else {
              times =  Math.floor(times / 12);
              return `${times}년 전`
            }
          }
        }
      }
    }
  }

  const boardComponet = (board) => {
    //이미지 변환
    let profile = `${process.env.PUBLIC_URL}/img/profile.png`;
    if (board.User.Profile) {
      profile = Buffer.from(board.User.Profile).toString('base64');
    }
    const img = Buffer.from(board.Pictures[0].Photo.data).toString('base64');

    const coneShort = (content) => {
      if(content.length > 30){
        content = content.substring(0, 30) + '  ••••';
      }
      
      return content
    }

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
          <span className={Styles.titleName}>
            <h1>{board.PlaceName}</h1>
            <p>{setTimeer(board.createdAt)}</p>
          </span>
          <h2>{board.Location}</h2>
          <p>{coneShort(board.Content)}</p>
          <p className={Styles.tag}>
            {board.Hashtags?.map(({ title }) => {
              return (
                <span className={Styles.sape}><span>#</span>{`${title}`}</span>
              );
            })}
          </p>
          <div className={Styles.starDiv}>
            <span className={Styles.star}>
              {boardStar(board.Star)}
            </span>
            <span className={Styles.like}><span>❤</span>{board.BoardLikes.length}</span>
            <span>
              👁 {board.Views}
            </span>
            <span className={Styles.commts}>
              {board.Comments.length} 💬
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