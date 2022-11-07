import React, { useState } from "react";
import Styles from "./Header.module.scss";
import Login from "./Login";

import {Link} from "react-router-dom";

function Header() {

  const [loginModalOpen, setLoginModalOpen] = useState(false);

  const openLoginModal = () => {
    
    setLoginModalOpen(true);

    
    document.getElementById("myMap")?.setAttribute("hidden", "hidden");
  }
  const closeLoginModal = () => {
    setLoginModalOpen(false);

    document.getElementById("myMap")?.removeAttribute("hidden");
  }
  
  
  return (
    <div className={Styles.Header}>
      <div className={Styles.logoDiv}>
        <h1 className={Styles.logoText}>MYFF</h1>
      </div>
      <div className={Styles.mainNav}>
        <div className={Styles.searchDiv}>
          <form className={Styles.searchForm}>
            <select>
              <option>USER</option>
            </select>
            <input type="text"></input>
            <input className={Styles.searchBtn} type="submit" value="검색"></input>
          </form>
        </div>
        <div className={Styles.btnDiv}>
          <a href="/best">
            <h3>Best</h3>
          </a>
          {/* <a href="/new">
            <h3>New</h3>
          </a> */}
          <Link to="/board/write">
            글쓰기
          </Link>
          
          <a>
            <h3 id="inHearderLoginText" onClick={openLoginModal}>Login</h3>
            {loginModalOpen && <Login close={closeLoginModal}></Login>}
          </a>

        </div>
      </div>
    </div>
  );
}


export default Header;
