import React, { Component, Fragment, useState } from 'react';
import { times } from '../../../../src/services/utils';
import {
  EuiHealth,
  EuiCallOut,
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlexGrid,
  EuiImage,
  EuiCard,
  EuiTitle,
  EuiSwitch,
  EuiBasicTable,
  EuiSearchBar,
  SearchResultsGrid,
} from '../../../../src/components';

const scrobblerURL = 'http://ws.audioscrobbler.com/2.0/';

const LFapiKey = '946a0b231980d52f90b8a31e15bccb16';

let artists = query => {
  return fetch(`${scrobblerURL}?method=artist.search&api_key=${LFapiKey}&limit=6&format=json&artist=${query}`)
  .then(response => response.json())
}

let songs = query => {
  return fetch(`${scrobblerURL}?method=track.search&api_key=${LFapiKey}&limit=6&format=json&track=${query}`)
  .then(response => response.json())
}

let albums = query => {
  return fetch(`${scrobblerURL}?method=album.search&api_key=${LFapiKey}&limit=6&format=json&album=${query}`)
  .then(response => response.json())
}

// let toptracks = artist => {
//   return fetch(`${scrobblerURL}?method=artist.gettoptracks&autocorrect=1&api_key=${LFapiKey}&limit=40&format=json&artist=${artist}`) //&callback=response
//   .then(response => response.json())
// }

const initialQuery = EuiSearchBar.Query.MATCH_ALL;

export class HomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: {},
      results: {
          artists: [],
          songs: [],
          albums: [],
      },
      error: null,
      incremental: true,
    };
  }

  onChange = ({ query, error }) => {
    if (query.text == '') {
        this.setState({
            results: {
                artists: [],
                songs: [],
                albums: [],
            }
        });
        return;
    }

    if (error) {
        this.setState({ error });
    } else {
        console.log(this.state);
        let q = query.text
        let combinedData = {"artists":{},"songs":{},"albums":{}};
        Promise.all([artists(q),songs(q),albums(q)]).then(values => {
            combinedData["artists"] = values[0].results.artistmatches.artist;
            combinedData["songs"] = values[1].results.trackmatches.track;
            combinedData["albums"] = values[2].results.albummatches.album;
            // combinedData["toptracks"] = values[3].toptracks.track.map(track => track.name);
            this.setState({
              error: null,
              query,
              results: combinedData,
            });
        });
    }
  };

  // toggleIncremental = () => {
  //   this.setState(prevState => ({ incremental: !prevState.incremental }));
  // };

  renderSearchBar() {
    const { incremental } = this.state;
    return (
      <EuiSearchBar
        defaultQuery={initialQuery}
        box={{
          placeholder: 'Artist, song, or album',
          incremental,
          // schema,
        }}
        // filters={filters}
        onChange={this.onChange}
      />
    );
  }

  renderError() {
    const { error } = this.state;
    if (!error) {
      return;
    }
    return (
      <Fragment>
        <EuiCallOut
          iconType="faceSad"
          color="danger"
          title={`Invalid search: ${error.message}`}
        />
        <EuiSpacer size="l" />
      </Fragment>
    );
  }

  render() {
    const { incremental, query } = this.state;

    // let esQueryDsl;
    // let esQueryString;
    //
    // try {
    //   esQueryDsl = EuiSearchBar.Query.toESQuery(query);
    // } catch (e) {
    //   esQueryDsl = e.toString();
    // }
    // try {
    //   esQueryString = EuiSearchBar.Query.toESQueryString(query);
    // } catch (e) {
    //   esQueryString = e.toString();
    // }

    // const content = this.renderError() ||
    //TODO make ResultsGrid component work
    const content = (query.text == '') || (
        <Fragment>
            <EuiFlexGroup gutterSize="none">
               <EuiFlexItem grow={false}>
                 <div>Artists</div>
                 <EuiSpacer />
                 <EuiFlexGrid columns={4} gutterSize="m">
                    {this.state.results.artists.map((item,key) => (
                       <EuiFlexItem key={key}>
                           <EuiImage
                               size="m"
                               hasShadow
                               caption={item.name}
                               alt={item.name}
                               url={item.image[2]["#text"]}
                             />
                       </EuiFlexItem>
                   ))}
                 </EuiFlexGrid>
               </EuiFlexItem>
               <EuiFlexItem grow={false}>
                 <div>Songs</div>
                 <EuiSpacer />
                 <EuiFlexGrid columns={4} gutterSize="m">
                     {this.state.results.songs.map((item,key) => (
                        <EuiFlexItem key={key}>
                            <EuiImage
                                size="m"
                                hasShadow
                                caption={item.name}
                                alt={item.name}
                                url={item.image[2]["#text"]}
                              />
                        </EuiFlexItem>
                    ))}
                 </EuiFlexGrid>
               </EuiFlexItem>
            </EuiFlexGroup>
            <EuiFlexGroup gutterSize="none">
               <EuiFlexItem grow={false}>
                 <div>Albums</div>
                 <EuiSpacer />
                 <EuiFlexGrid columns={4} gutterSize="s">
                     {this.state.results.albums.map((item,key) => (
                         <EuiFlexItem key={key}>
                             <EuiImage
                                 size="m"
                                 hasShadow
                                 caption={item.name}
                                 alt={item.name}
                                 url={item.image[2]["#text"]}
                               />
                         </EuiFlexItem>
                    ))}
                 </EuiFlexGrid>
               </EuiFlexItem>
            </EuiFlexGroup>
        </Fragment>
    );


    return (
      <Fragment>
        <EuiSpacer size="s" />
        <EuiFlexGroup alignItems="center">
          <EuiFlexItem>{this.renderSearchBar()}</EuiFlexItem>
        </EuiFlexGroup>
        <EuiSpacer size="l" />
        <EuiFlexGroup alignItems="center">
          <EuiFlexItem>{content}</EuiFlexItem>
        </EuiFlexGroup>
      </Fragment>

    );
  }
}
// <SearchResultsGrid
//   results={this.state.results}
// />
