import React, { Component } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './containers/Home';
// import './App.css';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App w-100 center h-100 flex flex-column">
          <Switch>
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
