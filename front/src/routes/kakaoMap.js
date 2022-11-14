const $ = require('jquery');
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

    let ps = new kakao.maps.services.Places();

    ps.keywordSearch(addr, placesSearchCB);

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(addr, (result, stat) => {

        resetMakers();

        searchMakers.splice(0);

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

    const {UID, Location, BID} = boards;

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(Location, (result, stat) => {

        const position = new kakao.maps.LatLng(result[0].y, result[0].x);
        const className = (UID === sessionUID)? "mapImgDiv" : "mapImgDivF";
        const boardBID = BID

        let content = '<img class="mapImage" src="data:image;base64,'+ img +'"/>';

        let contentDiv = 
            `<div class="${className}" onclick="boardFnc(${boardBID})">` + content 
                + '</div>';

        const customOverlay = new kakao.maps.CustomOverlay({
            map: map,
            position: position,
            content: contentDiv,
            yAnchor: 1
        });

        $(`.${className}`).mouseover(function(){
            $(this).parent('div').css('z-index', '100');
        });
        $(`.${className}`).mouseleave(function(){
            $(this).parent('div').css('z-index', '0');
        });

        mainImg.push(customOverlay);

        map.setCenter(position);
    });
}


function placesSearchCB (data, status, pagination){
    if(status === kakao.maps.services.Status.OK){
        displayPlaces(data);
    }else{
        const listEl = document.getElementById("locationSearch");
        removeAllChildNods(listEl);
    }
}

function displayPlaces(places){
    let listEl = document.getElementById("locationSearch"),
    fragment = document.createDocumentFragment();
    removeAllChildNods(listEl);
    for(let i = 0; i < places.length; i++){
        const itemEl = getListItem(i, places[i]);

        fragment.appendChild(itemEl);
    }
    
    listEl.appendChild(fragment);
    listEl.removeAttribute("hidden");
}

function getListItem(i, places){
    let el = document.createElement('li');
    let itemStr = '<div class="placeCl" id="placeId'+ i +'" style="border-bottom:1px black solid;" onclick="clickSearchKeyword('+ i +')">'
                +   '<div>' + places.place_name +'</div>'
                +   '<div id="placeName' + i + '">' + places.address_name +'</div>'
                +   '</div>';

    el.innerHTML = itemStr;

    return el;
}

function removeAllChildNods(el)  {   
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
    el.setAttribute("hidden", "hidden");
}

