import * as React from 'react';
import { Layout, Menu, Icon, Row, Button, Input } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
const Search = Input.Search;
import lang from '../i18n';

interface HomeStates {
    contentMarginLeft: number;
}

export class Home extends React.Component<{}, HomeStates> {

    mobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)

    constructor(props: any, ctx: any) {
        super(props, ctx);
        this.state = { contentMarginLeft: 200 };
    }

    render() {
        return (
            <div>
                <Row style={{ padding: '10px 12px', }} type='flex' justify='space-between'>
                    <div style={{ display: `${this.mobileDevice ? 'none' : undefined}` }}>
                        <Button className='action_button' icon='upload' type='primary'>{lang.buttons.upload}</Button>
                        <Button className='action_button' icon='folder-add'>{lang.buttons.newfolder}</Button>
                    </div>

                    <div></div>

                    <Search
                        className='search_box'
                        placeholder="input search text"
                        onSearch={value => console.log(value)}
                        style={{ width: 200, }}
                    />
                </Row>
            </div>
        );
    }
}