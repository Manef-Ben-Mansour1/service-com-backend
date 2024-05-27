import { Socket } from "socket.io";
import { WsJwtGuard } from "./guards/ws-jwt/ws-jwt.guard";

type SocketIOMiddleWare={
    (client: Socket,next:(err?:Error)=>void);
};
export const SocketAuthMiddleware=(): SocketIOMiddleWare=>{
    return(client,next)=>{
        try{
            console.log(client);
            WsJwtGuard.validateToken(client);
            next();
             }
             catch(error){
                next(error);
             }
};
};
