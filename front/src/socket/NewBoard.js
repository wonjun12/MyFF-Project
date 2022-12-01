import { useState } from "react";
import { useEffect, useRef } from "react";
import styled from './NewBoard.module.scss'


const NewBoards = ({setNewBoard}) => {
    const newDiv = useRef(null);
    const [newStyle, setNewStyle] = useState({left:''});

    const showAni = () => {
        //좌표상 위에서 아래로 이동
        newDiv.current.animate([
            {
                transform: 'translateY(-30px)'
            },{
                transform: 'translateY(5px)'
            }
        ], {
            duration: 3000,
            direction: 'normal',
            easing: 'ease',
            fill: 'forwards'
        });
    }

    const setView = () => {
        setNewBoard(false);
        window.location.href = '/';
    }

    const autoLeft = () => {
        //가로 길이를 검색해서 %수치로 환산하여 적용시킴
        if(window.innerWidth > 1200){
            const width = (window.innerWidth - 400) / 2;
            const size = (width / window.innerWidth * 100) + 0.2;
    
            setNewStyle({left:`${size}%`});
        }else{
            setNewStyle({left:`405px`});
        }
        
    }

    useEffect(() => {
        showAni();
        autoLeft();
        //인터넷 익스플로어 사이즈가 변경될시 이벤트 발생
        window.addEventListener('resize', autoLeft);
    }, [])

    return (
        <div ref={newDiv} className={styled.newBoard} onClick={setView} style={newStyle}>
            📌 팔로우가 새로운 글을 작성했습니다 📌
        </div>
    );
};

export default NewBoards;