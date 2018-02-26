import * as React from 'react';
import { Layout, Menu, Icon, Row, Button } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { Box } from 'react-feather';
import lang from './i18n';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import './App.scss';
import { Home } from './pages/Home';
import { Test } from './pages/Test';

class App extends React.Component<{}, {}> {

  private silder: React.Component;

  constructor(props: any, ctx: any) {
    super(props, ctx);
  }

  render() {
    return (
      <Router>
        <div>
          <Route exact path="/" component={Home} />
          <Route exact path="/home" component={Home} />
          <Route path='/test' component={Test} />
        </div>
      </Router>
    );
  }
}

export default App;
