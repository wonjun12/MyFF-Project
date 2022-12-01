import { useEffect, useRef } from 'react';

export let map;

export const  SetMap = ({zoom, Draggable}) => {
    const mapElement =  useRef(null);
    const {kakao} = window;
    
    const mapStyle = {
        width:'100%', 
        height:'100%', 
        zIndex: '0',
        borderRadius: '15px',
        border: '2px solid orange'
    }

    const createMap = () => {
        if(mapElement.current){
            const options = {
                center : new kakao.maps.LatLng(37.5424593, 126.6838205),
                level: zoom,
                draggable: !Draggable
            };
    
            map = new kakao.maps.Map(mapElement.current, options);

            
        }
    };

    useEffect(() => {
        createMap();
    },[]);

    return (
            <div ref={mapElement} style={mapStyle}>   
            </div>
    );
};

