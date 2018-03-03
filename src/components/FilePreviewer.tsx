import * as React from 'react';

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
            <div style={this.props.style} id='filepreview'></div>
        );
    }
}