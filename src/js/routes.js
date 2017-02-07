import BuildView from './screens/BuildView';
import Dashboard from './screens/Dashboard';
import Main from './components/Main';
import ManageRepos from './screens/ManageRepos';
import NotFound from './screens/NotFound';
import RepoView from './screens/RepoView';

export default {
  path: '/',
  component: Main,
  indexRoute: { component: Dashboard },
  childRoutes: [
    { path: 'manage', component: ManageRepos },
    { path: ':owner/:name', component: RepoView },
    { path: ':owner/:name/build/:number', component: BuildView },
    { path: '*', component: NotFound }
  ]
};
