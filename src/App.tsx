import * as React from 'react';
import { Layout, Menu, Icon, Row, Button } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { Box } from 'react-feather';
import lang from './i18n';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.scss';
import { Home } from './pages/Home';
import { Test } from './pages/Test';
import NetworkManager from './p2p/NetworkManager';

interface HomeStates {
  contentMarginLeft: number;
}

class App extends React.Component<{}, HomeStates> {

  private silder: React.Component;

  constructor(props: any, ctx: any) {
    super(props, ctx);
    this.state = { contentMarginLeft: 200 };
    NetworkManager.init();
  }

  render() {
    return (
      <Router>
        <Layout>
          <Sider style={{ overflow: 'auto', height: '100vh', position: 'fixed', left: 0, zIndex: 2 }} collapsible={true} breakpoint="md" onCollapse={(collapsed, type) => this.setState({ contentMarginLeft: collapsed ? 80 : 200 })}>
            <div style={{ display: 'flex', alignContent: 'center', justifyContent: 'flex-start', marginLeft: 24, marginTop: 16, marginBottom: 8, color: 'white' }}>
              <Box color='white' size={32} />
              <div className='logo' style={{ display: `${this.state.contentMarginLeft === 200 ? 'inline-block' : 'none'}` }}>Forever</div>
            </div>
            <Menu theme="dark" mode="inline" defaultSelectedKeys={['all']}>
              <Menu.Item key="all">
                <Icon type="hdd" />
                <span className="nav-text">{lang.siders.all}</span>
              </Menu.Item>
              <Menu.Item key="videos">
                <Icon type="video-camera" />
                <span className="nav-text">{lang.siders.videos}</span>
              </Menu.Item>
              <Menu.Item key="music">
                <Icon type="play-circle-o" />
                <span className="nav-text">{lang.siders.music}</span>
              </Menu.Item>
              {/* <Menu.Item key="4">
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
              </Menu.Item> */}
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
            <Header style={{ background: '#101529', padding: 0, height: 60, position: 'fixed', width: '100%', top: 0, right: 0, zIndex: 1 }} />
            <Content style={{ margin: '60px 0 0 0', overflow: 'initial', height: '100%', minHeight: `${window.innerHeight - 92}px`, }}>
              <div style={{ background: '#fff', minHeight: `${window.innerHeight - 92}px`, position: 'relative' }}>
                <Route exact path="/" component={Home} />
                <Route exact path="/home" component={Home} />
                <Route path='/test' component={Test} />
              </div>
            </Content>
            <Footer style={{ textAlign: 'center', fontSize: 10, fontWeight: 100, padding: '10px 0 8px' }}>
              Forever, built on IPFS
            </Footer>
          </Layout>
        </Layout >


      </Router>
    );
  }
}

export default App;
