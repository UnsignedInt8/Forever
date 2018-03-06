import * as React from 'react';
import { Layout, Menu, Icon, Row, Button } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { Box } from 'react-feather';
import lang from '../i18n';
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import { Disk } from './Disk';
import { Test } from './Test';
import NetworkManager from '../p2p/NetworkManager';
import About from './About';
import * as kinq from 'kinq';

interface HomeStates {
    contentMarginLeft: number;
    listType: 'all' | 'videos' | 'music' | 'images';
    selectedMenuItem: Map<string, boolean>
}

class App extends React.Component<{}, HomeStates> {

    private silder: React.Component;
    private home: Disk;

    constructor(props: any, ctx: any) {
        super(props, ctx);
        this.state = { contentMarginLeft: 200, listType: 'all', selectedMenuItem: new Map([['files', true], ['about', false]]) };
    }

    onFileMenuClick(tag: string, listType?: 'all' | 'music' | 'videos' | 'images') {
        kinq.toLinqable(this.state.selectedMenuItem.keys()).each(k => this.state.selectedMenuItem.set(k, false));
        console.log(this.state.selectedMenuItem);
        this.state.selectedMenuItem.set(tag, true);
        this.setState({ listType: listType }, () => this.home.refreshCurrentDir());
    }

    render() {
        return (
            <Layout>
                <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, zIndex: 2 }} collapsible={true} breakpoint="md" onCollapse={(collapsed, type) => this.setState({ contentMarginLeft: collapsed ? 80 : 200 })}>
                    <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', marginLeft: 24, marginTop: 16, marginBottom: 8, color: 'white' }}>
                        <Box color='white' size={32} />
                        <div className='logo' style={{ display: `${this.state.contentMarginLeft === 200 ? 'inline-block' : 'none'}`, cursor: 'default' }}>Forever</div>
                    </div>
                    <Menu theme="dark" mode="inline" defaultSelectedKeys={['all']}>
                        <Menu.Item key="all">
                            <div onClick={e => this.onFileMenuClick('files', 'all')}>
                                <Icon type="hdd" />
                                <span className="nav-text">{lang.siders.all}</span>
                            </div>
                        </Menu.Item>
                        <Menu.Item key="videos">
                            <div onClick={e => this.onFileMenuClick('files', 'videos')}>
                                <Icon type="video-camera" />
                                <span className="nav-text">{lang.siders.videos}</span>
                            </div>
                        </Menu.Item>
                        <Menu.Item key="music">
                            <div onClick={e => this.onFileMenuClick('files', 'music')}>
                                <Icon type="play-circle-o" />
                                <span className="nav-text">{lang.siders.music}</span>
                            </div>
                        </Menu.Item>
                        <Menu.Item key="pictures">
                            <div onClick={e => this.onFileMenuClick('files', 'images')}>
                                <Icon type="picture" />
                                <span className="nav-text">{lang.siders.pictures}</span>
                            </div>
                        </Menu.Item>
                        <Menu.Item key="settings">
                            <Icon type="setting" />
                            <span className="nav-text">{lang.siders.settings}</span>
                        </Menu.Item>
                        <Menu.Item key="info">
                            <div onClick={e => this.onFileMenuClick('about')}>
                                <Icon type="info" />
                                <span className="nav-text">{lang.siders.about}</span>
                            </div>
                        </Menu.Item>
                    </Menu>
                </Sider>

                <Layout style={{ marginLeft: this.state.contentMarginLeft, }}>
                    <Header style={{ background: '#101529', padding: 0, height: 60, position: 'fixed', width: '100%', top: 0, right: 0, zIndex: 1 }}>
                        <Row type='flex' justify='end' style={{}}>
                            <a className='social-icon' href="https://twitter.com/UnsignedInt8" target='_blank'><Icon type='twitter' /></a>
                            <a className='social-icon' href="https://github.com/unsignedint8/forever" target='_blank'><Icon type='github' /></a>
                        </Row>
                    </Header>
                    <Content style={{ margin: '60px 0 0 0', overflow: 'initial', height: '100%', minHeight: `${window.innerHeight - 92}px`, }}>
                        <div style={{ background: '#fff', minHeight: `${window.innerHeight - 92}px`, position: 'relative' }}>
                            <Disk ref={e => this.home = e} list={this.state.listType} style={{ position: 'absolute', top: 0, display: `${this.state.selectedMenuItem.get('files') ? 'block' : 'none'}` }} />
                            <About style={{ position: 'absolute', top: 0, display: `${this.state.selectedMenuItem.get('about') ? 'block' : 'none'}` }} />
                        </div>
                    </Content>
                    <Footer style={{ textAlign: 'center', fontSize: 10, fontWeight: 100, padding: '10px 0 8px' }}>
                        Forever, built on IPFS
                </Footer>
                </Layout>
            </Layout >
        );
    }
}

export default App;
