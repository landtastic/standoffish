import React, { createElement } from 'react';

import { useRouterHistory } from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';

import { GuidePage, GuideSection } from './components';

import { EuiErrorBoundary } from '../../src/components';

import { ArtistDetailView } from './views/artist/artist_detail';

import { Changelog } from './views/package/changelog';

import { I18nTokens } from './views/package/i18n_tokens';

import { slugify } from '../../src/services/utils';

const navigation = [
  {
    name: 'Playlists',
    items: [
      {
        name: 'not yet',
        component: ArtistDetailView,
      },
      {
        name: 'implemented',
        component: ArtistDetailView,
      },
    ],
  },
  {
    name: 'Package',
    items: [Changelog, I18nTokens],
  },
].map(({ name, items, ...rest }) => ({
  name,
  type: slugify(name),
  items: items.map(({ name: itemName, ...rest }) => ({
    name: itemName,
    path: `${slugify(name)}/${slugify(itemName)}`,
    ...rest,
  })),
  ...rest,
}));

const allRoutes = navigation.reduce((accummulatedRoutes, section) => {
  accummulatedRoutes.push(...section.items);
  return accummulatedRoutes;
}, []);

export default {
  history: useRouterHistory(createHashHistory)(),
  navigation,

  getRouteForPath: path => {
    // React-router kinda sucks. Sometimes the path contains a leading slash, sometimes it doesn't.
    const normalizedPath = path[0] === '/' ? path.slice(1, path.length) : path;
    return allRoutes.find(route => normalizedPath === route.path);
  },

  getAppRoutes: function getAppRoutes() {
    return allRoutes;
  },

  getPreviousRoute: function getPreviousRoute(routeName) {
    const index = allRoutes.findIndex(item => {
      return item.name === routeName;
    });

    return index >= 0 ? allRoutes[index - 1] : undefined;
  },

  getNextRoute: function getNextRoute(routeName) {
    const index = allRoutes.findIndex(item => {
      return item.name === routeName;
    });

    return index < allRoutes.length - 1 ? allRoutes[index + 1] : undefined;
  },
};
