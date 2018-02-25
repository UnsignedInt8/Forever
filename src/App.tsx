import * as React from 'react';
import { Layout, Menu, Icon } from 'antd';
const { Header, Content, Footer, Sider } = Layout;
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';
import { Home } from './pages/Home';

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
        </div>
      </Router>
    );
  }
}

export default App;
