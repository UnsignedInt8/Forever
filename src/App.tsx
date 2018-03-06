import * as React from 'react';
import { Layout, Menu, Icon, Row, Button } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { BrowserRouter as Router, Route, Link, Switch } from 'react-router-dom';
import './App.scss';
import Container from './pages/Container';

class App extends React.Component<{}, {}> {

  constructor(props: any, ctx: any) {
    super(props, ctx);
  }

  render() {
    return (
      <Router>
        <Switch>
          <Route path='/' component={Container} />
        </Switch>
      </Router>
    );
  }
}

export default App;
