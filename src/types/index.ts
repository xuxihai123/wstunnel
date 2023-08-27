export interface TunnelOpts{
    listenAddr:string;
    targetAddr:string;
}

export interface AddrInfo{
    protocol:string;
    host:string;
    port:string;
    path?:string; // for ws
}