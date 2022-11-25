import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Styles from "./BoardWrite.module.scss";
import { FaStar } from "react-icons/fa";
import { Buffer } from "buffer";

const SERVER_URL = "/api/board/";

//별점 스타일
const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};
const starStyle = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "left",
  },
};

const BoardEdit = () => {
  axios.defaults.withCredentials = true;

  const { id } = useParams();
  const [board, setBoard] = useState("");
  const [pictures, setPictures] = useState([]);

  const inputRef = useRef(null); //input file
  const [imageFiles, setImageFiles] = useState([]); //전송할 이미지 파일
  const [images, setImages] = useState([]);
  //미리보기 이미지

  const [hashtag, setHashtag] = useState([]);

  const dataFetch = () => {
    axios.get(SERVER_URL + id + "/edit").then((res) => {

      setBoard(res.data.Board);
      setPictures(res.data.Board.Pictures);
      setHashtag(res.data.Board.Hashtags);
      setCurrentValue(res.data.Board.Star);
    });
  };
  console.log(hashtag, "해시태그");
  console.log(pictures, "이미지");
  const boardEditSubmit = (e) => {
    e.preventDefault();

    //imageFile 이 있는 경우만 게시물 작성 가능
    if (imageFiles) {
      const { locationName, contentName } = e.target;
      const data = {
        writeAddrName: locationName.value,
        writeCommName: contentName.value,
        writeStarName: currentValue,
      };
      const config = {
        Headers: {
          "content-type": "multipart/form-data",
        },
      };

      const formData = new FormData();

      for (let i = 0; i < imageFiles.length; i++) {
        //console.log(imgFile[i]);
        formData.append("file", imageFiles[i]);
      }
      formData.append("bodys", JSON.stringify(data));

      axios.post(SERVER_URL + id + "/edit", formData, config).then((res) => {
        // console.log(res.data);
        const { result } = res.data;
        if (result === "ok") {
          window.location.href = "/";
        } else if (result === "error") {
          alert("로그인 하고 하셈");
          window.location.href = "/";
        }
      });
    } else {
      alert("이미지를 업로드 해주세요");
    }
  };

  // input 으로 파일을 선택하면 image State에 담는다
  const saveImage = (e) => {
    e.preventDefault();

    const { files } = e.target;
    const validImageFiles = [];
    if (files.length > 1) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        validImageFiles.push(file);
      }

      if (validImageFiles.length) {
        setImageFiles(validImageFiles);
      }
    } else if (files.length === 1) {
      setImageFiles((prev) => [...prev, ...[files[0]]]);
    }
  };
  // 이미지 개별 삭제
  const imgDelete = (idx) => {
    console.log(idx);
    setImageFiles(imageFiles.filter((_, fileIdx) => fileIdx !== idx));
  };

  // 이미지 전체 삭제
  const deleteAll = () => {
    console.log("dsdd");
    setImageFiles([]);
  };

  // 이미지 state 초기화 및 파일 추가 시 실행
  useEffect(() => {
    dataFetch();
    const images = [],
      fileReaders = [];

    let isCancel = false;
    if (imageFiles.length) {
      imageFiles.forEach((file) => {
        console.log(file);
        const fileReader = new FileReader();
        fileReaders.push(fileReader);
        fileReader.onload = (e) => {
          const { result } = e.target;
          if (result) {
            images.push(result);
          }
          if (images.length === imageFiles.length && !isCancel) {
            setImages(images);
          }
        };
        //console.log(file);
        fileReader.readAsDataURL(file);
        // fileReader.readAsArrayBuffer(blobImg);
      });
    } else {
      setImages([]);
    }

    return () => {
      isCancel = true;
      fileReaders.forEach((fileReader) => {
        if (fileReader.readyState === 1) {
          fileReader.abort();
        }
      });
    };
  }, [imageFiles]);

  //별점
  const stars = Array(5).fill(0);
  const [currentValue, setCurrentValue] = React.useState(0);
  const [hoverValue, setHoverValue] = React.useState(undefined);

  const handleClick = (value) => {
    setCurrentValue(value);
  };
  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };
  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  const [value, setValue] = useState("");

  const change = (e) => {
    setValue(e.target.value);
  };

  //태그
  const [tagItem, setTagItem] = useState("");
  const [tagList, setTagList] = useState([]);

  const onKeyPress = (e) => {
    if (e.target.value.length !== 0 && e.key === "Enter") {
      submitTagItem();
      e.preventDefault();
    }
  };

  const submitTagItem = () => {
    tagList.push(tagItem);
    setTagList([...tagList]);
    setTagItem("");
  };

  const deleteTagItem = (idx) => {
    setTagList(tagList.filter((_, tagIdx) => tagIdx !== idx));
  };

  return (
    <form onSubmit={boardEditSubmit}>
      <div style={{ paddingTop: "130px" }}>
        <input type="checkbox" id="writeMapId" />
        <label htmlFor="writeMapId"> 지도 </label>
        <div>
          <input
            type="text"
            placeholder="위치 검색"
            name="locationName"
            className={Styles.searchInput}
          />
          <input
            type="button"
            value="영수증으로 위치 검색"
            className={Styles.searchInput}
          />
          <div>지도 들어감</div>
        </div>

        {/*====================Image View=======================*/}
        <input type="checkbox" id="writeImgId" />
        <label htmlFor="writeImgId">사진</label>
        <div>
          {pictures.length > 0 ? (
            <div className={Styles.imgDiv}>
              {pictures.map((image, idx) => {
                const img = Buffer.from(image.Photo.data).toString("base64");
                return (
                  <span key={idx} className={Styles.imgSpan}>
                    {/* <p onClick={() => prevImgDelete(idx, image)}>X</p> */}
                    <img
                      className={Styles.imgView}
                      src={`data:image;base64,${img}`}
                      alt=""
                    />
                  </span>
                );
              })}
            </div>
          ) : null}

          {images.length > 0 ? (
            <div className={Styles.imgDiv}>
              {images.map((image, idx) => {
                //console.log(image);
                return (
                  <span key={idx} className={Styles.imgSpan}>
                    <p onClick={() => imgDelete(idx, image)}>X</p>
                    <img className={Styles.imgView} src={image} alt="" />
                  </span>
                );
              })}
            </div>
          ) : null}
          <input
            type="file"
            accept="image/*"
            multiple="multiple"
            onChange={saveImage}
            onClick={(e) => (e.target.value = null)}
            ref={inputRef}
            style={{ display: "none" }}
          />
          <button type="button" onClick={() => inputRef.current.click()}>
            Preview
          </button>
          <button type="button" onClick={deleteAll}>
            Delete
          </button>
        </div>

        {/*========================================================*/}
        <input type="checkbox" id="writeCommId" />
        <label htmlFor="writeCommId">글쓰기</label>
        <div>
          <div>
            <textarea
              name="contentName"
              placeholder="내용 입력"
              defaultValue={board.Content}
              className={Styles.content}
            ></textarea>
          </div>
          <div style={starStyle.container}>
            <span style={starStyle.stars}>
              별점:
              {stars.map((_, index) => {
                return (
                  <FaStar
                    key={index}
                    size={24}
                    name="reviewStar"
                    style={{
                      marginRight: 2,
                      cursor: "pointer",
                    }}
                    color={
                      (hoverValue || currentValue) > index
                        ? colors.orange
                        : colors.grey
                    }
                    onClick={() => handleClick(index + 1)}
                    onMouseOver={() => handleMouseOver(index + 1)}
                    onMouseLeave={handleMouseLeave}
                  />
                );
              })}
            </span>
          </div>
          <div>
            {tagList.map((tagItem, idx) => {
              return (
                <span key={idx}>
                  <span>{tagItem}</span>
                  <button
                    type="button"
                    onClick={() => deleteTagItem(idx, tagItem)}
                    className={Styles.deleteTagBtn}
                  >
                    X
                  </button>
                </span>
              );
            })}
            <input
              type="text"
              placeholder="엔터 누르면 태그 추가"
              tabIndex={2}
              value={tagItem}
              onChange={(e) => setTagItem(e.target.value)}
              onKeyPress={onKeyPress}
            />
          </div>
        </div>

        <input type="submit" value="전송"></input>
      </div>
    </form>
  );
};
export default BoardEdit;
