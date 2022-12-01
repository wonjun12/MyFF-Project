import { useEffect, useState } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";

const useUserData = (page) => {
    axios.defaults.withCredentials = true;
    const source = axios.CancelToken.source();

    let SERVER_URL = "/api/home/";

    const currentUrl = useLocation();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [users, setUsers] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    const tryUseEffect = () => {
        
        try {
            setLoading(true);
            setError(false);

            axios.get(SERVER_URL,{
                params: { page: page },
                cancelToken: source.token,
            }).then(res => {
                const { result } = res.data;
                if(result !== "filed"){
                    //console.log(res.data.userArray);
                    setUsers((users) => [
                        ...users,
                        ...res.data.userArray,
                    ]);
                    setHasMore(res.data.userArray.length >= 1);
                    setLoading(false);
                }
            });
            
        } catch (e) {
            if(axios.isCancel(e)) return;
            setError(true);
        }
    };

    // onChange시에 list를 리셋
    useEffect(() => setUsers([]), []);
    
    useEffect(() => {

        if(currentUrl.pathname === "/bestuser"){
            SERVER_URL = "/api/home/bestuser";
        }
        // useEffect안에async는 반환하는 값의 형태가 다르므로 쓸 수 없음
        // 그래서 새로운 함수를 만들어서 호출하는 방식으로 사용
        // axios의 cancel-token을 사용하여 반복적으로 cancel하고 
        // 마지막 onChange 에만 axios를 작동하게 한다
        tryUseEffect();

    }, [page]);

    // state값 리턴
    return [loading, error, users, hasMore];
};

export default useUserData;