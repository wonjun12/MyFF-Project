import {renderToString} from 'react-dom/server';
import styled from './MainImg.module.scss';
import {map} from './kakaoAPI';

const {kakao} = window;
let mainImg = [];

const CreateImg = ({img, bool}) => {

    const setImg = `data:image;base64,${img}`;

    return (
        <div className={(bool)? styled.mapImgDiv : styled.mapImgDivF} >
            <img src={setImg}/>
            <img src='/img/profile.png' style={{}} />
        </div>
    );
}


const CreateMain = (boards, img, index, sessionUID) => {

    if(index === 0){
        for(let i in mainImg){
            mainImg[i].setMap(null);
        }
    }

    const {UID, Location, BID} = boards;

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(Location, (result, stat) => {
        if(stat === kakao.maps.services.Status.OK){
            const position = new kakao.maps.LatLng(result[0].y, result[0].x);

            const getImg = renderToString(<CreateImg img={img} bool={UID === sessionUID} BID={BID} />);
    
            const content = document.createElement('div');
            
            content.innerHTML = getImg;
         
            const customOverlay = new kakao.maps.CustomOverlay({
                map,
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
    
            mainImg.push(customOverlay);
    
            map.setCenter(position);
    
        } else if (stat === kakao.maps.services.Status.ZERO_RESULT) {
        // 검색결과가 없는경우 해야할 처리가 있다면 이곳에 작성해 주세요
        console.log("검색결과 없음");

        }
    });
}
export default CreateMain;