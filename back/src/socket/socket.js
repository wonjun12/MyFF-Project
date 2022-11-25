import socketIO from "socket.io";
import models from "../models";


module.exports = (server) => {
    const io = socketIO(server, {path: '/socket.io', 
        cors: {
            origin : "http://localhost:3000",
            methods: ["GET", "POST"],
            credentials: true
        }
    });
    

        io.use((socket, next) => {
            const {UID} = socket.handshake.query;

            if(!!parseInt(UID)){
                next();
            }
        });


        io.on('connection', (socket) => {
            const {UID} = socket.handshake.query;
            const req = socket.request;
            const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress;
                
            console.log('new connection', ip, socket.id);
            
            socket.on("login", (data)=>{
            
            });

            socket.on("boardCreate", async () => {

                const follwers = await models.Follwer.findAll({
                    where: {FUID : UID}
                });

                let folloerUID = [];
                await follwers.forEach(({MyUID}) => {
                    folloerUID.push(MyUID);
                })
                
                socket.broadcast.emit("boardCreate", folloerUID);

            })
            
            socket.on('disconnect', () => {
                console.log("disconnect", ip, socket.id);
                clearInterval(socket.interval);
            });
        });  


};