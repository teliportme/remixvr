import React, { Component, lazy, Suspense } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './containers/Home';
import { inject, observer } from 'mobx-react';
import LoadingSpinner from './components/LoadingSpinner';
const Header = lazy(() => import('./components/Header'));

const AsyncHeader = props => (
  <React.Suspense fallback={<div />}>
    <Header {...props} />
  </React.Suspense>
);

const DefaultLayout = inject('commonStore')(
  observer(({ commonStore, ...rest }) => (
    <React.Fragment>
      <AsyncHeader />
      <Route {...rest} />
    </React.Fragment>
  ))
);

// const App = inject("userStore", "commonStore")
class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <Suspense fallback={<LoadingSpinner />}>
          <div className="App w-100 center h-100 flex flex-column">
            <Switch>
              <DefaultLayout path="/" component={Home} />
            </Switch>
          </div>
        </Suspense>
      </BrowserRouter>
    );
  }
}

export default App;
