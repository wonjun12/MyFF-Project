import  axios  from "axios";
import React from "react";

const SERVER_URL = "http://localhost:4000/";

const Board = () => {
    axios.defaults.withCredentials = true;

    const boardSubmit =(e) => {
        e.preventDefault();
        
        const {locationName,contentName, imgName} = e.target;
        console.log(imgName.files[0]);
        const formData = new FormData();
        

        const config = {
            Headers: {
                'content-type' : 'multipart/form-data'
            }
        };
        const data = {
            writeAddrName: locationName.value,
            writeCommName: contentName.value,
        };
        formData.append('files', imgName.files[0]);
        formData.append('bodys', JSON.stringify(data));
        // formData.append('file', imgName.files[0]);
        axios.post(SERVER_URL + "board/write",
        formData, config).then(res => {
            console.log(res.data);
            const {result} = res.data;

            if(result === "ok"){
                window.location.href = "/";
            }else if(result === "error"){
                alert("로그인 하고 하셈");
                window.location.href = "/";
            }
        })

    }

    return(
        <form onSubmit={boardSubmit}>
            <div style={{paddingTop:"130px"}}>
                <label htmlFor="writeMapId"> 지도 </label>
                    <div>
                        <input type="text" placeholder="위치 검색" name="locationName"/>
                        <input type="button" value="영수증으로 위치 검색"/>
                        <div>지도 들어감</div>
                    </div>
                    <label htmlFor="writeImgId">사진</label>
                <div>
                    <input type="file" name="imgName" multiple/>
                </div>
                <label htmlFor="writeCommId">글쓰기</label>

                <div>
                    <div>
                        <textarea name ="contentName" placeholder="내용 입력"></textarea>
                    </div>
                    <div>별점 들어감</div>
                </div>
                <input type="submit" value="전송"></input>
            </div>
        </form>
    );
}

export default Board;