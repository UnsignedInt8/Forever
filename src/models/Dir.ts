import IPFSFile from './File';
import StorageItem from './StorageItem';

interface IPFSDir extends StorageItem {
    parentId?: string;
    files: IPFSFile[];
    dirs: IPFSDir[];
};

export default IPFSDir;