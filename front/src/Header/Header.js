import React, { useRef, useState } from "react";
import Styles from "./Header.module.scss";
import Login from "./Login";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";
import HeaderSearch from "./HeaderSearch";


const SERVER_URL = "/api/user";

function Header({mapView}) {

  const loginCk = async () => {
    const {data} = await axios.get(`/api/home/login`);


    if(data.result === 'ok'){
      sessionStorage.setItem('loginUserId', data.NickName);
      sessionStorage.setItem('loginUID', data.UID);
    }else{
      sessionStorage.removeItem('loginUID');
      sessionStorage.removeItem('loginUserId');
    }
      
    setSessionId(sessionStorage.getItem('loginUserId'));
    setSessionUId(sessionStorage.getItem('loginUID'))
  };

  
  const headerDiv = useRef();
  const location = useLocation();

  //가로 스크롤 => 헤더이동
  const windowScroll = () => {
    if (window.scrollX > 0 && headerDiv.current) {
      headerDiv.current.style.marginLeft = `${0 - window.scrollX}px`;
    } else if (window.scrollX === 0 && headerDiv.current) {
      headerDiv.current.style.margin = '0 auto';
    }
  }

  //스크롤 이벤트 적용
  useEffect(() => {
    loginCk();
    window.addEventListener("scroll", windowScroll);
  }, []);

  //지도 상세 보기
  const mapViewDetails = () => {
    mapView(true);
  }

  const [sessionId, setSessionId] = useState('');
  const [sessionUId, setSessionUId] = useState('');
  //세션저장소에 담은 로그인한 이메일or닉네임


  function logoutFnc(e) {
    e.preventDefault();
    const loginUID = sessionStorage.getItem('loginUID');
    axios.post(`${SERVER_URL}/${loginUID}/logout`)
      .then(res => {
        const { result } = res.data;

        if (result === 'ok') {
          sessionStorage.removeItem('loginUserId');
          sessionStorage.removeItem('loginUID');
        }
        window.location.href = '/';

      });
  }

  const [loginModalOpen, setLoginModalOpen] = useState(false); //로그인모달 스위치

  const openLoginModal = () => {
    setLoginModalOpen(true);
    document.body.style.overflow = "hidden";
  }
  const closeLoginModal = () => {
    setLoginModalOpen(false);
    document.body.style.overflow = "unset";
  }
  
  const userCkFnc = (e) => {
    const userID = sessionStorage.getItem("loginUID");
    if(userID === null || userID === 'undefined' || userID === ""){
      setLoginModalOpen(true);
      e.preventDefault();
    }
  }

  //메인 화면 검색 기능 스위치
  const [searchValue, setSearchValue] = useState(null);
  const [searchSelect, setSearchSelect] = useState('');

  const search = async (e) => {
    e.preventDefault();
    const {selectName, search} = e.target;
    const body = {
      value : search.value,
      select : selectName.value
    }

    if(body.value.length > 0 && body.select !== '2'){
      const res = await axios.post('/api/home/search', body);

      if(res.data.result === 'ok'){
        setSearchSelect(body.select);
        if(body.select === '0'){
          setSearchValue(res.data.user);
        }else if(body.select === '1'){
          setSearchValue(res.data.board);
        }
      }
    }else{
        window.location.href = `/tag/${body.value}`
    }
  }

  return (
    <div className={Styles.headerWrap}>
      <div className={Styles.Header} ref={headerDiv}>

        <div className={Styles.logoDiv}>
          <Link to="/"><h1 className={Styles.logoText}>MYFF</h1></Link>
        </div>
        <div className={Styles.mainNav}>
          <div className={Styles.searchDiv}>
            <form onSubmit={search} className={Styles.searchForm}>
            <select name='selectName'>
                <option value='0'>이름</option>
                <option value='1'>장소</option>
                <option value='2'>태그</option>
              </select>
              <input name="search" type="text"></input>
              <input className={Styles.searchBtn} type="submit" value="검색"></input>
            </form>
          </div>
          <div className={Styles.btnDiv}>
            {/* 헤더 메뉴 수정 */}
            <ol>
              <Link to='/best'><li>BEST<img src={`${process.env.PUBLIC_URL}/img/like.png`}></img></li></Link>
              <Link to='/bestuser'><li>BEST<img src={`${process.env.PUBLIC_URL}/img/profile.png`}></img></li></Link>
              <li onClick={mapViewDetails}>MAP<img src={`${process.env.PUBLIC_URL}/img/maker.png`}></img></li>
              <Link to={`/user/${sessionUId}`} onClick={userCkFnc}>
                <li style={{cursor:'pointer'}}>MYPAGE<img src={`${process.env.PUBLIC_URL}/img/profile.png`}></img></li>
              </Link>
              <Link to='/board/write' onClick={userCkFnc}><li>글쓰기<img src={`${process.env.PUBLIC_URL}/img/write.png`}></img></li></Link>
              
            </ol>
            {(sessionId !== null && sessionId !== 'undefined' && sessionId !== '') ?
              (
                  <div className={Styles.userDiv}>
                    <Link to={`/user/${sessionUId}`}><p>{sessionId}</p></Link>
                    <span onClick={logoutFnc}>Logout</span>
                  </div> 
              ) : (
                <div className={Styles.userDiv}>
                  <span onClick={openLoginModal}>Login</span>
                </div>
            )}
            {/* 로그인 모달 */}
            {loginModalOpen && <Login close={closeLoginModal}></Login>}
          </div>
        </div>
      </div>
      {/* 검색 기능 */}
      {(!!searchValue)? <HeaderSearch select={searchSelect} searchValue={searchValue} setSearchValue={setSearchValue} /> : null }
    </div>
  );
}


export default Header;
