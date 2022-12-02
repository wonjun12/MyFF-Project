import socketIO from "socket.io";
import models from "../models";

//cors정책이나
//배포시 필요없음
const options = {
    path: '/socket.io', 
    cors: {
        origin : "http://localhost:3000",
        methods: ["GET", "POST"],
        credentials: true
    }
}

module.exports = (server) => {
    //받아온 서버로 소켓설정
    const io = socketIO(server);
    

        //클라이언트에서 접속 시도시 
        io.use((socket, next) => {
            const {UID} = socket.handshake.query;

            //UID값을 가졍와서 판별함
            if(!!parseInt(UID)){
                next();
            }
        });


        //소켓 연결시
        io.on('connection', (socket) => {
            const {UID} = socket.handshake.query;
            const req = socket.request;
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                
            //연결 된 후 출력
            //console.log('new connection', ip, socket.id);
            
            socket.on("login", (data)=>{
            
            });

            //게시물 작성 시에 요청 온것에 대한것
            socket.on("boardCreate", async () => {

                const follwers = await models.Follwer.findAll({
                    where: {FUID : UID}
                });

                let folloerUID = [];
                await follwers.forEach(({MyUID}) => {
                    folloerUID.push(MyUID);
                })
                
                //연결된 클라이언트에게 보낸다.
                //emit는 자신을 제외하고 보낸다.
                socket.broadcast.emit("boardCreate", folloerUID);

            })
            
            //소켓 해제시 발생 이벤트
            socket.on('disconnect', () => {
                //console.log("disconnect", ip, socket.id);
                clearInterval(socket.interval);
            });
        });  


};