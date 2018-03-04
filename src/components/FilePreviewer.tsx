import * as React from 'react';
import AudioPreview from './AudioPreview';
import ImagePreview from './ImagePreview';
import VideoPreview from './VideoPreview';

interface FilePreviewerProps {
    mime?: string;
    name?: string;
    size?: number;
    ipfsHash?: string;
    style?: React.CSSProperties;
}

interface FilePreviewerStates {

}

export class FilePreviewer extends React.Component<FilePreviewerProps, FilePreviewerStates> {

    render() {
        const mime = this.props.mime || '';
        return (
            <div style={this.props.style}>
                {mime.startsWith('audio') ? <AudioPreview title={this.props.name} ipfsHash={this.props.ipfsHash} /> : undefined}
                {mime.startsWith('image') ? <ImagePreview title={this.props.name} ipfsHash={this.props.ipfsHash} /> : undefined}
                {mime.startsWith('video') ? <VideoPreview ipfsHash={this.props.ipfsHash} /> : undefined}
            </div>
        );
    }

    static readonly supportedTypes = [
        'audio/mpeg3', 'audio/mp3', 'audio/wav', 'audio/x-mpeg-3', 'audio/mpeg', 'audio/mp4', 'audio/ogg',
        'image/png', 'image/jpeg', 'image/pjpeg', 'image/gif', 'image/bmp',
        'video/mp4', 'video/mov', 'video/quicktime', 'video/mpeg', 'video/avi',
    ];

    static isSupported(mime: string) {
        return FilePreviewer.supportedTypes.indexOf(mime) > -1;
    }
}