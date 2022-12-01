import React, { useEffect, useState, useCallback } from "react";
import Styles from "./Main.module.scss";
import useBoardData from "../hooks/useBoardData";
import { Buffer } from "buffer";
import { Link } from "react-router-dom";
import { SetMap } from "../kakao/kakaoAPI";
import CreateMain from "../kakao/kakaoCreateMain";

function Main() {

  let sessionId = sessionStorage.getItem('loginUID');

  //BEST, USER, MAIN 구분하며,
  //한페이지 갯수를 정해 보여줌
  const [page, setPage] = useState({
    path: 'main',
    num: 0,
    style: {
      paddingTop: '0px'
    }
  });
  //page가 변경될때마다 게시물을 가져옴
  const [loading, error, boards, hasMore, user] = useBoardData(page);

  //마지막 게시물을 읽어서 새롭게 랜더링 시도한다.
  
  const lastElementRef = useCallback(
    (node) => {
      if (loading) return;
      const observer = new IntersectionObserver((entries) => {


        //요청시 더 있을시 페이지를 추가한다.
        if (entries[0].isIntersecting && hasMore) {
          setPage({
            ...page,
            num: page.num + 1
          });
        } 
        
      }, { threshold: 1 });

      if (node) observer.observe(node);

    },
    // loading, hasMore 이 있을 경우에만 함수가 생성된다
    [loading, hasMore]
  );

  //별점 출력
  const boardStar = (star) => {
    let arr = [];
    for (let i = 0; i < parseInt(star); i++) {
      arr.push(<div key={i}>★</div>);
    }
    return arr;
  }

  //간략보기 게시물 한개 함수
  const boardComponet = (board, index) => {
    //이미지 변환
    let profile = `${process.env.PUBLIC_URL}/img/profile.png`;

    //프로필 확인
    if (board.User.Profile) {
      //변경된 프로필로 변환
      profile = Buffer.from(board.User.Profile).toString('base64');
    }
    const img = Buffer.from(board.Pictures[0].Photo.data).toString('base64');
    // //지도 이미지 출력
    page.path === 'main' && CreateMain(board, img, index, parseInt(sessionId));

    //게시물 내용 글이 길다면 잘라냄
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
          <h1>{board.PlaceName}</h1>
          <h2>{board.Location}</h2>
          <p>{coneShort(board.Content)}</p>
          <p className={Styles.tag}>
            {board.Hashtags?.map(({title}) => {
              return <span className={Styles.sape}><span>#</span>{`${title}`}</span>;
            })}
          </p>
          <div className={Styles.starDiv}>
            <span className={Styles.star}>
              {boardStar(board.Star)}
            </span>
            <span className={Styles.like}><span>❤</span>{board.BoardLikes?.length}</span>
            <span>
              👁 {board.Views}
            </span>
          </div>
        </div>
      </>
    );
  }

  useEffect(() => {
    //메인페이지에서 비로그인시 best의 글을 보여줌
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
              let profile = `${process.env.PUBLIC_URL}/img/profile.png`;
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
          <SetMap zoom={8} />
        </div>
      }

      {/* 게시글 간략보기 */}
      <div className={Styles.boardContainer}>

        {boards?.map((board, index) => {
          //마지막 item에 ref
          if (!!board && boards.length === index + 1) {
            return (
              <Link to={`/board/${board.BID}`} key={Math.random()}>
                <div ref={lastElementRef} className={Styles.boardDiv}>
                  {boardComponet(board, index)}
                </div>
              </Link>
            );
          } else if(!!board) {
            return (
              <Link to={`/board/${board.BID}`} key={Math.random()}>
                <div key={Math.random()} className={Styles.boardDiv}>
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

export default Main;
