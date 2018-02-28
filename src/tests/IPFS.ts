
import NetworkManager from '../p2p/NetworkManager';
import IPFSDir from '../models/Dir';

export async function testNode() {
    let node = await NetworkManager.getNode();
    console.log('node ready', node.ipfs)
}

export async function testfs() {
    let fs = await NetworkManager.getFs();
}

export async function testDirs() {
    let fs = await NetworkManager.getFs();
    let dirs = fs.listAllItems();
    let dir: IPFSDir;

    if (dirs.length === 0) {
        dir = await fs.mkdir('helloworld');
        console.log('mkdir: ', dir);
    }

    dirs = fs.listAllItems();
    console.log(dirs, dirs.length > 0);

    let checkdir = fs.getDir(dir ? dir.id : dirs[0].id);
    console.log('checkdir', checkdir, checkdir != null);

    checkdir.title = 'helloworld' + new Date().toLocaleTimeString();
    console.log('updatedir', await fs.updateDir(checkdir));
}