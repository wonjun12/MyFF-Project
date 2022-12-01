import { useEffect, useRef } from 'react';
import {renderToString} from 'react-dom/server';
import styled from './locationMap.module.scss';
import {Buffer} from 'buffer';

//window에 설정되어잇는 kakao를 들고와야 실행할수있음
const {kakao} = window;
let detailsMap;

//나의 게시물
export let locationMyImg = [];
//팔로워 게시물
export let locationFImg = [];

export const  SetMap = () => {
    //div 가리킴
    const mapElement =  useRef(null);
    
    

    //맵 생성
    const createMap = () => {
        if(mapElement.current){
            const options = {
                //중앙에 위치하는 좌표 생성
                center : new kakao.maps.LatLng(37.5424593, 126.6838205),
                //확대 배율
                level: 9,
            };
            //맵을 만드는 함수
            detailsMap = new kakao.maps.Map(mapElement.current, options);
            
        }
    };

    useEffect(() => {
        createMap();
    },[]);

    return (
            <div ref={mapElement} style={{width:'100%', height:'100%', zIndex: '0'}}>   
            </div>
    );
};

//위치에 게시물 만들기
export const CreateLocation = (boards, img, sessionUID) => {

    const {UID, Location, BID, User} = boards;
    //주소를 검색해주는 함수를 사용할수 있게 해준다.
    const geocoder = new kakao.maps.services.Geocoder();

    //주소 검색을 함
    geocoder.addressSearch(Location, (result, stat) => {
        //주소가 정말 있다면 실행시킴
        if(stat === kakao.maps.services.Status.OK){
            //해당 주소의 좌쵸를 가져와서 설정
            const position = new kakao.maps.LatLng(result[0].y, result[0].x);

            //접속한 유저와 게시물의 작성자인지 판별
            const bool = (UID === sessionUID);

            //이미지를 생성함
            //innerHTML로 String으로 변환 후 넣으면 만들어짐
            const getImg = renderToString(<CreateImg img={img} bool={bool} BID={BID} profile={User.ProFile}/>);
    
            //map에서 사용자 div를 생성해야 이벤트를 생성할수있음
            const content = document.createElement('div');
            

            content.innerHTML = getImg;
         

            //커스텀 오버레이 생성(커스텀 div 생성)
            const customOverlay = new kakao.maps.CustomOverlay({
                //생성한 기준 map
                map: detailsMap,
                //위치
                position,
                //생성한 div
                content,
                yAnchor: 1
            });
        
            const setZIndex =(e) => {
                e.path[3].style.zIndex = 100;
            }
        
            const resetZIndex = (e) => {
    
                e.path[3].style.zIndex = 3;
            }

            const boardSee = () => {
                window.location.href = `/board/${BID}`;
            }
        
            //마우스 오버 이벤트
            content.addEventListener('mouseover', setZIndex);
            //마우스 아웃 이벤트
            content.addEventListener('mouseout', resetZIndex);
            //마우스 클릭 이벤트
            content.addEventListener('mousedown', boardSee);
    
            //전역변수로 넣어버림(초기화를 위해서)
            if(bool) {
                locationMyImg.push(customOverlay);
            }else{
                locationFImg.push(customOverlay);
            }
            
        } 
    });
}

const CreateImg = ({img, bool, profile }) => {

    //게시물 사진 설정
    const setImg = `data:image;base64,${img}`;
    //유저 프로필 설정
    const setPro = (!!profile)? `data:image;base64,${Buffer.from(profile.data).toString('base64')}` : '/img/profile.png';

    return (
        <div className={(bool)? styled.mapImgDiv : styled.mapImgDivF}>
            <img src={setImg}/>
            <img src={setPro}/>
        </div>
    );
}