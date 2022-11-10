const {kakao} = window;

let map;
let searchMakers = [];
let mainImg = [];


function resetMakers() {
    for(let i in searchMakers){
        searchMakers[i].setMap(null);
    }
}

//카카오맵 출력
export function kakaoMap(zoom) {
    const container = document.getElementById("myMap");
    const options = {
        center : new kakao.maps.LatLng(33, 126),
        level: zoom,
    };
    map = new kakao.maps.Map(container, options);
    
    map.setZoomable(false);  
}

//글쓰기 주소 찾기
export function boardMapSearch(addr) {
    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(addr, (result, stat) => {

        resetMakers();

        searchMakers.splice(0);

        const position = new kakao.maps.LatLng(result[0].y, result[0].x);

        const img = "img/maker.png";

        const imgSize = new kakao.maps.Size(70, 70);

        const imgOption = {offset: new kakao.maps.Point(20, 65)};

        const markImg = new kakao.maps.MarkerImage(img, imgSize, imgOption);

        const mark = new kakao.maps.Marker({
            map: map,
            position: position,
            image: markImg
        })

        searchMakers.push(mark);

        map.setCenter(position);
    });
}

//메인 화면 출력
export function mainMapSearch(boards, img, index, sessionUID) {
    if(index === 0){
        for(let i in mainImg){
            mainImg[i].setMap(null);
        }
    }

    const {UID, Location} = boards;
    console.log(UID, sessionUID);

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(Location, (result, stat) => {

        const position = new kakao.maps.LatLng(result[0].y, result[0].x);
        
        let content = '<img class="mapImage" src="data:image;base64,'+ img +'"/>';

        let contentDiv = 
            `<div class="${(UID === sessionUID)? "mapImgDiv" : "mapImgDivF"}" onclick="this.remove()">` + content 
                + '</div>';

        const customOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: position,
            content: contentDiv,
            yAnchor: 1
        });

        mainImg.push(customOverlay);

        map.setCenter(position);
    });
}