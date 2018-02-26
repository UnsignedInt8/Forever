
type IPFSFile = {
    id: string; // IPFS CID
    title: string;
    type: string;
    dir: string; // Virtual Dir Id
    timestamp: number; // Javascript timestamp (millisecond)
    size: number; // bytes
};

export default IPFSFile;