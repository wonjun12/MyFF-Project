import { useState } from "react";
import { useEffect, useRef } from "react";
import styled from './NewBoard.module.scss'


const NewBoards = ({setNewBoard}) => {
    const newDiv = useRef(null);
    const [newStyle, setNewStyle] = useState({left:''});

    const showAni = () => {
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
        window.addEventListener('resize', autoLeft);
    }, [])

    return (
        <div ref={newDiv} className={styled.newBoard} onClick={setView} style={newStyle}>
            📌 팔로우가 새로운 글을 작성했습니다 📌
        </div>
    );
};

export default NewBoards;