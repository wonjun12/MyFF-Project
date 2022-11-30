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

  const [mapView, setMapView] = useState(false);
  const [newBoard, setNewBoard] = useState(false);

  //socket 연결
  useEffect(() => {
    const MyUID = parseInt(window.sessionStorage.getItem('loginUID'))
    socketConnect(MyUID);
    socket.on('boardCreate', (UID) => {
      if(UID.includes(MyUID)){
        setNewBoard(true);
        console.log('팔로워의 새로운 글이 생겼다!');
      }
    });
  }, [])

  return (
    <BrowserRouter>
    {(newBoard)? <NewBoards setNewBoard={setNewBoard} /> : null}
      <Header mapView={setMapView}/>
      {/* 헤더 빈공간 추가 */}
      <div style={{height: '125px'}}></div>
      <Routes>
        {/*메인페이지 => 내게시글, 팔로워게시글*/}
        <Route path="/" element={<Main mapView={setMapView} />}></Route>
        
        <Route path="/best" element={<Best />}></Route>
        <Route path="/bestuser" element={<BestUser />}></Route>

        <Route path="/tag/:name" element={<Best isTag={true}/>}></Route>

        {/*글쓰기*/}
        <Route path="/board/write" element={<BoardWrite />}></Route>
        {/* 글 수정 */}
        
        <Route path="/board/:id/edit" element={<BoardEdit />}></Route>

        {/*글상세*/}
        <Route path="/board/:id" element={<BoardDetail />}></Route>

        {/* 유저 정보 */}
        <Route path="/user/:id" element={<UserDetail/>}></Route>

        <Route path="/reset/password" element={<Password/>}></Route>
      </Routes>
      {(mapView)? <MapViewDetails mapView={setMapView} /> : null}
    </BrowserRouter>
  );
}

export default App;
