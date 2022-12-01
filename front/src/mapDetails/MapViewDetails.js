import axios from 'axios';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { Buffer } from "buffer";
import styled from "./MapViewDetails.module.scss";
//kakao map을 만든 파일에서 필요한 것들 들고옴
import {CreateLocation, locationFImg, locationMyImg, SetMap} from './MapDetails';

const MapViewDetails = ({mapView}) => {
    axios.defaults.withCredentials = true;
    
    const [selectList, SetSelectList] = useState(['나의 글 보기', '팔로우 글 보기']);
    //게시물 보기 선택 유무 확인
    const [selectView, setSelectView] = useState(true);
    //애니메이션 효과중에 버튼 비활성화
    const [disables, setDisables] = useState(true);

    const selectDiv = useRef(null);

    //맵 닫기
    const closeMap = () => {
        document.body.style.overflow = 'visible';
        mapView(false)
    };

    //게시물 선택을 볼때 애니메이션 효과
    const setView = () => {
        setSelectView((v) => !v);
        setDisables(true);
        viewAnimation(!selectView);
        settingDisable();
    }

    //2초후 버튼 활성화
    const settingDisable = () => {
        setTimeout(() => {
            setDisables(false);
        }, 2100)
    }

    //애니메이션 효과
    const viewAnimation = (bool) => {
        selectDiv.current.animate([
            {
                width: '49px'
            },{
                width: '250px'
            }
        ], {
            duration: 1500,
            direction: (bool)? 'normal' : 'reverse',
            easing: 'ease-in-out',
            fill: 'forwards'
        });
        
    };


    useEffect(() => {
        document.body.style.overflow = 'hidden';
        viewAnimation(true)
        settingDisable();
    }, [])


    //나의 게시물과 팔로우 게시물 선택시 요청
    const clickCheck = (v) => {
        const {checked, name} = v.target;
        const sessionId = parseInt(sessionStorage.getItem('loginUID'));
        
        //선택 했을 시 맵에 추가함
        if(checked){
            axios.get('/api/home/location',{
                params: {
                    name
                }   
            }).then(res => {
                const {result} = res.data;

                if(result === 0){
                    const {board} = res.data;
                    for(let i in board){
                        const img = Buffer.from(board[i].Pictures[0].Photo).toString('base64');
                        CreateLocation(board[i], img, sessionId);
                    }
                }else if(result === 1){
                    const {Follwers} = res.data.follwer;

                    Follwers.forEach(({Boards}) => {
                        for(let i in Boards){
                            const img = Buffer.from(Boards[i].Pictures[0].Photo).toString('base64');
                            CreateLocation(Boards[i], img, sessionId);
                        }
                    })
                }
            })
        }else{
            //선택 해제시 사진 삭제
            if(name === '0'){
                for(let i in locationMyImg){
                    locationMyImg[i].setMap(null);
                }
            }else if(name === '1'){
                for(let i in locationFImg){
                    locationFImg[i].setMap(null);
                }
            }

        }
    }



    return (
        <div className={styled.mapDetails}>
            <div className={styled.settingMap}>
                    <SetMap />
            </div>
            <button onClick={closeMap}> 지도 닫기 </button>
            <div ref={selectDiv} className={styled.selectDiv} >
                <div className={styled.selectView}>
                    <button onClick={setView} disabled={disables}> 설정 </button>
                    <ul>
                        {selectList.map((list, index) => {
                            return (
                            <li key={index}>
                                <div>
                                    {list} 
                                    <input type='checkbox' name={index} onClick={clickCheck}/>
                                </div>
                            </li>
                            )
                        })}
                    </ul>
                </div>   
            </div>
        </div>
    );
}

export default MapViewDetails;