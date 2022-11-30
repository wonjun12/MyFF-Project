import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const useBoardData = (page, isTag) => {
    axios.defaults.withCredentials = true;
    let SERVER_URL = "/api/home/";
    const source = axios.CancelToken.source();

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [boards, setboards] = useState([]);
    const [hasMore, setHasMore] = useState(false);
    const [user, setUser] = useState([]);
    
    const tryUseEffect = (params) => {

        try {
            setLoading(true);
            setError(false);

            axios.get(SERVER_URL,{
                params,
                cancelToken: source.token,
            }).then(res => {
                const {result} = res.data;
                //console.log(res.data);
                if(result !== "filed"){
                    setboards((boards) => [
                        ...boards,
                        ...res.data.boardArray,
                    ]);
                    setHasMore(res.data.boardArray.length >= 1);
                    setLoading(false);
                    if(page.path === "main"){    
                        setUser(res.data.follwers);
                    }
                }
            });

            //console.log(res.data.boardArray);

        } catch (e) {
            if(axios.isCancel(e)) return;
            setError(true);
        }
    };

    // onChange시에 list를 리셋
    useEffect(() => setboards([]), []);
    
    useEffect(() => {

        let params = {
            page: page.num,
        }

        if(page.path === 'best'){
            if(isTag){
                SERVER_URL = "/api/home/tag";
                params.tag = page.tag;
            }else{
                SERVER_URL = "/api/home/best";
            }
        }
        // useEffect안에async는 반환하는 값의 형태가 다르므로 쓸 수 없음
        // 그래서 새로운 함수를 만들어서 호출하는 방식으로 사용
        // axios의 cancel-token을 사용하여 반복적으로 cancel하고 
        // 마지막 onChange 에만 axios를 작동하게 한다
        tryUseEffect(params);

    }, [page.num ,page.path]);

    // state값 리턴
    return [loading, error, boards, hasMore, user];
};

export default useBoardData;