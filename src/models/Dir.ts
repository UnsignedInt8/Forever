import IPFSFile from './File';

type IPFSDir = {
    id: string;
    title: string;
    parentId?: string;
    files: IPFSFile[];
}

export default IPFSDir;