import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from './Header/Header';
import Main from './routes/Main';

import Board from "./boardTest";


function App() {
  return (
    <>
    <BrowserRouter>    
      <Header />
      <Routes>
        {/*메인페이지*/}
        <Route path="/" element={<Main />}></Route>
        
        {/* <Route path="/bbb" element={<Main/>}></Route> */}
        <Route path="/board/write" element={<Board/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
