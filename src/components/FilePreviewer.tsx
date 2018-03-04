import * as React from 'react';
import AudioPreview from './AudioPreview';

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
        return (
            <div style={this.props.style}>
                <AudioPreview title={this.props.name} ipfsHash={this.props.ipfsHash} />
            </div>
        );
    }

    static readonly supportedTypes = ['audio/mpeg3', 'audio/mp3', 'audio/wav', 'audio/x-mpeg-3', 'audio/mpeg', 'audio/mp4', 'audio/ogg'];

    static isSupported(mime: string) {
        return FilePreviewer.supportedTypes.indexOf(mime) > -1;
    }
}