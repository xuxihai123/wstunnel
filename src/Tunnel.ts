import net from 'net';
import { createWsTransport, wrapWsTransport } from './transport';
import Stream from './stream';
import { AddrInfo, TunnelOpts } from './types';
import WebSocket,{WebSocketServer} from 'ws';

class Tunnel {
    listenAddr: string;
    targetAddr: string;
    constructor(opts: TunnelOpts) {
        this.targetAddr = opts.targetAddr;
        this.listenAddr = opts.listenAddr;
    }

    parseAddr(addrstr: string): AddrInfo {
        // wss://127.0.0.1:443
        // tcp://127.0.0.1:8080
        const parts = addrstr.split(':');
        if (/^tcp/.test(addrstr)) {
            return { protocol: 'tcp', host: parts[1].slice(2), port: parts[2] };
        } else {
            return { protocol: parts[0], host: parts[1].slice(2), port: parts[2] };
        }
    }

    dispathToWs(addrinfo:AddrInfo,socket: net.Socket) {
        const wsurl = `${addrinfo.protocol}://${addrinfo.host}:${addrinfo.port}`;
        const ts:any = createWsTransport(wsurl, function () {
            console.log('open ws ok');
            const stream = new Stream(ts);
            socket.pipe(stream);
            stream.pipe(socket);
    
            stream.on('close', function () {
                socket.destroy();
            });
    
            socket.on('close', function () {
                stream.destroy();
            });
            socket.on('error', function (err) {
                stream.destroy(err);
            });
        });

        // ts.on("error",function(){

        // })
     
    }

    dispatchToTcp(addrInfo:AddrInfo,ws:WebSocket) {
        console.log('dispatchToTcp..',addrInfo)
        

        const socket = new net.Socket();
        socket.connect(Number(addrInfo.port),addrInfo.host,function(){
            console.log('connect..ok');
            const ts = wrapWsTransport(ws)
            const stream = new Stream(ts);

            stream.pipe(socket);
            socket.pipe(stream);
            stream.on('close', function () {
                socket.destroy();
            });
    
            socket.on('close', function () {
                stream.destroy();
            });
            socket.on('error', function (err) {
                stream.destroy(err);
            });
        });

        socket.on('error',function(){
            ws.close();
        });
       
    }

    bootstrap() {
        const listenData = this.parseAddr(this.listenAddr);
        console.log('listen:',listenData)
        if (listenData.protocol === 'tcp') {
            const addrinfo = this.parseAddr(this.targetAddr);
            const server = net.createServer(this.dispathToWs.bind(this,addrinfo));
            server.listen(listenData.port, () => {
                console.log('server listen on 127.0.0.1:' + listenData.port);
            });
        } else {
            const wss = new WebSocketServer({ port: Number(listenData.port) });
            const addrinfo = this.parseAddr(this.targetAddr);
            wss.on('connection', this.dispatchToTcp.bind(this,addrinfo));
        }
    }
}

export default Tunnel;
