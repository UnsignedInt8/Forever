import * as React from 'react';
import { Player } from 'video-react';

interface VideoProps {
    ipfsHash?: string;
}

export default class VideoPreview extends React.Component<VideoProps, any> {

    render() {
        return (
            <div>
                <Player>
                    <source src={`https://ipfs.io/ipfs/${this.props.ipfsHash}`} />
                </Player>
            </div>
        );
    }
}