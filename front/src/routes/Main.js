import axios from "axios";
import { useEffect, useState } from "react";
import Styles from "./Main.module.scss";
import useIntersect from "../hooks/useIntersect";



function Main() {

  console.log('렌더링');

  const SERVER_URL = "http://localhost:4000/";
  const [users, setUsers] = useState(null);

  //useIntersect
  const [state, setState] = useState({ itemCount: 0, isLoading: false });
  //const [loading, setLoading] = useState(false);


  const fatchData = async () => {
    setState(prev => ({ ...prev, isLoading: true }));

    // await axios.get(SERVER_URL)
    //   .then((res) => {
    //     setUsers(res.data);
    //     //setLoading(true);
    //   });
    //   setState(prev => ({
    //     itemCount: prev.itemCount + 4,
    //     isLoading: false
    //   }));
  };

  useEffect(() => {
    // fatchData();
    
  }, []);

  const { itemCount, isLoading } = state;

  const [_, setRef] = useIntersect(async (entry, observer) => {
    observer.unobserve(entry.target);
    // fatchData();
    observer.observe(entry.target);

  }, {});


  if (!itemCount) return null;

  return (
    <div className={Styles.container}>
      <div className={Styles.mapDiv}>
        <img src="map.PNG"></img>
      </div>
      <div className={Styles.boardContainer}>

        {users?.map((user, index) => index < itemCount ? (
          <div key={user.id} className={Styles.boardDiv}>
            <div className={Styles.userDiv}>
              <img></img>
              <h1>{user.id}</h1>
            </div>
            <div className={Styles.boardimgDiv}>
              <img className={Styles.boardImg} src="test.jfif"></img>
            </div>
            <div className={Styles.contentsDiv}>
              <h1>식당이름 - 위치</h1>
              <p>{user.text}</p>
              <div className={Styles.starDiv}>
                <span className={Styles.star}>⭐4.5</span>
                <span className={Styles.tag}> #태그 #태그</span>
              </div>
            </div>
          </div>
        ) : null)}

        <div ref={setRef} className={Styles.loadingDiv}>
          {isLoading && "Loading..."}
        </div>
      </div>
    </div>
  );
}

export default Main;
