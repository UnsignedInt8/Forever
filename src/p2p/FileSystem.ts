import IPFS from 'ipfs';
import OrbitDB from 'orbit-db';
import IPFSDir from '../models/Dir';
import { Event } from '../lib/Event';
const uuidv1 = require('uuid/v1');

class FileSystem extends Event {

    private orbit: OrbitDB;
    private db: OrbitDB.Store;
    private ipfs: IPFS;
    readonly address: string

    constructor(ipfs: IPFS, dbAddress?: string) {
        super();
        this.ipfs = ipfs;
        this.address = dbAddress ? `${dbAddress}/disk` : 'disk';
        this.orbit = new OrbitDB(ipfs);
    }

    async load() {
        this.db = await this.orbit.docs(this.address, { indexBy: 'id', write: ['*'] });
        await this.db.load();

        this.db.events.on('replicated', (address) => this.trigger('replicated', address));
        this.db.events.on('replicate', (address) => this.trigger('replicate', address));
    }

    onReplicated(callback: (sender: FileSystem, address: string) => void) {
        super.register('replicated', callback);
    }

    onReplicate(callback: (sender: FileSystem, address: string) => void) {
        super.register('replicate', callback);
    }

    async mkdir(title: string, parent?: string) {
        let dir: IPFSDir = {
            id: uuidv1(),
            title,
            files: [],
            parentId: parent,
        };

        let hash = await this.db.put(dir);
        return hash ? true : false;
    }

    async rmdir(id: string) {
        return await this.db.del(id) ? true : false;
    }

    async listDirs() {
        return this.db.query(item => item) as IPFSDir[];
    }

    addFile() {

    }

    rmFile(id: string) {

    }
}