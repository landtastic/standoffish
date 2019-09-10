import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { EuiIcon } from '../icon';

import { EuiFlexGroup, EuiFlexItem, EuiFlexGrid } from '../flex';

export const SearchResultsGrid = ({ results, className, ...rest }) => {
  const classes = classNames('SearchResultsGrid', className);

  return (
      <Fragment>
          <EuiFlexGroup gutterSize="s" className={classes} {...rest}>
             <EuiFlexItem grow={false}>
               <div>Artist</div>
               <EuiSpacer />
               <EuiFlexGrid columns={1} gutterSize="s">
                   {results.map((item,key) => (
                     <EuiFlexItem key={key}>{item}</EuiFlexItem>
                   ))}
               </EuiFlexGrid>
             </EuiFlexItem>
             <EuiFlexItem grow={false}>
               <div>Song</div>
               <EuiSpacer />
               <EuiFlexGrid columns={4}>
                 <EuiFlexItem>Nested Grid One</EuiFlexItem>
                 <EuiFlexItem>Nested Grid Two</EuiFlexItem>
                 <EuiFlexItem>Nested Grid Three</EuiFlexItem>
                 <EuiFlexItem>Nested Grid Four</EuiFlexItem>
               </EuiFlexGrid>
             </EuiFlexItem>
           </EuiFlexGroup>
           // <EuiFlexGroup gutterSize="s">
           //    <EuiFlexItem grow={4}></EuiFlexItem>
           //    <EuiFlexItem grow={false}>
           //      <div>Album</div>
           //      <EuiSpacer />
           //      <EuiFlexGrid columns={4}>
           //        <EuiFlexItem>Nested Grid One</EuiFlexItem>
           //        <EuiFlexItem>Nested Grid Two</EuiFlexItem>
           //        <EuiFlexItem>Nested Grid Three</EuiFlexItem>
           //        <EuiFlexItem>Nested Grid Four</EuiFlexItem>
           //      </EuiFlexGrid>
           //    </EuiFlexItem>
           //  </EuiFlexGroup>
          </Fragment>
  );
};

SearchResultsGrid.propTypes = {
  results: PropTypes.node,
  className: PropTypes.string,
};
