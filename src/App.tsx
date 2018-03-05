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
import Container from './pages/Container';

interface HomeStates {
  contentMarginLeft: number;
}

class App extends React.Component<{}, HomeStates> {

  private silder: React.Component;

  constructor(props: any, ctx: any) {
    super(props, ctx);
    this.state = { contentMarginLeft: 200 };
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path='/' component={Container} />
          <Route exact path='/files' component={Container} />
        </div>
      </Router>
    );
  }
}

export default App;
