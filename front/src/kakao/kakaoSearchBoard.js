import { useState } from 'react';
import { useEffect } from 'react';
import styled from './boardList.module.scss';

const {kakao} = window;


const SearchBoard = ({addr, setAddr, setName}) => {

    const [boardList, setBoardList] = useState([]);
    const [location, setLocation] = useState(addr);
    const [bool, setBool] = useState(false);

    
    const search = (addrs) => {
        const ps = new kakao.maps.services.Places();
        
        ps.keywordSearch(addrs, (data, stat) => {
            if(stat === kakao.maps.services.Status.OK){
                for(let i of data){
                    boardList.push({names: i.place_name, address: i.address_name});
                    setBoardList([...boardList]);
                }

            }else if (stat === kakao.maps.services.Status.ZERO_RESULT){
                setBoardList([]);
            }else{
                setBoardList([]);
            }
        }); 
    }
    
    useEffect(() => {
        setBoardList([]);
        setLocation(addr);
        setBool((b) => !b);
    }, [addr]);

    useEffect(() => {
        search(location);
    }, [bool]);

    const selectAddr = (e) => {
        const {innerText} = e.target;

        const locationName = innerText.substring(4, innerText.indexOf('주소: '));
        const locationValue = innerText.substring(innerText.indexOf('주소: ') + 4);
        
        setName({name:locationName, addr:locationValue});
        setAddr(locationValue);
        setBoardList([]);
    };

    
    return (
        <ul className={styled.boardList}>
            {boardList?.map(({names, address}, index) => {
                return (
                    <li key={index} onClick={selectAddr}>
                        이름: {names} <br/>
                        주소: {address}
                    </li>
                );
            })}
        </ul>
    );
};

export default SearchBoard;