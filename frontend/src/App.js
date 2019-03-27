import React, { Component, lazy, Suspense, useContext, useEffect } from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import LoadingSpinner from './components/LoadingSpinner';
import CustomBrowsingRouter from './components/CustomBrowserRouter';
import CommonStore from './stores/commonStore';
import UserStore from './stores/userStore';
const Header = lazy(() => import('./components/Header'));
const Home = lazy(() => import('./containers/Home'));
const Login = lazy(() => import('./containers/Login'));

const AsyncHeader = props => (
  <React.Suspense fallback={<div />}>
    <Header {...props} />
  </React.Suspense>
);

const DefaultLayout = observer(props => {
  const commonStore = useContext(CommonStore);
  return (
    <React.Fragment>
      <AsyncHeader />
      <Route {...props} />
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
    <CustomBrowsingRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="App w-100 center h-100 flex flex-column">
          <Switch>
            <DefaultLayout path="/login" component={Login} />
            <DefaultLayout path="/" component={Home} />
          </Switch>
        </div>
      </Suspense>
    </CustomBrowsingRouter>
  );
};

export default App;
