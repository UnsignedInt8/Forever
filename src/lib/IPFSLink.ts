
export default class IPFSLink {

    static gateways = {
        'eternum': 'https://www.eternum.io/ipfs/',
        'ipfs': 'https://ipfs.io/ipfs/',
        'infura': 'https://ipfs.infura.io/ipfs/',
        'hle.rs': 'https://ipfs.wa.hle.rs/ipfs/',
        'siderus': 'https://siderus.io/ipfs/',
    };

    static getIPFSLink(hash: string, gateway = 'eternum') {
        return `${IPFSLink.gateways[gateway] || IPFSLink.gateways['ipfs']}${hash}`;
    }
}