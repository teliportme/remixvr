import React, { lazy, Suspense, useContext, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import LoadingSpinner from './components/LoadingSpinner';
import CustomBrowsingRouter from './components/CustomBrowserRouter';
import MetaTags from './components/DefaultMetaTags';
import withTracker from './components/withTracker';
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
const ProjectDetail = lazy(() => import('./containers/ProjectDetail'));
const Expo2020 = lazy(() => import('./containers/Expo2020'));
const GCEDDashboard = lazy(() => import('./containers/GCEDDashboard'));
const ActivityTypes = lazy(() => import('./containers/ActivityTypes'));

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
        commonStore.appLoaded && <Redirect to={`/login?to=${props.path}`} />
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
            <DefaultLayout path="/signup" component={withTracker(Signup)} />
            <DefaultLayout path="/login" component={withTracker(Login)} />
            <PrivateRoute
              path="/dashboard"
              component={withTracker(Dashboard)}
            />
            <PrivateRoute
              path="/project/:slug/edit/s/:spaceId"
              component={withTracker(ProjectEdit)}
            />
            <Route
              path="/project/:slug/view"
              component={withTracker(ProjectView)}
            />
            <DefaultLayout
              path="/project/:slug"
              component={withTracker(ProjectDetail)}
            />
            <PrivateRoute
              path="/create"
              component={withTracker(CreateProject)}
            />
            <Route path="/expo2020" component={withTracker(Expo2020)} />
            <PrivateRoute
              path="/gced-dashboard"
              component={withTracker(GCEDDashboard)}
            />
            <DefaultLayout
              path="/activities"
              component={withTracker(ActivityTypes)}
            />
            <DefaultLayout exact path="/" component={withTracker(Home)} />
            <DefaultLayout component={withTracker(Page404)} />
          </Switch>
        </div>
      </Suspense>
    </CustomBrowsingRouter>
  );
};

export default App;
