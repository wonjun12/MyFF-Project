import axios from "axios";
import React, { useEffect, useState } from "react";
import Styles from "./Main.module.scss";
import useIntersect from "../hooks/useIntersect";
import {kakaoMap, boardMapSearch, mainMapSearch} from "./kakaoMap";
axios.defaults.withCredentials = true;


function Main() {

  console.log('렌더링');

  const SERVER_URL = "http://localhost:4000/";
  const [users, setUsers] = useState(null);

  //useIntersect
  const [state, setState] = useState({ itemCount: 0, isLoading: false });
  //const [loading, setLoading] = useState(false);
  const [img, setImg] = useState();

  // const fatchData = async () => {
  //   setState(prev => ({ ...prev, isLoading: true }));

  //   await axios.get(SERVER_URL)
  //     .then((res) => {
  //       setUsers(res.data);
  //     });
  // };

  useEffect(() => {
    // fatchData();
    kakaoMap(6);
    
    axios.get(SERVER_URL).then(res => {
      const {Board, Photo, User} = res.data;

      setUsers(Board);
      setImg(Photo)
      
      for(let i in Board){
        mainMapSearch(Board[i], Photo[i]);
      }

    })
  }, []);
  console.log(users);
  return (
    <div className={Styles.container}>
      <div id="myMap" className={Styles.mapDiv} >
      </div>
      <div className={Styles.boardContainer}>

        {/* {users?.map((user, index) => index < itemCount ? ( */}
        {users?.map((user) => 
          <div key={user.BID} className={Styles.boardDiv}>
            <div className={Styles.userDiv}>
              <img></img>
              <h1>{user.Location}</h1>
            </div>
            <div className={Styles.boardimgDiv}>
              <img className={Styles.boardImg} src={`data:image;base64, ${img[0]}`}></img>
            </div>
            <div className={Styles.contentsDiv}>
              <h1>식당이름 - 위치</h1>
              <p>{user.Content}</p>
              <div className={Styles.starDiv}>
                <span className={Styles.star}>⭐4.5</span>
                <span className={Styles.tag}> #태그 #태그</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Main;
