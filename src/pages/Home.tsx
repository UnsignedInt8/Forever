import * as React from 'react';
import { Layout, Menu, Icon, Row } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { Box } from 'react-feather';
import lang from '../i18n';

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
                <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, zIndex: 1 }} collapsible={true} breakpoint="md" onCollapse={(collapsed, type) => this.setState({ contentMarginLeft: collapsed ? 80 : 200 })}>
                    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', marginLeft: 24, marginTop: 16, marginBottom: 4, color: 'white' }}>
                        <Box color='white' size={32} />
                        <div style={{ fontWeight: 100, fontSize: '20px', marginLeft: 20, marginTop: 2, display: `${this.state.contentMarginLeft === 200 ? 'inline-block' : 'none'}` }}>Forever</div>
                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['4']}>
                        <Menu.Item key="files">
                            <Icon type="hdd" />
                            <span className="nav-text">{lang.siders.files}</span>
                        </Menu.Item>
                        <Menu.Item key="videos">
                            <Icon type="video-camera" />
                            <span className="nav-text">{lang.siders.videos}</span>
                        </Menu.Item>
                        <Menu.Item key="music">
                            <Icon type="play-circle-o" />
                            <span className="nav-text">{lang.siders.music}</span>
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
                        <Menu.Item key="settings">
                            <Icon type="setting" />
                            <span className="nav-text">{lang.siders.settings}</span>
                        </Menu.Item>
                        <Menu.Item key="info">
                            <Icon type="info" />
                            <span className="nav-text">{lang.siders.about}</span>
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Layout style={{ marginLeft: this.state.contentMarginLeft, }}>
                    <Header style={{ background: '#101529', padding: 0, height: 60, position: 'fixed', width: '100%', top: 0, right: 0, }} />
                    <Content style={{ margin: '84px 16px 0', overflow: 'initial', minHeight: `${window.innerHeight - 140}px`, }}>

                    </Content>
                    <Footer style={{ textAlign: 'center', fontSize: 10, fontWeight: 100 }}>
                        Forever, built on IPFS
                    </Footer>
                </Layout>
            </Layout >
        );
    }
}