import React, { createElement } from 'react';

import { useRouterHistory } from 'react-router';
import createHashHistory from 'history/lib/createHashHistory';

import { GuidePage, GuideSection } from './components';

import { EuiErrorBoundary } from '../../src/components';

import { ArtistDetailView } from './views/artist/artist_detail';

import { Changelog } from './views/package/changelog';

import { I18nTokens } from './views/package/i18n_tokens';


/**
 * Lowercases input and replaces spaces with hyphens:
 * e.g. 'GridView Example' -> 'gridview-example'
 */
export const slugify = str => {
  const parts = str
    .toLowerCase()
    .replace(/[-]+/g, ' ')
    .replace(/[^\w^\s]+/g, '')
    .replace(/ +/g, ' ')
    .split(' ');
  return parts.join('-');
};

const createExample = example => {
  if (!example) {
    throw new Error(
      'One of your example pages is undefined. This usually happens when you export or import it with the wrong name.'
    );
  }

  const { title, intro, sections, beta } = example;
  sections.forEach(section => {
    section.id = slugify(section.title || title);
  });

  const renderedSections = sections.map(section =>
    createElement(GuideSection, {
      key: section.title || title,
      ...section,
    })
  );

  const component = () => (
    <EuiErrorBoundary>
      <GuidePage title={title} intro={intro} isBeta={beta}>
        {renderedSections}
      </GuidePage>
    </EuiErrorBoundary>
  );

  return {
    name: title,
    component,
    sections,
  };
};

const navigation = [
  {
    name: 'Playlists',
    items: [
      {
        name: 'Cool stuff',
        component: ArtistDetailView,
      },
      {
        name: 'Fun stuff',
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
