import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import Styles from "./BoardWrite.module.scss";
import { FaStar } from "react-icons/fa";
import { SetMap } from "../kakao/kakaoAPI";
import SearchBoard from "../kakao/kakaoSearchBoard";
import CreateMaker from "../kakao/kakaoCreateMarker";
import { socket } from "../socket/socket";
import { Link, useNavigate } from "react-router-dom";
import Swal from 'sweetalert2'
import imageCompression from 'browser-image-compression';

const SERVER_URL = "/api/board";

//별점 스타일(별 색)
const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};

const config = {
  Headers: {
    "content-type": "multipart/form-data",
  },
};

const BoardWrite = async () => {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  //이미지 뷰 ref, state
  const inputRef = useRef(null); //file
  const [imageFiles, setImageFiles] = useState([]); //전송할 이미지 파일
  const [images, setImages] = useState([]); //미리보기 이미지


  /////////////////추가
  //게시물 작성 POST
  const boardSubmit = async (e) => {
    e.preventDefault();

    //유효성 검사
    if (
      !!imageFiles.length &&
      !!location.name &&
      !!location.addr &&
      !!currentValue
    ) {
      const { contentName } = e.target;
      const data = {
        writeAddrName: location.addr,
        writePlaceName: location.name,
        writeCommName: contentName.value,
        writeStarName: currentValue,
        writeHashtag: tagList,
      };

      const formData = new FormData();


      //파일과 body가 같이 갈수 없으므로, JSON의 형태로 변환해서 보낸다.
      for (let i = 0; i < imageFiles.length; i++) {
        const file = await imageCompression(imageFiles[i], {maxWidthOrHeight: 665});
        formData.append("file", file);
      }

      formData.append("bodys", JSON.stringify(data));

      axios.post(`${SERVER_URL}/write`, formData, config).then((res) => {
        const { result } = res.data;

        if (result === "ok") {
          socket.emit("boardCreate");
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '게시물 작성 완료',
            showConfirmButton: false,
            timer: 1200
          })
          navigate('/')
        } else if (result === "error") {
          Swal.fire({
            icon: 'error',
            title: '오류',
            text: '너무 많은 글을 작성하셧습니다',
          })
          navigate('/')
        }
      });
    } else if (!location.name) {
      Swal.fire({
        icon: 'error',
        title: '주소 오류',
        text: '주소를 선택해 주세요.',
      })
    } else if (!imageFiles.length) {
      Swal.fire({
        icon: 'error',
        title: '이미지 오류',
        text: '이미지는 1개이상 넣어주세요.',
      })
    } else if (!currentValue) {
      Swal.fire({
        icon: 'error',
        title: '별점 오류',
        text: '별점을 넣어주세요',
      })
    }
  };

  //img 주소 추출
  const imgLocation = async (e) => {
    const { files } = e.target;

    const formData = new FormData();

    formData.append("imgFile", files[0]);

    const {data} = await axios.post("/api/home/getLetter", formData, config);

    if(data.result){
      setLocationValue(data.imgText);
    }else{
      Swal.fire({
        icon: 'error',
        title: '오류',
        text: '주소를 찾을 수 없습니다.',
      })
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
    setImageFiles([]);
  };
  //별점
  const stars = Array(5).fill(0);
  const [currentValue, setCurrentValue] = React.useState(0);
  const [hoverValue, setHoverValue] = React.useState(undefined);

  //클릭 시 별 값 고정
  const handleClick = (value) => {
    setCurrentValue(value);
  };
  //마우스 오버시 별 색깔 변환
  const handleMouseOver = (newHoverValue) => {
    setHoverValue(newHoverValue);
  };
  //마우스 땟을때 별 색깔 변환
  const handleMouseLeave = () => {
    setHoverValue(undefined);
  };

  //태그
  const [tagItem, setTagItem] = useState(""); // 태그 입력 란
  const [tagList, setTagList] = useState([]); // 태그 저장


  //태그 엔터 시 태그 저장
  const onKeyPress = (e) => {
    if (e.target.value.length !== 0 && e.key === "Enter") {
      //10자 이내에 작성 가능
      if(e.target.value.length < 10){
        submitTagItem();
      }else{
        Swal.fire({
          icon: 'error',
          title: '오류',
          text: '태그는 10자 이내로 작성해주세요',
        })
      }
      
      e.preventDefault();
      //태그내용없을시 엔터누르면 게시물작성 막기
    } else if (e.target.value.length === 0 && e.key === "Enter") {
      e.preventDefault();
    }
  };


  //태그 저장
  const submitTagItem = () => {
    tagList.push(tagItem);
    setTagList([...tagList]);
    setTagItem("");
  };

  //태그 삭제
  const deleteTagItem = (idx) => {
    setTagList(tagList.filter((_, tagIdx) => tagIdx !== idx));
  };

  // 이미지 state 초기화 및 파일 추가 시 실행
  useEffect(() => {
    const images = [],
      fileReaders = [];
    let isCancel = false;
    //이미지가 들어갔을때 보여주는 변수에 저장
    if (imageFiles.length) {
      imageFiles.forEach((file) => {
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

  //주소 입력 란
  const [locationValue, setLocationValue] = useState("");
  //주소 저장
  const [location, setLocation] = useState({ name: "", addr: "" });


  //주소 입력 함수
  const locationSearch = (v) => {
    const { value } = v.target;
    setLocationValue(value);
  };

  //주소 입력 란 변경시 마커 생성
  useEffect(() => {
    CreateMaker(locationValue);
  }, [locationValue]);

  return (
    <div className={Styles.container}>
    <form onSubmit={boardSubmit}>
      <div>
        <input type="radio" name="accordion" defaultChecked id="writeMapId" />
        <label htmlFor="writeMapId">지도</label>
        <div className={Styles.mapContainer}>
          <input
            type="text"
            onChange={locationSearch}
            value={locationValue}
            placeholder="위치 검색"
            className={Styles.searchInput}
            onKeyPress={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
              }
            }}
          />
          <label htmlFor="fileBtn" className={Styles.fileLabel}>
            영수증으로 주소찾기
          </label>
          <input
            id="fileBtn"
            type="file"
            accept="image/*"
            onChange={imgLocation}
            className={Styles.imgInput}
          />

          <div>
            <ul id="locationSearch" hidden></ul>
            <div className={Styles.mapDiv}>
              <SearchBoard
                addr={locationValue}
                setAddr={setLocationValue}
                setName={setLocation}
              />
              <SetMap Draggable={true} />
            </div>
            {location.name ? (
              <div className={Styles.locationInfo}>
                <div>
                  <p>이름:</p>
                  <p>주소:</p>
                </div>
                <div>
                  <p>{location.name}</p>
                  <p>{location.addr}</p>
                </div>
              </div>
            ) : null}
          </div>
        </div>

        {/*====================Image View=======================*/}
        <input type="radio" name="accordion" id="writeImgId" />
        <label htmlFor="writeImgId">사진</label>
        <div>
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
          ) : (
            <div className={Styles.noImg}>
              <div>사진을 추가해 주세요</div>
            </div>
          )}
          <input
            type="file"
            accept="image/*"
            multiple="multiple"
            onChange={saveImage}
            onClick={(e) => (e.target.value = null)}
            ref={inputRef}
            style={{ display: "none" }}
          />
          <div className={Styles.pictureDiv}>
            <button type="button" onClick={() => inputRef.current.click()}>
              사진 추가
            </button>
            <button type="button" onClick={deleteAll}>
              전체 삭제
            </button>
          </div>
        </div>
        {/*========================================================*/}
        <input type="radio" name="accordion" id="writeCommId" />
        <label htmlFor="writeCommId">글쓰기</label>
        <div className={Styles.contentDiv}>
          <div className={Styles.content}>
            <textarea name="contentName" placeholder="내용 입력"></textarea>
          </div>

          <div className={Styles.rate}>
            <span className={Styles.star}>
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
          <div className={Styles.tagMain}>
            <div className={Styles.tagDiv}>
              <div>
                {tagList.map((tagItem, idx) => {
                  return (
                    <span className={Styles.tagName} key={idx}>
                      {tagItem}
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
              </div>
              {tagList.length < 10 ? (
                <input
                  type="text"
                  placeholder="엔터 누르면 태그 추가"
                  tabIndex={2}
                  value={tagItem}
                  onChange={(e) => setTagItem(e.target.value)}
                  onKeyPress={onKeyPress}
                />
              ) : (
                <div className={Styles.banInput}>
                  <img
                    alt=""
                    src="/img/error.png"
                  />
                  <p>더 이상 태그를 추가할 수 없습니다!!</p>
                </div>
              )}
            </div>
            <div className={Styles.buttons}>
              <Link to="/">
                <button type="button"> 취소 </button>{" "}
              </Link>
              <button type="submit">전송</button>
            </div>
          </div>
        </div>
      </div>
    </form>
    </div>
  );
};

export default BoardWrite;
