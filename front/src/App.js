import {BrowserRouter, Routes, Route} from "react-router-dom";
import Header from './Header/Header';
import Main from './routes/Main';

function App() {
  return (
    <>
    <BrowserRouter>    
      <Header />
      <Routes>
        {/*메인페이지*/}
        <Route path="/" element={<Main />}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
