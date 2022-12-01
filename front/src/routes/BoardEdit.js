import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import Styles from "./BoardWrite.module.scss";
import { FaStar } from "react-icons/fa";
import { Buffer } from "buffer";
import { SetMap } from "../kakao/kakaoAPI";
import SearchBoard from "../kakao/kakaoSearchBoard";
import CreateMaker from "../kakao/kakaoCreateMarker";
import Swal from "sweetalert2";

const SERVER_URL = "/api/board/";

//별점 스타일
const colors = {
  orange: "#FFBA5A",
  grey: "#a9a9a9",
};

const config = {
  Headers: {
    "content-type": "multipart/form-data",
  },
};

const BoardEdit = () => {
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const { id } = useParams();
  const [content, setContent] = useState("");
  const [pictures, setPictures] = useState([]);

  const inputRef = useRef(null); //input file
  const [imageFiles, setImageFiles] = useState([]); //전송할 이미지 파일
  const [images, setImages] = useState([]);
  //미리보기 이미지

  const [hashtag, setHashtag] = useState([]);

  //주소 useState
  const [locationValue, setLocationValue] = useState("");
  const [location, setLocation] = useState({ name: "", addr: "" });


  //수정 게시물 정보 가져오기
  const dataFetch = () => {
    axios.get(SERVER_URL + id + "/edit").then((res) => {
      setContent(res.data.Board.Content);
      setPictures(res.data.Board.Pictures);
      setHashtag(res.data.Board.Hashtags);
      setCurrentValue(res.data.Board.Star);
      setLocationValue(res.data.Board.Location);
      setLocation({
        name: res.data.Board.PlaceName,
        addr: res.data.Board.Location,
      });
    });
  };

  //게시물 수정 submit
  const boardEditSubmit = (e) => {
    e.preventDefault();

    //imageFile 이 있는 경우만 게시물 작성 가능
    if (
      (!!imageFiles.length || !!pictures.length) &&
      !!location.name &&
      !!location.addr &&
      !!currentValue
    ) {

      //기존 이미지 PID 추출
      let photos = [];
      if (!!pictures) {
        pictures.forEach(({ PID }) => {
          photos.push(PID);
        });
      }

      
      //기존 해시태그 id 추출
      let hashtags = [];
      if (!!hashtag) {
        hashtag.forEach(({ id }) => {
          hashtags.push(id);
        });
      }
      const { contentName } = e.target;
      const data = {
        writeAddrName: location.addr,
        writePlaceName: location.name,
        writeCommName: contentName.value,
        writeStarName: currentValue,
        writeHashtag: tagList,
        photos,
        hashtags,
      };

      const formData = new FormData();

      for (let i = 0; i < imageFiles.length; i++) {
        //console.log(imgFile[i]);
        formData.append("file", imageFiles[i]);
      }
      formData.append("bodys", JSON.stringify(data));

      axios.post(SERVER_URL + id + "/edit", formData, config).then((res) => {
        const { result } = res.data;
        if (result === "ok") {
          Swal.fire({
            position: 'top-end',
            icon: 'success',
            title: '게시물 수정 완료',
            showConfirmButton: false,
            timer: 1200
          })
          navigate('/')
        } else if (result === "error") {

          navigate('/')
        }
      });
    } else if (!location.name) {
      Swal.fire({
        icon: 'error',
        title: '주소 오류',
        text: '주소를 선택해 주세요.',
      })
    } else if (!currentValue) {
      Swal.fire({
        icon: 'error',
        title: '별점 오류',
        text: '별점을 넣어주세요',
      })
    } else {
      Swal.fire({
        icon: 'error',
        title: '이미지 오류',
        text: '이미지는 1개이상 넣어주세요.',
      })
    }
  }

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
  const prevImgDelete = (idx) => {
    setPictures(pictures.filter((_, fileIdx) => fileIdx !== idx));
  };

  // 이미지 개별 삭제
  const imgDelete = (idx) => {
    setImageFiles(imageFiles.filter((_, fileIdx) => fileIdx !== idx));
  };

  // 이미지 전체 삭제
  const deleteAll = () => {
    setImageFiles([]);
    setPictures([]);
  };

  useEffect(() => {
    dataFetch();
  }, []);

  // 이미지 state 초기화 및 파일 추가 시 실행
  useEffect(() => {
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
    } else if (e.target.value.length === 0 && e.key === "Enter") {
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
  const deletePrevTag = (idx) => {
    setHashtag(hashtag.filter((_, tagIdx) => tagIdx !== idx));
  };

  //주소 입력

  const locationSearch = (v) => {
    const { value } = v.target;
    setLocationValue(value);
  };

  useEffect(() => {
    CreateMaker(locationValue);
  }, [locationValue]);

  //글 내용 변경
  const onChange = (e) => {
    setContent(e.target.value);
  };
  return (
    <form onSubmit={boardEditSubmit}>
      <div>
        <input type="radio" name="accordion" defaultChecked id="writeMapId" />
        <label htmlFor="writeMapId"> 지도 </label>
        <div className={Styles.mapContainer}>
          <input
            type="text"
            onChange={locationSearch}
            value={locationValue}
            placeholder="위치 검색"
            name="locationValue"
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
              <SetMap />
            </div>
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
          </div>
        </div>

        {/*====================Image View=======================*/}
        <input type="radio" name="accordion" id="writeImgId" />
        <label htmlFor="writeImgId">사진</label>
        <div>
          {/* 사진 없을 때 사진 추가 안내 화면 */}
          {pictures.length === 0 && images.length === 0 ? (
            <div className={Styles.noImg}>
              <div>사진을 추가해 주세요</div>
            </div>
          ) : null}
          {/* 저장된 사진 */}
          <div className={Styles.imgDiv}>
            {pictures.map((image, idx) => {
              const img = Buffer.from(image.Photo.data).toString("base64");
              return (
                <span key={idx} className={Styles.imgSpan}>
                  <p onClick={() => prevImgDelete(idx, image)}>X</p>
                  <img
                    className={Styles.imgView}
                    src={`data:image;base64,${img}`}
                    alt=""
                  />
                </span>
              );
            })}
            {/* 새로 추가한 사진 */}
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
          </div>
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
            <textarea
              name="contentName"
              placeholder="내용 입력"
              value={content}
              onChange={onChange}
            ></textarea>
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
                {/* {hashtag.length > 0 ? (
                  <span> */}
                {hashtag.map((tagItem, idx) => {
                  return (
                    <span className={Styles.tagName} key={idx}>
                      {tagItem.title}
                      <button
                        type="button"
                        onClick={() => deletePrevTag(idx, tagItem)}
                        className={Styles.deleteTagBtn}
                      >
                        X
                      </button>
                    </span>
                  );
                })}
                {/* </span>
                ) : null} */}

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
              {tagList.length + hashtag.length < 10 ? (
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
              <Link to={`/board/${id}`}>
                <button type="button"> 취소 </button>
              </Link>
              <button type="submit">전송</button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};
export default BoardEdit;
