import StorageItem from './StorageItem';

interface IPFSFile extends StorageItem {
    title: string;
    mime: string;
    dirId: string; // Virtual Dir Id
    timestamp: number; // Javascript timestamp (millisecond)
    size: number; // bytes
};

export default IPFSFile;