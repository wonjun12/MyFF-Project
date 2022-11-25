import axios from 'axios';
import { useEffect } from 'react';
import { useRef } from 'react';
import { useState } from 'react';
import { Buffer } from "buffer";
import {CreateLocation, locationFImg, locationMyImg, SetMap} from './MapDetails';
import styled from "./MapViewDetails.module.scss";


const MapViewDetails = ({mapView}) => {
    axios.defaults.withCredentials = true;
    
    const [selectList, SetSelectList] = useState(['나의 글 보기', '팔로우 글 보기']);
    const [selectView, setSelectView] = useState(true);
    const [disables, setDisables] = useState(true);

    const selectDiv = useRef(null);

    const closeMap = () => {
        document.body.style.overflow = 'visible';
        mapView(false)
    };

    const setView = () => {
        setSelectView((v) => !v);
        setDisables(true);
        viewAnimation(!selectView);
        settingDisable();
    }

    const settingDisable = () => {
        setTimeout(() => {
            setDisables(false);
        }, 2100)
    }

    const viewAnimation = (bool) => {
        selectDiv.current.animate([
            {
                height: '22px'
            },{
                height: '120px'
            }
        ], {
            duration: 2000,
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


    const clickCheck = (v) => {
        const {checked, name} = v.target;
        const sessionId = parseInt(sessionStorage.getItem('loginUID'));
        
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
                    <button onClick={setView} disabled={disables}> 보기 설정 </button>
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