import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Styles from "./BoardDetail.module.scss";
import { Buffer } from "buffer";
import { SetMap } from "../kakao/kakaoAPI";
import CreateMarker from '../kakao/kakaoCreateMarker';
import Swal from 'sweetalert2'

const SERVER_URL = '/api/board';

const BoardDetail = () => {
  axios.defaults.withCredentials = true;

  const userID = sessionStorage.getItem("loginUID");
  const navigate = useNavigate();

  //댓글 더보기
  const [commMore, setCommMore] = useState(0);

  //게시물 초기 정보
  const { id } = useParams();
  const [board, setBoard] = useState({});
  const [pictures, setPictures] = useState([]);
  const [comments, setComments] = useState([]);
  const [imgPage, setImgPage] = useState(1);
  const [commView, setCommView] = useState(false);
  const [commtEditID, setCommtEditID] = useState(0);
  const [commtEditText, setCommtEditText] = useState("");
  const [like, setLike] = useState({
    length: 0,
    isLike: false
  });

  //날짜
  const [boardDate, setBoardDate] = useState({
    create: "",
    update: "",
  });

  //날짜 설정
  const getDate = (str) => {
    const date = new Date(str);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const hour = date.getHours();
    const minute = date.getMinutes();
    return `${year}-${month}-${day} ${hour}:${minute}`
  }

  const [isFollwing, setIsFollwing] = useState(false);    //팔로우여부

  //게시물 정보 가져오기
  const dataFetch = async () => {
    const res = await axios.get(`${SERVER_URL}/${id}`);

    setBoard(res.data.Board);
    setPictures(res.data.Board.Pictures);
    setComments(res.data.Board.Comments);

    res.data.Board.BoardLikes.forEach(({ UID }) => {
      if (UID === parseInt(sessionStorage.getItem('loginUID'))) {
        like.isLike = true;
      }
      like.length++;
    });

    setLike(like);
    setIsFollwing(res.data.isFollwer);

    setBoardDate({
      create: getDate(res.data.Board.createdAt),
      update: getDate(res.data.Board.updatedAt),
    })

  }

  const commentDataFetch = async () => {
    const res = await axios.get(`${SERVER_URL}/${id}/commt`);

    if(res.data.result){
      setComments(res.data.commt);
    }
  }
  //이미지 이전 버튼
  const prevClick = () => {
    if (imgPage > 1) {
      setImgPage((prev) => prev - 1);
    }
  }

  //이미지 다음 버튼
  const nextClick = () => {
    if (imgPage < pictures.length) {
      setImgPage((prev) => prev + 1);
    }
  }


  //댓글 추가
  const commentAdd = (e) => {
    e.preventDefault();
    const { userComment } = e.target;
    //console.log(userID);
    // 댓글을 입력한 경우만 post 요청
    if (userComment.value !== "" && userID !== 'undefined') {
      axios.post(`${SERVER_URL}/${id}/commt`, {
        userID: parseInt(userID),
        commtName: userComment.value
      }, { withCredentials: true }).then(res => {
        //console.log(res.data);
        if (res.data.result === "ok") {
          commentDataFetch();
          setCommMore(Math.ceil(comments.length / 10))
          scrollEnd();
          setCommView(true);
          userComment.value = "";
        }
      });
    }
  }

  //댓글 삭제
  const commtDeleteFnc = (commtID) => {
    //console.log(commtID);
    axios.post(`${SERVER_URL}/${id}/commt/edit`, {
      commtID,
      action: "delete"
    }, { withCredentials: true }).then(res => {
      //console.log(res.data);
      if (res.data.result === "ok") {
        commentDataFetch();
        //console.log("OK");
      }
    });
  }

  //댓글 수정
  const commtEditFnc = (commtID) => {
    //console.log(commtID);
    //console.log(commtEditText);
    if (commtEditText !== "") {
      axios.post(`${SERVER_URL}/${id}/commt/edit`, {
        commtID,
        commtEditText,
        action: "edit"
      }, { withCredentials: true }).then(res => {
        //console.log(res.data);
        if (res.data.result === "ok") {
          setCommtEditID(0);
          setCommtEditText("");
          commentDataFetch();
        }
      });
    }
  }


  //게시물 좋아요
  const boardLikeFnc = async () => {
    await axios.post(`${SERVER_URL}/${id}/like`);

    setLike((prev) => ({
      length: prev.isLike ? prev.length - 1 : prev.length + 1,
      isLike: (!prev.isLike)
    }));

  }


  //게시물 별점 출력
  const boardStar = () => {
    let arr = [];
    for (let i = 0; i < parseInt(board.Star); i++) {
      arr.push(<div key={i}>★</div>);
    }
    return arr;
  }


  //게시물 삭제
  const boardDeleteFnc = async (BID) => {


    Swal.fire({
      title: '정말로 삭제 하시겠습니까?',
      text: "삭제 후 취소할수 없습니다.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: '삭제하기',
      cancelButtonText:'취소'
    }).then(async (result) => {
      if (result.isConfirmed) {
        const res = await axios.post(`${SERVER_URL}/${BID}/delete`);
        const { result } = res.data;

        if(result){
          Swal.fire(
            '삭제 완료!',
            '정상적으로 삭제되었습니다.',
            'success',
          )
          navigate(`/`);
        }else{
          Swal.fire({
            icon: 'error',
            title: '에러',
            text: '예상치 못한 오류가 났습니다.',
          })
        }
        
      }
    })
  }

  //팔로우 버튼
  const followFnc = async (FUID) => {
    const {data} = await axios.post('/api/user/' + FUID + '/follwer');
    const { result } = data;
  
      if (result === 'follow') {
        setIsFollwing(!isFollwing); //팔로우>언팔 / 언팔>팔로우
      } else if (result === 'unfollow') {
        setIsFollwing(!isFollwing);
      }
      dataFetch();
  }


  useEffect(() => {
    dataFetch();
  }, []);


  //0.4초후 맨아래로 스크롤 내림
  const scrollEnd = () => {
    setTimeout(() => {
      document.body.scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'nearest' });
    }, 400);
  }

  //댓글을 열경우 실행
  useEffect(() => {
    if(commView){
      scrollEnd();
    }
  }, [commView])


    
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


  return (
    <div className={Styles.container}>
      <div className={Styles.userMap}>
        {/*==== User ====*/}
        <div className={Styles.userDiv}>
          {(board.User?.Profile) ? (
            <img src={`data:image;base64,${Buffer.from(board.User.Profile).toString('base64')}`}></img>
          ) : (
            <img src={`${process.env.PUBLIC_URL}/img/profile.png`} />
          )}
          <div className={Styles.userInfo}>
            <h1>{board.User?.NickName}</h1>
            <div className={Styles.followerDiv}>
              <span>{board.User?.Follwers.length}<p>팔로잉</p></span>
              <span>{board.User?.Follwings.length}<p>팔로워</p></span>
            </div>
            <div className={Styles.btnDiv}>
              <Link to={`/user/${board.User?.UID}`} >
                <input className={Styles.userBtn} type="button" value="둘러보기" />
              </Link>
              {(userID !== 'undefined' && parseInt(userID) !== board.User?.UID) ? (
                <>
                  {(isFollwing) ? <input className={Styles.userBtn} type="button" value="언팔로우" onClick={() => followFnc(board.User?.UID)}/>
                    : <input className={Styles.userBtn} type="button" value="팔로우"  onClick={() => followFnc(board.User?.UID)}/>}
                </>
              ) : null}
            </div>
          </div>
        </div>

        {/*==== Map ====*/}
        <div className={Styles.mapDiv}>
          <div className={Styles.map}>
            <SetMap />
            {CreateMarker(board.Location)}
            <div className={Styles.locationDiv}>
              <h1>{board.PlaceName}</h1>
              <p>{board.Location}</p>
            </div>
          </div>
        </div>
      </div>

      {/*==== Picture ====*/}
      <div className={Styles.imageDiv}>
        <span className={Styles.prev} onClick={prevClick}>◀</span>
        {pictures.length > 0 ?
          (
            pictures.map((picture, idx) => {
              if (imgPage === idx + 1) {
                const img = Buffer.from(picture.Photo.data).toString('base64');
                return (
                  <span key={idx} className={Styles.pictureSpan}>
                    <img src={`data:image;base64,${img}`}></img>
                  </span>
                )
              }
            })
          ) : null
        }
        <span className={Styles.next} onClick={nextClick}>▶</span>
      </div>
      {/*==== Content ====*/}
      <div className={Styles.contentDiv}>
        <div className={Styles.likeStarDiv}>
          <div onClick={boardLikeFnc} className={like.isLike ? Styles.like : Styles.unlike}>
            ❤
          </div>
          <div className={Styles.likeNumber}>{like.length}</div>
          <div className={Styles.star}>
            {boardStar()}
          </div>
          <div className={Styles.view}>
            👁 {board.Views}
          </div>
        </div>
        <div>
          <p>{board.Content}</p>
        </div>
        <div>
          <p className={Styles.tag}>
            {board.Hashtags?.map(({ title }) => {
              return (
                <Link to={`/tag/${title}`} key={Math.random()}>
                  <span className={Styles.sape}>
                    <span>#</span>
                    {`${title}`}
                  </span></Link>
              );
            })}
          </p>
        </div>
        <p className={Styles.createDate}>{boardDate.create} ({setTimeer(board.createdAt)})</p>
        {board.User?.UID === parseInt(userID) &&
          <div>
            <Link to={`/board/${board.BID}/edit`}>
              <input className={Styles.boardEditBtn} type="button" value="수정하기" />
            </Link>
            <input className={Styles.boardDeleteBtn} type="button" value="삭제하기" onClick={() => boardDeleteFnc(board.BID)}/>
          </div>
        }
      </div>

      {/*==== Comm ====*/}
      <div className={Styles.commentDiv}>

        {/* 댓글추가 */}
        <form onSubmit={commentAdd}>
          <div className={Styles.newCommDiv}>
            {(userID === 'undefined') ? (
              <>
                <span>MYFF</span>
                <input type="text" placeholder="로그인 후 이용가능" readOnly></input>
                <input type="submit" value="추가" disabled></input>
              </>
            ) : (
              <>
                <span>{sessionStorage.getItem('loginUserId')}</span>
                <input type="text" name="userComment"></input>
                <input type="submit" value="추가"></input>
              </>
            )}
          </div>
        </form>

        <div className={Styles.commSetDiv} onClick={() => setCommView(!commView)}>
          <p>{commView ? "댓글접기▲" : "댓글보기▼"}</p>
        </div>

        {(comments.length > 0 && commView) ? (
          comments.slice(0, (commMore * 10 + 10)).map((comment, idx) => {

            return (
              <div className={Styles.commDiv} key={idx}>
                <p>
                  <Link to={`/user/${comment.User.UID}`}>
                    {comment.User.NickName}
                  </Link>
                </p>
                {(commtEditID === comment.CID) ? (
                  <input type="text"
                    className={Styles.editCommInput}
                    value={commtEditText}
                    onChange={(e) => setCommtEditText(e.target.value)}
                    autoComplete="off" //form 자동완성 OFF
                  />
                ) : (
                  <p>{comment.comm}</p>
                )}

                <p style={{color:'gray', paddingTop:'10px'}}>{((comment.updatedAt === comment.createdAt) ? getDate(comment.createdAt) : getDate(comment.updatedAt) + " (수정됨)")} ({setTimeer(comment.createdAt)})</p>

                {comment.UID === parseInt(userID) &&
                  <div className={Styles.commtEditDiv}>
                    <input type="text" value={comment.CID} readOnly hidden></input>
                    {(commtEditID === comment.CID) ? (
                      <input type="button" value="저장" onClick={() => commtEditFnc(comment.CID)}></input>
                    ) : (
                      <input type="button" value="수정"
                        onClick={() => {
                          setCommtEditID(comment.CID);
                          setCommtEditText(comment.comm);
                        }}
                      />
                    )}
                    <input type="button" value="삭제" onClick={() => commtDeleteFnc(comment.CID)}></input>
                  </div>
                }
              </div>
            );
          })
        ) : null}
        <div className={Styles.commtMore}>
        {((comments.length > commMore * 10 + 10) && commView)? 
            <button type="button" onClick={() => {
              setCommMore(commMore+1);
              scrollEnd();
            }}> 댓글 더 보기 </button> : null}
        </div>
      </div>
    </div>
  );
}


export default BoardDetail;