import BuildView from './screens/BuildView';
import Dashboard from './screens/Dashboard';
import LogView from './screens/LogView';
import Main from './components/Main';
import ManageRepos from './screens/ManageRepos';
import NotFound from './screens/NotFound';
import RepoBadge from './screens/RepoBadge';
import RepoView from './screens/RepoView';
import RepoSettings from './screens/RepoSettings';

export default {
  path: '/',
  component: Main,
  indexRoute: { component: Dashboard },
  childRoutes: [
    { path: 'manage', component: ManageRepos },
    { path: ':owner/:name', component: RepoView },
    { path: ':owner/:name/settings', component: RepoSettings },
    { path: ':owner/:name/badges', component: RepoBadge },
    { path: ':owner/:name/build/:number', component: BuildView },
    { path: ':owner/:name/build/:number/:log', component: LogView },
    { path: '*', component: NotFound }
  ]
};
