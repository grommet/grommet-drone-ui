import Main from './components/Main';
import Dashboard from './screens/Dashboard';
import NotFound from './screens/NotFound';
import ManageRepos from './screens/ManageRepos';
import RepoView from './screens/RepoView';

export default {
  path: '/',
  component: Main,
  indexRoute: { component: Dashboard },
  childRoutes: [
    { path: 'manage', component: ManageRepos },
    { path: ':owner/:name', component: RepoView },
    { path: '*', component: NotFound }
  ]
};
