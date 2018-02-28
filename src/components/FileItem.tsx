import * as React from 'react';
import { Icon } from 'antd';

interface FileItemProps {
    name: string;
    type: 'dir' | 'file';
    mime?: string;
    data?: any;
    onClick?: (data: any) => void;
}

const mimes = {
    'folder': { icon: 'folder', color: 'darkorange' },
    'file': { icon: 'file', },
    'video/': { icon: 'video-camera', color: '#e51d53' },
    'audio/': { icon: 'play-circle', color: '#e51de2' },
    'application/pdf': { icon: 'file-pdf', },
    'application/msword': { icon: 'file-word', color: 'deepskyblue' },
    'image/': { icon: 'picture', color: 'limegreen' },
    'text/': { icon: 'file-text' },
}

export class FileItem extends React.Component<FileItemProps, any>{

    private onItemClick() {
        if (!this.props.onClick) return;
        this.props.onClick(this.props.data);
    }

    render() {
        let icon = this.props.mime && this.props.type === 'file' ? (mimes[this.props.mime] || (mimes[this.props.mime.split('/')[0] + '/'] || mimes['file'])) : mimes['folder'];

        return (
            <div>
                <Icon type={icon.icon} style={{ fontSize: 22, marginTop: 4, display: 'inline-block', color: icon.color }} />
                <div onClick={() => this.onItemClick()} style={{ display: 'inline-block', marginLeft: 12, fontSize: 14, marginTop: 4, position: 'absolute', cursor: 'pointer', }}>{this.props.name}</div>
            </div>
        );
    }
}