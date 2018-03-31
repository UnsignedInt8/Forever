import * as React from 'react';
import { Player } from 'video-react';
import IPFSLink from '../lib/IPFSLink';

interface VideoProps {
    ipfsHash?: string;
}

export default class VideoPreview extends React.Component<VideoProps, any> {

    render() {
        return (
            <div>
                <Player>
                    <source src={IPFSLink.getIPFSLink(this.props.ipfsHash)} />
                </Player>
            </div>
        );
    }
}