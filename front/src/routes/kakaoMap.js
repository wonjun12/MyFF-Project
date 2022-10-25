const {kakao} = window;

let map;
let searchMakers = [];


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
        level: zoom
    };
    map = new kakao.maps.Map(container, options);
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
export function mainMapSearch(boards, img) {
    const {UID, Location} = boards;

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(Location, (result, stat) => {

        const position = new kakao.maps.LatLng(result[0].y, result[0].x);
        
        let content = '<img src="data:image;base64,'+ img +'" style="width: 70px; height: 70px;" onclick="this.remove()" />';

        const customOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: position,
            content: content,
            yAnchor: 1
        });

        map.setCenter(position);
    });
}