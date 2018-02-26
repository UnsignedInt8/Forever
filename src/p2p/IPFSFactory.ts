
import Node from './Node';
import FileSystem from './FileSystem';

let node: Node;
let filesystem: FileSystem;

export async function getNode(repo?: string) {
    if (node) return node;

    return new Promise<Node>((resolve, reject) => {
        node = new Node(repo);
        node.onReady(() => resolve(node));
        setTimeout(() => reject(), 60 * 1000);
    });
}

export async function getFs(dbAddress?: string) {
    if (filesystem) return filesystem;
    if (!node) await getNode();

    return new Promise<FileSystem>(async (resolve, reject) => {
        filesystem = new FileSystem(node.ipfs, dbAddress);
        await filesystem.load();
        resolve(filesystem);
    });
}