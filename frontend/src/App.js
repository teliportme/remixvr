import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './containers/Home';
import { inject, observer } from 'mobx-react';
import Header from './components/Header';
// import './App.css';

const DefaultLayout = inject("commonStore")(observer(({ commonStore, ...rest }) => (
  <React.Fragment>
    <Header />
      <Route { ...rest} />
  </React.Fragment>
)));

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App w-100 center h-100 flex flex-column">
          <Switch>
            <DefaultLayout path="/" component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
