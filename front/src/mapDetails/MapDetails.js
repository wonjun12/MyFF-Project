import { useEffect, useRef } from 'react';
import {renderToString} from 'react-dom/server';
import styled from './locationMap.module.scss';

const {kakao} = window;
let detailsMap;

export let locationMyImg = [];
export let locationFImg = [];

export const  SetMap = () => {
    const mapElement =  useRef(null);
    
    

    const createMap = () => {
        if(mapElement.current){
            const options = {
                center : new kakao.maps.LatLng(37.5424593, 126.6838205),
                level: 9,
            };
    
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

export const CreateLocation = (boards, img, sessionUID) => {

    const {UID, Location, BID} = boards;

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(Location, (result, stat) => {
        if(stat === kakao.maps.services.Status.OK){
            const position = new kakao.maps.LatLng(result[0].y, result[0].x);

            const bool = (UID === sessionUID);

            const getImg = renderToString(<CreateImg img={img} bool={bool} BID={BID} />);
    
            const content = document.createElement('div');
            
            content.innerHTML = getImg;
         
            const customOverlay = new kakao.maps.CustomOverlay({
                map: detailsMap,
                position,
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
        
            content.addEventListener('mouseover', setZIndex);
            content.addEventListener('mouseout', resetZIndex);
            content.addEventListener('mousedown', boardSee);
    
            if(bool) {
                locationMyImg.push(customOverlay);
            }else{
                locationFImg.push(customOverlay);
            }
            
        } 
    });
}

const CreateImg = ({img, bool }) => {

    const setImg = `data:image;base64,${img}`;

    return (
        <div className={(bool)? styled.mapImgDiv : styled.mapImgDivF}>
            <img src={setImg}/>
            <img src='/img/profile.png' style={{}} />
        </div>
    );
}