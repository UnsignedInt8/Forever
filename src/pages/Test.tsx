import * as React from 'react';
import { Upload, Icon, message } from 'antd';
const Dragger = Upload.Dragger;
import * as ipfstest from '../tests/IPFS';
import NetworkManager from '../p2p/NetworkManager';
import stream from 'stream';

const props = {
    name: 'file',
    multiple: true,
    action: '',
    onChange(info) {
        const status = info.file.status;
        if (status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (status === 'done') {
            message.success(`${info.file.name} file uploaded successfully.`);
        } else if (status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
    async customRequest(options: { action: string, data: any, file: File, filename: string, headers: any, onError: (err, ret) => void, onProgress: (e: { percent: number }) => void, onSuccess: (ret, xhr) => void, withCredentials: boolean }) {
        let fs = await NetworkManager.getFs();
        let node = await NetworkManager.getNode();
        fs.addFile(options.file, 'fe70c3e0-1aa1-11e8-9260-eda66082fe72', (offset, total) => { options.onProgress({ percent: offset / total * 100 }) })
            .catch((e) => options.onError(e, null))
            .then(files => {
                options.onSuccess(files, null);
                console.log(files);
            });

        console.log('customRequest', options);
    },
};

export class Test extends React.Component {

    async componentDidMount() {
        await ipfstest.testDirs();
    }

    render() {
        return (
            <div>
                <Dragger {...props}>
                    <p className="ant-upload-drag-icon">
                        <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">Click or drag file to this area to upload</p>
                    <p className="ant-upload-hint">Support for a single or bulk upload. Strictly prohibit from uploading company data or other band files</p>
                </Dragger>
            </div>
        );
    }
}