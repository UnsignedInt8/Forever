import IPFS from 'ipfs';
import OrbitDB from 'orbit-db';

class Store {

    private ipfs: IPFS;
    readonly address: string

    constructor(ipfs: IPFS, dbAddress?: string) {
        this.address = dbAddress ? `${dbAddress}/disk` : 'disk';
        this.ipfs = ipfs;
    }

    async load() {

    }
}