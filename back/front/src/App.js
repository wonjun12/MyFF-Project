import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from './Header/Header';
import Main from './routes/Main';

import BoardWrite from "./routes/BoardWrite";
import BoardDetail from "./routes/BoardDetail";

function App() {

  return (
    <>
    {/* <UserContext.Provider value={{user, setUser}}> */}
      <BrowserRouter>
        <Header />
        <Routes>
          {/*메인페이지*/}
          <Route path="/" element={<Main />}></Route>
          
          {/*글쓰기*/}
          <Route path="/board/write" element={<BoardWrite/>}></Route>

          {/*글상세*/}
          <Route path="/board/:id" element={<BoardDetail/>}></Route>
        </Routes>
      </BrowserRouter>
    {/* </UserContext.Provider> */}
    </>
  );
}

export default App;
