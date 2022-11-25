import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styled from './NewBoard.module.scss'


const NewBoards = ({setNewBoard}) => {
    const newDiv = useRef(null);

    const showAni = () => {
        newDiv.current.animate([
            {
                transform: 'translateY(-30px)'
            },{
                transform: 'translateY(0px)'
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
    }

    useEffect(() => {
        showAni();
    }, [])

    return (
        <Link to='/'>
            <div ref={newDiv} className={styled.newBoard} onClick={setView}>
                팔로우가 새로운 글을 작성했습니다.
            </div>
        </Link>
    );
};

export default NewBoards;