import * as React from 'react';
import IPFSLink from '../lib/IPFSLink';

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
                <audio autoPlay controls src={IPFSLink.getIPFSLink(this.props.ipfsHash)} style={{ width: '100%' }} />
            </div>
        );
    }
}