import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { syncHistoryWithStore } from 'react-router-redux';

import configureStore from './store/configure_store';

import { AppContainer } from './views/app_container';
import { HomeView } from './views/home/home_view';
import { NotFoundView } from './views/not_found/not_found_view';
import { ArtistDetailView } from './views/artist/artist_detail';

import { registerTheme } from './services';

import Routes from './routes';
import themeDark from './theme_dark.scss';
import themeLight from './theme_light.scss';

registerTheme('dark', [themeDark]);

registerTheme('light', [themeLight]);

// Set up app

const store = configureStore();
const routerHistory = syncHistoryWithStore(Routes.history, store);

const childRoutes = [].concat(Routes.getAppRoutes());
childRoutes.push({
  path: '/artist/:artistName',
  component: ArtistDetailView,
  name: 'artist',
},
{
  path: '*',
  component: NotFoundView,
  name: 'Page Not Found',
},);

const routes = [
  {
    path: '/',
    component: AppContainer,
    indexRoute: {
      component: HomeView,
      source: 'views/home/HomeView',
    },
    childRoutes,
  },
];

// Update document title with route name.
const onRouteEnter = route => {
  const leafRoute = route.routes[route.routes.length - 1];
  document.title = leafRoute.name
    ? `Standoffish Music Player - ${leafRoute.name}`
    : 'Standoffish Music Player';
};

const syncTitleWithRoutes = routesList => {
  if (!routesList) return;
  routesList.forEach(route => {
    route.onEnter = onRouteEnter; // eslint-disable-line no-param-reassign
    if (route.indexRoute) {
      // Index routes have a weird relationship with their "parent" routes,
      // so it seems we need to give their own onEnter hooks.
      route.indexRoute.onEnter = onRouteEnter; // eslint-disable-line no-param-reassign
    }
    syncTitleWithRoutes(route.childRoutes);
  });
};

syncTitleWithRoutes(routes);

ReactDOM.render(
  <Provider store={store}>
    <Router history={routerHistory} routes={routes} />
  </Provider>,
  document.getElementById('guide')
);
