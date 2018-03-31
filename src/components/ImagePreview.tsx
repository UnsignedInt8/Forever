import * as React from 'react';
import ProgressiveImage from 'react-progressive-image';
import { Spin, Row, Icon } from 'antd';
import IPFSLink from '../lib/IPFSLink';

interface ImageProps {
    ipfsHash?: string;
    title?: string;
}

interface ImageStates {
    isLoading: boolean;
}

export default class ImagePreview extends React.Component<ImageProps, ImageStates>{

    constructor(props: ImageProps, ctx?: any) {
        super(props, ctx);
        this.state = { isLoading: true };
    }

    componentWillReceiveProps() {
        this.setState({ isLoading: true });
    }

    render() {
        return (
            <div style={{ paddingTop: 12, position: 'relative', textAlign: 'center' }}>
                <Icon type="loading" style={{ fontSize: 24, color: 'deepskyblue', display: `${this.state.isLoading ? 'inline-block' : 'none'}` }} spin />

                <ProgressiveImage src={IPFSLink.getIPFSLink(this.props.ipfsHash)} placeholder='' >
                    {(src) => <img style={{ width: '100%' }} src={src} alt='' onLoad={e => this.setState({ isLoading: false })} />}
                </ProgressiveImage>
            </div>
        );
    }
}