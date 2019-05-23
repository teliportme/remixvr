import React, { lazy, Suspense, useContext, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import LoadingSpinner from './components/LoadingSpinner';
import CustomBrowsingRouter from './components/CustomBrowserRouter';
import MetaTags from './components/DefaultMetaTags';
import CommonStore from './stores/commonStore';
import UserStore from './stores/userStore';
const Header = lazy(() => import('./components/Header'));
const Home = lazy(() => import('./containers/Home'));
const Page404 = lazy(() => import('./containers/Page404'));
const Login = lazy(() => import('./containers/Login'));
const Signup = lazy(() => import('./containers/Signup'));
const Dashboard = lazy(() => import('./containers/Dashboard'));
const ProjectEdit = lazy(() => import('./containers/ProjectEdit'));
const CreateProject = lazy(() => import('./containers/CreateProject'));
const ProjectView = lazy(() => import('./containers/ProjectView'));

const AsyncHeader = props => (
  <React.Suspense fallback={<div />}>
    <Header {...props} />
  </React.Suspense>
);

const DefaultLayout = observer(props => {
  return (
    <React.Fragment>
      <AsyncHeader />
      <Route {...props} />
    </React.Fragment>
  );
});

const PrivateRoute = observer(props => {
  const commonStore = useContext(CommonStore);
  const userStore = useContext(UserStore);
  return (
    <React.Fragment>
      {commonStore.appLoaded && userStore.currentUser ? (
        <React.Fragment>
          <AsyncHeader />
          <Route {...props} />
        </React.Fragment>
      ) : (
        commonStore.appLoaded && <Redirect to="/404" />
      )}
    </React.Fragment>
  );
});

const App = () => {
  const commonStore = useContext(CommonStore);
  const userStore = useContext(UserStore);
  useEffect(() => {
    if (commonStore.token) {
      userStore.pullUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore]);

  return (
    <CustomBrowsingRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="App w-100 center h-100 flex flex-column bt bw2 b--blue">
          <MetaTags />
          <Switch>
            <DefaultLayout path="/signup" component={Signup} />
            <DefaultLayout path="/login" component={Login} />
            <DefaultLayout path="/dashboard" component={Dashboard} />
            <PrivateRoute path="/project/:slug/edit" component={ProjectEdit} />
            <Route path="/project/:slug/view" component={ProjectView} />
            <PrivateRoute path="/create" component={CreateProject} />
            <DefaultLayout exact path="/" component={Home} />
            <DefaultLayout component={Page404} />
          </Switch>
        </div>
      </Suspense>
    </CustomBrowsingRouter>
  );
};

export default App;
