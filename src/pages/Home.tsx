import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { Box } from 'react-feather';

interface HomeStates {
    contentMarginLeft: number;
}

export class Home extends React.Component<{}, HomeStates> {

    constructor(props: any, ctx: any) {
        super(props, ctx);
        this.state = { contentMarginLeft: 200 };
    }

    render() {
        return (
            <Layout>
                <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }} collapsible={true} breakpoint="md" onCollapse={(collapsed, type) => this.setState({ contentMarginLeft: collapsed ? 80 : 200 })}>
                    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', marginLeft: 24, marginTop: 16, marginBottom: 4, color: 'white' }}>
                        <Box color='white' size={32} />
                        <div style={{ fontWeight: 100, fontSize: '20px', marginLeft: 20, marginTop: 2, display: `${this.state.contentMarginLeft === 200 ? 'inline-block' : 'none'}` }}>Forever</div>
                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                        <Menu.Item key="1">
                            <Icon type="hdd" />
                            <span className="nav-text">Files</span>
                        </Menu.Item>
                        <Menu.Item key="2">
                            <Icon type="video-camera" />
                            <span className="nav-text">Videos</span>
                        </Menu.Item>
                        <Menu.Item key="3">
                            <Icon type="play-circle-o" />
                            <span className="nav-text">Music</span>
                        </Menu.Item>
                        <Menu.Item key="4">
                            <Icon type="bar-chart" />
                            <span className="nav-text">nav 4</span>
                        </Menu.Item>
                        <Menu.Item key="5">
                            <Icon type="cloud-o" />
                            <span className="nav-text">nav 5</span>
                        </Menu.Item>
                        <Menu.Item key="6">
                            <Icon type="appstore-o" />
                            <span className="nav-text">nav 6</span>
                        </Menu.Item>
                        <Menu.Item key="7">
                            <Icon type="setting" />
                            <span className="nav-text">Settings</span>
                        </Menu.Item>
                        <Menu.Item key="8">
                            <Icon type="info" />
                            <span className="nav-text">About</span>
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Layout style={{ marginLeft: this.state.contentMarginLeft }}>
                    <Header style={{ background: '#fff', padding: 0 }} />
                    <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
                        <div style={{ padding: 24, background: '#fff', textAlign: 'center' }}>
                            ...
            <br />
                            Really
            <br />...<br />...<br />...<br />
                            long
            <br />...<br />...<br />...<br />...<br />...<br />...
            <br />...<br />...<br />...<br />...<br />...<br />...
            <br />...<br />...<br />...<br />...<br />...<br />...
            <br />...<br />...<br />...<br />...<br />...<br />...
            <br />...<br />...<br />...<br />...<br />...<br />...
            <br />...<br />...<br />...<br />...<br />...<br />...
            <br />...<br />...<br />...<br />...<br />...<br />
                            content
            </div>
                    </Content>
                    <Footer style={{ textAlign: 'center' }}>
                        Ant Design ©2016 Created by Ant UED
         </Footer>
                </Layout>
            </Layout>
        );
    }
}