
import Node from './Node';
import FileSystem from './FileSystem';

export default class NetworkManager {

    static node: Node;
    static filesystem: FileSystem;
    static ready = false;

    private static subscribers: Function[] = [];

    static async init() {
        await NetworkManager.getFs();
    }

    static async getNode(repo?: string) {
        if (NetworkManager.node) return NetworkManager.node;

        return new Promise<Node>((resolve, reject) => {
            NetworkManager.node = new Node(repo);

            NetworkManager.node.onReady(() => {
                resolve(NetworkManager.node);
                NetworkManager.ready = true;
                NetworkManager.subscribers.forEach(s => s());
            });

            NetworkManager.node.onError(() => {
                NetworkManager.ready = false;
                NetworkManager.subscribers.forEach(s => s());
            });

            setTimeout(() => reject(), 60 * 1000);
        });
    }

    static async getFs(dbAddress?: string) {
        if (NetworkManager.filesystem) return NetworkManager.filesystem;
        if (!NetworkManager.node) await NetworkManager.getNode();

        return new Promise<FileSystem>(async (resolve, reject) => {
            NetworkManager.filesystem = new FileSystem(NetworkManager.node.ipfs, dbAddress);
            await NetworkManager.filesystem.load();
            resolve(NetworkManager.filesystem);
        });
    }

    static onStateChanged(callback: Function) {
        NetworkManager.subscribers.push(callback);
    }

    static removeListener(callback: Function) {
        let index = NetworkManager.subscribers.indexOf(callback);
        if (index === -1) return;
        NetworkManager.subscribers.splice(index, 1);
    }
}