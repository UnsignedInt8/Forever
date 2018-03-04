import * as React from 'react';

interface ImageProps {
    ipfsHash?: string;
    title?: string;
}

export default class ImagePreview extends React.Component<ImageProps, {}>{
    render() {
        return (
            <div style={{ paddingTop: 12 }}>
                <img style={{ width: '100%', }} src={`https://ipfs.io/ipfs/${this.props.ipfsHash}`} alt={this.props.title} />
            </div>
        );
    }
}