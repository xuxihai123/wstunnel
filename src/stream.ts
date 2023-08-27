import { Duplex } from 'stream';
import { Transport } from './transport';

class Stream extends Duplex {
    cache: Buffer;
    tsport: Transport;
    constructor(ts:Transport) {
        super();
        this.cache = Buffer.from([]);
        this.tsport = ts;
        ts.bindEvents(this.onData.bind(this),this.onError.bind(this),this.onClose.bind(this));
    }

    onData(data:Buffer){
        this.produce(data);
    }

    onError(err:Error){
        this.destroy(err);
    }

    onClose(){
        this.destroy();
    }

    produce(rawData?: Buffer) {
        if (!rawData) {
            // console.log('no rawData====', rawData);
            return;
        }
        this.cache = Buffer.concat([this.cache, rawData]);
        this.read();
    }

    _write(chunk: Buffer, encoding: string, callback: any) {
        // The underlying source only deals with strings
        this.tsport.sendPacket(chunk);
        callback();
    }
    _read(size?: number) {
        size = size || 1024 * 4;
        const rawdata = this.cache.subarray(0, size);
        // console.log( 'read:',rawdata.toString())
        this.push(rawdata);
        this.cache = this.cache.subarray(size);
    }
}

export default Stream;
