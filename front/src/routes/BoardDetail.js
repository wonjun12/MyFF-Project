import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Styles from "./BoardDetail.module.scss";
import { Buffer } from "buffer";
import { kakaoMap, boardMapSearch, mainMapSearch } from "./kakaoMap";

const SERVER_URL = '/api/board';

const BoardDetail = () => {
  axios.defaults.withCredentials = true;

  const { id } = useParams();
  const [board, setBoard] = useState([]);
  const [pictures, setPictures] = useState([]);
  const [comments, setComments] = useState([]);
  const [imgPage, setImgPage] = useState(1);
  const [commView, setCommView] = useState(false);
  const [commtEditID, setCommtEditID] = useState(0);
  const [commtEditText, setCommtEditText] = useState("");
  const [userID, setUserID] = useState("");

  const dataFetch = () => {
    axios.get(`${SERVER_URL}/${id}`).then(res => {
      //console.log(res.data.Board);
      //console.log(res.data.Picture);
      setBoard(res.data.Board);
      setPictures(res.data.Board.Pictures);
      setComments(res.data.Board.Comments);
      setUserID(res.data.UID);
    });
  }

  const prevClick = () => {
    if (imgPage > 1) {
      setImgPage((prev) => prev - 1);
    }
  }

  const nextClick = () => {
    if (imgPage < pictures.length) {
      setImgPage((prev) => prev + 1);
    }
  }

  const commentAdd = (e) => {
    e.preventDefault();
    const { userComment } = e.target;

    // 댓글을 입력한 경우만 post 요청
    if (userComment.value !== "") {
      axios.post(`${SERVER_URL}/${id}/commt`, {
        userID, 
        commtName: userComment.value
      }, { withCredentials: true }).then(res => {
        //console.log(res.data);
        if (res.data.result === "ok") {
          dataFetch();
          userComment.value = "";
        }
      });
    }
  }

  const commtDeleteFnc = (commtID) => {
    //console.log(commtID);
    axios.post(`${SERVER_URL}/${id}/commt/edit`, {
      commtID,
      action: "delete"
    }, { withCredentials: true}).then(res => {
      //console.log(res.data);
      if(res.data.result === "ok"){
        dataFetch();
        //console.log("OK");
      }
    });
  }

  const commtEditFnc = (commtID) => {
    //console.log(commtID);
    //console.log(commtEditText);
    if(commtEditText !== ""){
      axios.post(`${SERVER_URL}/${id}/commt/edit`, {
        commtID,
        commtEditText,
        action: "edit"
      }, { withCredentials: true}).then(res => {
        //console.log(res.data);
        if(res.data.result === "ok"){
          setCommtEditID(0);
          setCommtEditText("");
          dataFetch();
        }
      });
    }
  }

  useEffect(() => {
    dataFetch();
    kakaoMap(5);
    // boardMapSearch(board.Location);
  }, []);

  return (
    <div className={Styles.container}>

      <div className={Styles.userMap}>
        {/*==== User ====*/}
        <div className={Styles.userDiv}>
          <img src="/img/profile.png"></img>
          <h1>{board.User?.NickName}</h1>
        </div>

        {/*==== Map ====*/}
        <div className={Styles.mapDiv}>
          <div className={Styles.map} id="myMap"></div>
          <p>{board.Location}</p>
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
        <p>{board.Content}</p>
        <p>{board.Star}</p>
        <p>{board.updatedAt}</p>
      </div>

      {/*==== Comm ====*/}
      <div className={Styles.commentDiv}>

        {/* 댓글추가 */}
        <form onSubmit={commentAdd}>
          <div className={Styles.newCommDiv}>
            <span>{board.User?.NickName}</span>
            <input type="text" name="userComment"></input>
            <input type="submit" value="추가"></input>
          </div>
        </form>

        <div className={Styles.commSetDiv} onClick={() => setCommView(!commView)}>
          <p>{commView ? "댓글접기▲" : "댓글보기▼"}</p>
        </div>

        {(comments.length > 0 && commView) ? (
          comments.map((comment, idx) => {
            return (
              <div className={Styles.commDiv} key={idx}>
                <p>{comment.User.NickName}</p>
                {(commtEditID === comment.CID) ? (
                  <input type="text"
                    value={commtEditText}
                    onChange={(e) => setCommtEditText(e.target.value)}
                    autoComplete="off" //form 자동완성 OFF
                  />
                ):(
                  <p>{comment.comm}</p>
                )}
                
                <p>{(comment.updatedAt === comment.createdAt)? comment.createdAt : comment.updatedAt + "(수정됨)"}</p>

                {comment.UID === userID &&
                  <div className={Styles.commtEditDiv}>
                    <input type="text" value={comment.CID} readOnly hidden></input>
                    {(commtEditID === comment.CID) ? (
                      <input type="button" value="저장" onClick={() => commtEditFnc(comment.CID)}></input>  
                    ):(
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

      </div>
    </div>
  );
}

export default BoardDetail;