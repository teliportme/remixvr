import React, { Component, lazy, Suspense, useContext, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import Home from './containers/Home';
import { observer } from 'mobx-react-lite';
import LoadingSpinner from './components/LoadingSpinner';
import CommonStore from './stores/commonStore';
import UserStore from './stores/userStore';
const Header = lazy(() => import('./components/Header'));

const AsyncHeader = props => (
  <React.Suspense fallback={<div />}>
    <Header {...props} />
  </React.Suspense>
);

const DefaultLayout = observer(({ ...rest }) => {
  const commonStore = useContext(CommonStore);
  return (
    <React.Fragment>
      <AsyncHeader />
      <Route {...rest} />
    </React.Fragment>
  );
});

const App = () => {
  const commonStore = useContext(CommonStore);
  const userStore = useContext(UserStore);
  useEffect(() => {
    if (commonStore.token) {
      userStore.pullUser().finally(() => commonStore.setAppLoaded());
    }
  });

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
};

export default App;
