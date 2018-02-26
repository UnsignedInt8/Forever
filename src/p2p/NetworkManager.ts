
import Node from './Node';
import FileSystem from './FileSystem';

export default class NetworkManager {

    static node: Node;
    static filesystem: FileSystem;

    static async getNode(repo?: string) {
        if (NetworkManager.node) return NetworkManager.node;

        return new Promise<Node>((resolve, reject) => {
            NetworkManager.node = new Node(repo);
            NetworkManager.node.onReady(() => resolve(NetworkManager.node));
            NetworkManager.node.onError(() => { });
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
}