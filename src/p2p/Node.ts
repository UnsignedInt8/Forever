import IPFS from 'ipfs';
import { Event } from '../lib/Event';

const IpfsConfig = {
    repo: '/ipfs/apps/forever',
    EXPERIMENTAL: {
        pubsub: true,
    },
    config: {
        Addresses: {
            Swarm: [
                '/dns4/wrtc-star.discovery.libp2p.io/tcp/443/wss/p2p-webrtc-star',
                '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
            ]
        },
    }
};


export default class Node extends Event {

    readonly ipfs: any;

    constructor(repo?: string) {
        super();

        IpfsConfig.repo = repo ? repo : IpfsConfig.repo;

        this.ipfs = new IPFS(IpfsConfig);
        this.ipfs.on('ready', () => this.trigger('ready'));
        this.ipfs.on('init', () => this.trigger('init'));
        this.ipfs.on('start', () => this.trigger('start'));
        this.ipfs.on('stop', () => this.trigger('stop'));
        this.ipfs.on('error', () => this.trigger('error'));
    }

    onReady(callback: (sender: Node) => void) {
        super.register('ready', callback);
    }

    onInit(callback: (sender: Node) => void) {
        super.register('init', callback);
    }

    onStart(callback: (sender: Node) => void) {
        super.register('start', callback);
    }

    onStop(callback: (sender: Node) => void) {
        super.register('stop', callback);
    }

    onError(callback: (sender: Node) => void) {
        super.register('error', callback);
    }

    async publish(topic: string, data: Buffer) {
        return await this.ipfs.pubsub.publish(topic, data);
    }

    async subscribe(topic: string, handler: (msg: Buffer) => void) {
        return await this.ipfs.pubsub.subscribe(topic, handler);
    }

    unsubscribe(topic: string, handlerToRemove: any) {
        this.ipfs.pubsub.unsubscribe(topic, handlerToRemove);
    }
}