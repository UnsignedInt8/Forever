import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
import * as ipfstest from '../tests/IPFS';

export class Test extends React.Component {

    async componentDidMount() {
        await ipfstest.testDirs();
    }

    render() {
        return (
            <div>
                d
            </div>
        );
    }
}