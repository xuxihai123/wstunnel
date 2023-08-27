
import WebSocket from 'ws';



export class Transport {
    conn: WebSocket;
    constructor(ws:WebSocket) {
        this.conn = ws;
    }
    sendPacket(binarydata:Buffer) {
        const ws = this.conn;
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(binarydata, { binary: true });
        } else {
            throw Error('ws socket not open!' + ws.readyState);
        }
    }
    bindEvents(onData:any, onError:any, onClose:any) {
        const ws = this.conn;
        ws.on('message', onData);
        ws.on('close', (code) => {
            // console.log('===close===',code);
            onClose(code);
        });
        ws.on('error', (err) => {
            // console.log('===error===')
            ws.close();
            onError(err);
        });
    }

    close() {
        try {
            this.conn.close();
        } catch (err) {
            // ignore
        }
    }
}

export function createWsTransport(tunnelWsUrl:string, onOpen:any) {
    // tunnelWsUrl,  seed, method,password,protocol, host,port,path, ctrlcode,ctrlmethod,
    // let tunnelWsUrl = `${params.secure ? 'wss' : 'ws'}://${params.host}:${params.port}${params.path}`;
    // console.log('====wsurl:', tunnelWsUrl);
    const ws:any = new WebSocket(tunnelWsUrl);
    const ts = new Transport(ws);
    ws.on('open', onOpen);
    return ts;
};


export function wrapWsTransport(ws:WebSocket){
    const ts = new Transport(ws);
    return ts;
}
