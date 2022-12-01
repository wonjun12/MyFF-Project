import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from './Header/Header';
import Main from './routes/Main';

import Best from './routes/Best';
import BestUser from './routes/BestUser';
import Password from './routes/Password';

import BoardWrite from "./routes/BoardWrite";
import BoardEdit from "./routes/BoardEdit";
import BoardDetail from "./routes/BoardDetail";
import UserDetail from "./routes/UserDetail";
import { useEffect, useState } from "react";

import MapViewDetails from "./mapDetails/MapViewDetails";
import { socketConnect, socket } from "./socket/socket";
import NewBoards from "./socket/NewBoard";


function App() {

  //지도 상세보기 사용 여부확인
  const [mapView, setMapView] = useState(false);
  const [newBoard, setNewBoard] = useState(false);

  //socket 연결
  useEffect(() => {
    const MyUID = parseInt(window.sessionStorage.getItem('loginUID'))
    //MyUID를 가지고 와서 socket연결 시도
    socketConnect(MyUID);
    socket.on('boardCreate', (UID) => {
      //on => socket을 받는다.
      // 연결 후에 받는 소켓들 중 UID 판변해서 자기자신인지 확인한다.
      if(UID.includes(MyUID)){
        //상단에 팔로워 게시물작성 알림 생김
        setNewBoard(true);
      }
    });
  }, [])

  return (
    <BrowserRouter>
    {/* 팔로워 게시물 알림*/}
    {(newBoard)? <NewBoards setNewBoard={setNewBoard} /> : null}
    {/* 헤더 */}
      <Header mapView={setMapView}/>
      {/* 헤더 빈공간 추가 */}
      <div style={{height: '125px'}}></div>
      <Routes>
        {/*메인페이지 => 내게시글, 팔로워게시글*/}
        <Route path="/" element={<Main mapView={setMapView} />}></Route>
        
        {/* 베스트 게시물 */}
        <Route path="/best" element={<Best />}></Route>
        {/* 베스트 유저 */}
        <Route path="/bestuser" element={<BestUser />}></Route>

        {/* 태그 검색 */}
        <Route path="/tag/:name" element={<Best isTag={true}/>}></Route>

        {/*글쓰기*/}
        <Route path="/board/write" element={<BoardWrite />}></Route>
        {/* 글 수정 */}
        
        <Route path="/board/:id/edit" element={<BoardEdit />}></Route>

        {/*글 상세*/}
        <Route path="/board/:id" element={<BoardDetail />}></Route>

        {/* 유저 정보 */}
        <Route path="/user/:id" element={<UserDetail/>}></Route>

        {/* 패스워드 찾기 */}
        <Route path="/reset/password" element={<Password/>}></Route>
      </Routes>
      {/* 지도 상세보기 */}
      {(mapView)? <MapViewDetails mapView={setMapView} /> : null}
    </BrowserRouter>
  );
}

export default App;
