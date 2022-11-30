import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { Link } from "react-router-dom";
import { Buffer } from "buffer";
import styled from "./HeaderSearch.module.scss";


const HeaderSearch = ({searchValue, setSearchValue, select}) => {

    const [bool, setBool] = useState();
    const searchDiv = useRef();
    const [searchStyle, setSearchStyle] = useState({left:''});

    const autoLeft = () => {
        const width = (window.innerWidth - 1220) / 2;
        const size = (width / window.innerWidth * 100) + 0.2;

        if(width > 0){
            setSearchStyle({left: `${size}%`});
        }else{
            setSearchStyle({left: `0%`});
        }
        
    }

    useEffect(() => {
        autoLeft();
        window.addEventListener("resize", autoLeft);
    },[])

    useEffect(() => {
        if(searchValue.length > 0){
            if(searchValue.length === 1){
                searchDiv.current.style.height = '117px';
            }else if(searchValue.length === 2){
                searchDiv.current.style.height = '235px';
            }else{
                searchDiv.current.style.height = '350px';
            }
            setBool(true);
        }else{
            searchDiv.current.style.height = '117px';
            setBool(false);
        }
    }, [searchValue]);


    return (
        <div className={styled.searchDiv} ref={searchDiv} style={searchStyle}>
            {
                (bool)? 
                <ul>
                    {
                    (select === '0')?
                    searchValue.map(({Name, NickName, ProFile, UID, Follwings, Boards}, index) => {

                        let photo;
                        if(!!ProFile){
                            photo = `data:image;base64,${Buffer.from(ProFile).toString('base64')}`;
                        }else {
                            photo = '/img/profile.png';
                        }

                        let create;
                        if(!!Boards[0]){
                            const {createdAt} = Boards[0];
                            create = createdAt.substr(0,10);
                        }else{
                            create = '없음'
                        }

                        return (
                            <li key={index} onClick={() => setSearchValue(null)}>
                                <Link to={`/user/${UID}`}>
                                    <div className={styled.searchList}>
                                        <img src={photo} />
                                        <div>
                                            <p>이름 :</p>
                                            <p>닉네임 :</p>
                                            <p>팔로잉 :</p>
                                            <p>최근 게시물 :</p>
                                        </div>
                                        <div>
                                            <p>{Name}</p>
                                            <p>{NickName}</p>
                                            <p>{Follwings?.length}명</p>
                                            <p>{create}</p>   
                                        </div>
                                    </div>
                                </Link>
                            </li>
                            
                        );
                    }) : 
                    searchValue.map(({BID, Location, Pictures, PlaceName, Star, BoardLikes}, index) => {

                        const photo = `data:image;base64,${Buffer.from(Pictures[0].Photo.data).toString('base64')}`;

                        const stars = (Star) => {
                            let con = ''
                            for(let i = 0; i < parseInt(Star); i++){
                                con += '★';
                            }
                            return con;
                        }

                        return (
                            <li key={index} onClick={() => setSearchValue(null)}>
                                <Link to={`/board/${BID}`}>
                                    <div className={styled.searchListBoard}>
                                        <img src={photo} />
                                        <div>
                                            <div>❤ 
                                                <div>
                                                    {BoardLikes.length}
                                                    </div>
                                                </div>
                                            
                                            <p>{stars(Star)}</p>
                                            <p>{PlaceName}</p>
                                            <p>{Location}</p>
                                        </div>
                                    </div>
                                </Link>
                            </li>
                        );
                    })
                }
                </ul>
                :
                <div className={styled.searchFiled}>
                    검색 결과가 없습니다!
                </div>
            }
            <button onClick={() => setSearchValue(null)}>닫기</button> 
        </div>
    );
}

export default HeaderSearch;