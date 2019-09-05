import React, { lazy, Suspense, useContext, useEffect } from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { autorun } from 'mobx';
import ReactNotification from 'react-notifications-component';
import 'react-notifications-component/dist/theme.css';
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
const AddOrganization = lazy(() => import('./containers/AddOrganization'));
const Dashboard = lazy(() => import('./containers/Dashboard'));
const ProjectEdit = lazy(() => import('./containers/ProjectEdit'));
const CreateProject = lazy(() => import('./containers/CreateProject'));
const ProjectView = lazy(() => import('./containers/ProjectView'));
const ProjectDetail = lazy(() => import('./containers/ProjectDetail'));
const Expo2020 = lazy(() => import('./containers/Expo2020'));
const GCEDDashboard = lazy(() => import('./containers/GCEDDashboard'));
const ActivityTypes = lazy(() => import('./containers/ActivityTypes'));
const CreateClassroom = lazy(() => import('./containers/CreateClassroom'));
const SessionsPage = lazy(() => import('./containers/SessionsPage'));
const CreateActivity = lazy(() => import('./containers/CreateActivity'));
const Submissions = lazy(() => import('./containers/Submissions'));
const UploadSubmission = lazy(() => import('./containers/UploadSubmission'));
const SubmissionViewer = lazy(() => import('./containers/SubmissionViewer'));
const ReactToActivities = lazy(() => import('./containers/ReactToActivities'));
const Reactions = lazy(() => import('./containers/ReactionsPage'));
const GCEDLanding = lazy(() => import('./containers/GCEDLanding'));
const SignupGCEDClass = lazy(() => import('./containers/SignupGCEDClass'));
const SignupGCEDActivities = lazy(() =>
  import('./containers/SignupGCEDActivities')
);

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

  useEffect(() => {
    if (commonStore.token) {
      userStore.pullUser().finally(() => commonStore.setAppLoaded());
    } else {
      commonStore.setAppLoaded();
    }
  }, [commonStore]);

  return (
    <React.Fragment>
      {commonStore.appLoaded && userStore.currentUser ? (
        <React.Fragment>
          <AsyncHeader />
          <Route {...props} />
        </React.Fragment>
      ) : (
        commonStore.appLoaded && (
          <Redirect to={`/login?to=${props.location.pathname}`} />
        )
      )}
    </React.Fragment>
  );
});

const App = () => {
  const commonStore = useContext(CommonStore);

  let notificationDOMRef = React.createRef();

  autorun(() => {
    if (commonStore.snackMessage.message !== null) {
      notificationDOMRef.current &&
        notificationDOMRef.current.addNotification(commonStore.snackMessage);
      commonStore.setSnackMessage();
    }
  });

  return (
    <CustomBrowsingRouter>
      <Suspense fallback={<LoadingSpinner />}>
        <div className="App w-100 center h-100 flex flex-column bt">
          <ReactNotification ref={notificationDOMRef} />
          <MetaTags />
          <Switch>
            <DefaultLayout path="/signup" component={withTracker(Signup)} />
            <DefaultLayout path="/login" component={withTracker(Login)} />
            <PrivateRoute
              path="/add-org"
              component={withTracker(AddOrganization)}
            />
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
            <PrivateRoute
              path="/gced-signup-class"
              component={withTracker(SignupGCEDClass)}
            />
            <PrivateRoute
              path="/create-classroom"
              component={withTracker(CreateClassroom)}
            />
            <PrivateRoute
              path="/classroom/:classSlug/create-activity"
              component={withTracker(CreateActivity)}
            />
            <PrivateRoute
              path="/gced-signup-create-bubble/classroom/:classSlug"
              component={withTracker(SignupGCEDActivities)}
            />
            <PrivateRoute
              path="/classroom/:classSlug/react-activity"
              component={withTracker(ReactToActivities)}
            />
            <Route path="/expo2020" component={withTracker(Expo2020)} />
            <PrivateRoute
              path="/gced-dashboard"
              component={withTracker(GCEDDashboard)}
            />
            <PrivateRoute
              path="/classroom/:classSlug/sessions"
              component={withTracker(SessionsPage)}
            />
            <PrivateRoute
              path="/classroom/:classSlug/activity/:code/reactions"
              component={withTracker(Reactions)}
            />
            <PrivateRoute
              path="/classroom/:classSlug/activity/:code"
              component={withTracker(Submissions)}
            />
            <DefaultLayout
              path="/activity/submit"
              component={withTracker(UploadSubmission)}
            />
            <Route
              path="/activity/view"
              component={withTracker(SubmissionViewer)}
            />
            <DefaultLayout
              path="/activities"
              component={withTracker(ActivityTypes)}
            />
            <DefaultLayout path="/gced" component={withTracker(GCEDLanding)} />
            <DefaultLayout exact path="/" component={withTracker(Home)} />
            <DefaultLayout component={withTracker(Page404)} />
          </Switch>
        </div>
      </Suspense>
    </CustomBrowsingRouter>
  );
};

export default App;
