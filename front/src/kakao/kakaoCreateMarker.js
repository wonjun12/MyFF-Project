import {map} from './kakaoAPI';

const {kakao} = window;
let makers = [];

const CreateMaker = (addr) => {
    

        const geocoder = new kakao.maps.services.Geocoder();

        geocoder.addressSearch(addr, (result, stat) => {

            if(stat === kakao.maps.services.Status.OK){
                for(let i in makers){
                    makers[i].setMap(null);
                }
    
                const position = new kakao.maps.LatLng(result[0].y, result[0].x);
            
                const img = "/img/maker.png";
            
                const imgSize = new kakao.maps.Size(70, 70);
            
                const imgOption = {offset: new kakao.maps.Point(20, 65)};
            
                const markImg = new kakao.maps.MarkerImage(img, imgSize, imgOption);
            
                const mark = new kakao.maps.Marker({
                    map: map,
                    position: position,
                    image: markImg
                })
            
                makers.push(mark);
            
                map.setCenter(position);
            }  
    });
}

export default CreateMaker;