
import * as factory from '../p2p/IPFSFactory';

export async function testNode() {
    let node = await factory.getNode();
    console.log('node ready', node.ipfs)
}

export async function testfs() {
    let fs = await factory.getFs();
}