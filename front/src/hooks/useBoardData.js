import { useEffect, useState } from "react";
import axios from "axios";

const useBoardData = (pageNum) => {
    axios.defaults.withCredentials = true;
    
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);
    const [boards, setboards] = useState([]);
    const [hasMore, setHasMore] = useState(false);

    // onChange시에 list를 리셋
    useEffect(() => setboards([]), []);
    
    useEffect(() => {
        let cancel;

        // useEffect안에async는 반환하는 값의 형태가 다르므로 쓸 수 없음
        // 그래서 새로운 함수를 만들어서 호출하는 방식으로 사용
        // axios의 cancel-token을 사용하여 반복적으로 cancel하고 
        // 마지막 onChange 에만 axios를 작동하게 한다
        const tryUseEffect = async () => {
            try {
                setLoading(true);
                setError(false);

                axios({
                    method: "GET",
                    url: "http://localhost:4000/",
                    params: { page: pageNum },
                    cancelToken: new axios.CancelToken((c) => (cancel = c)),
                }).then(res => {
                    console.log(res.data.boardArray);
                    setboards((boards) => [
                        ...boards,
                        ...res.data.boardArray,
                    ]);
                    
                    setHasMore(res.data.boardArray.length > 0);
                    setLoading(false);
                });

                //console.log(res.data.boardArray);
                
                

            } catch (e) {
                if(axios.isCancel(e)) return;
                setError(true);
            }
        };
        tryUseEffect();
        return () => cancel();
    }, [pageNum]);

    // state값 리턴
    return [loading, error, boards, hasMore];
};

export default useBoardData;