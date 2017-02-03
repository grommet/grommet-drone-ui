import React from 'react';
import { Router, browserHistory as history } from 'react-router';
import { IntlProvider, addLocaleData } from 'react-intl';
import en from 'react-intl/locale-data/en';
import { getCurrentLocale, getLocaleData } from 'grommet/utils/Locale';
import { Provider } from 'react-redux';
import { addSession, initialize } from './actions/session';
import { getUser } from './api/session';
import store from './store';
import routes from './routes';

const locale = getCurrentLocale();
addLocaleData(en);
let messages;
try {
  messages = require(`./messages/${locale}`);
} catch (e) {
  messages = require('./messages/en-US');
}
const localeData = getLocaleData(messages, locale);

store.dispatch(initialize());

if (process.env.NODE_ENV === 'development') {
  getUser().then((response) => {
    if (response.ok) {
      const token = response.headers.get('x-csrf-token');
      response.json().then(user => store.dispatch(addSession({ token, user })));
    }
  });
}

export default () => (
  <Provider store={store}>
    <IntlProvider locale={localeData.locale} messages={localeData.messages}>
      <Router routes={routes} history={history}
        onUpdate={() => document.getElementById('content').focus()} />
    </IntlProvider>
  </Provider>
);
