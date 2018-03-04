import * as React from 'react';

interface AudioPreviewProps {
    title?: string;
    ipfsHash?: string;
}

interface AudioPreviewStates {

}

export default class AudioPreview extends React.Component<AudioPreviewProps, AudioPreviewStates> {

    render() {
        return (
            <div style={{ paddingTop: 20 }}>
                <div style={{ fontSize: 18, marginBottom: 12, textAlign: 'center' }}>{this.props.title || 'Music'}</div>
                <audio autoPlay controls src={`https://ipfs.io/ipfs/${this.props.ipfsHash}`} style={{ width: '100%' }} />
            </div>
        );
    }
}