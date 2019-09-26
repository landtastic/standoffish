import React, { Component, Fragment, useState } from 'react';
import { Link, Route } from 'react-router';
import { times } from '../../../../src/services/utils';
import {
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlexGrid,
  EuiListGroup,
  EuiImage,
  EuiTitle,
  EuiText,
  EuiHorizontalRule,
  EuiSearchBar,
  SearchResultsGrid,
} from '../../../../src/components';

const scrobblerURL = 'http://ws.audioscrobbler.com/2.0/';
const LFapiKey = '946a0b231980d52f90b8a31e15bccb16';
const discogsKey = 'key=eJhCgHcNJQgAdvtQiGfi&secret=AailmhUCMBAkvuggupoBQkncHPNuUbSw';

let artists = query => {
  return fetch(`https://api.discogs.com/database/search?&q=${query}~&type=artist&per_page=9&page=1&${discogsKey}`)
  // return fetch(`${scrobblerURL}?method=artist.search&api_key=${LFapiKey}&limit=6&format=json&artist=${query}`)
  // return fetch(`http://musicbrainz.org/ws/2/artist/?query=artist:${query}~&fmt=json`)
  // return fetch(`https://itunes.apple.com/search?term=${query}&limit=6`)
  .then(response => response.json())
}

let songs = query => {
  //return fetch(`https://api.discogs.com/database/search?&track=${query}&type=master&per_page=7&page=1&${discogsKey}`)
  return fetch(`${scrobblerURL}?method=track.search&api_key=${LFapiKey}&limit=30&format=json&track=${query}`)
  .then(response => response.json())
}

let albums = query => {
  return fetch(`${scrobblerURL}?method=album.search&api_key=${LFapiKey}&limit=9&format=json&album=${query}`)
  .then(response => response.json())
}

//TODO: componentize
const slugify = str => {
  const parts = str
    .toLowerCase()
    .replace(/[-]+/g, ' ')
    .replace(/[^\w^\s]+/g, '')
    .replace(/ +/g, ' ')
    .split(' ');
  return parts.join('-');
};

const initialQuery = EuiSearchBar.Query.MATCH_ALL;
// const schema = {
//   strict: false,
//   fields: {
//     query: {
//       type: 'string',
//     },
//     es: 'string',
//   },
// };

export class HomeView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      query: null,
      results: {
          artists: [],
          songs: [],
          albums: [],
      },
      songList: [],
      error: null,
      incremental: true,
    };
  }

  onChange = ({ query, error, queryText }) => {
    console.log(queryText);
    if (queryText == "") {
      this.emptyResults();
      return;
    }

    // if (error) {
    //     this.setState({ error });
    //     console.log(this.state.error);
    // } else {

        console.log(this.state);
        let q = queryText;
        let combinedData = {"artists":{},"songs":{},"albums":{}};
        Promise.all([artists(q),songs(q),albums(q)]).then(values => {
            combinedData["artists"] = values[0].results;//.artistmatches.artist;
            combinedData["songs"] = values[1].results.trackmatches.track;
            combinedData["albums"] = values[2].results.albummatches.album;
            // combinedData["toptracks"] = values[3].toptracks.track.map(track => track.name);
            this.setState({
              error: null,
              query,
              results: combinedData,
            });

            let songList = this.state.results.songs.map(function(item,key) {
              return {
                label: item.artist + ' - ' + item.name,
                href: 'https://www.youtube.com/results?search_query=' + item.artist + ' ' + item.name,
                iconType: 'play',
                size: 's',
              };
            });
            this.setState({
              songList: songList,
            });
        });
    // }
  };

  emptyResults() {
    this.setState({
        results: {
            artists: [],
            songs: [],
            albums: [],
        },
        songList: [],
    });
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
          //schema,
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
    const { incremental, query, queryText } = this.state;

    // const content = this.renderError() ||
    //TODO make ResultsGrid component work
    const content = (queryText == "") || (
        <Fragment>
            <EuiFlexGrid columns={3} responsive={false} gutterSize="m">
               <EuiFlexItem className="artistResults">
                 <EuiText><h6>Artists</h6></EuiText>
                 <EuiSpacer size="m" />
                 <EuiFlexGrid columns={2} gutterSize="m">
                 {this.state.results.artists.map((item,key) => (
                      <EuiFlexItem
                        key={key}
                        grow={key == 0 ? false : true}
                      >
                        <Link to={{
                          pathname: `artist/${slugify(item.title)}`,
                        }}>
                          <EuiImage
                              hasShadow
                              caption={item.title}
                              alt={item.title}
                              url={item.cover_image}
                            />
                        </Link>
                      </EuiFlexItem>
                 ))}
                 </EuiFlexGrid>
               </EuiFlexItem>

               <EuiFlexItem className="songResults">
                 <EuiText><h6>Songs</h6></EuiText>
                 <EuiSpacer size="m" />
                    <EuiListGroup
                       flush={true}
                       bordered={false}
                       listItems={this.state.songList}
                    />
               </EuiFlexItem>

               <EuiFlexItem className="albumResults">
                 <EuiText><h6>Albums</h6></EuiText>
                 <EuiSpacer size="m" />
                 <EuiFlexGrid  columns={2} gutterSize="m">
                     {this.state.results.albums.map((item,key) => (
                         <EuiFlexItem key={key}>
                             <EuiImage
                                 hasShadow
                                 caption={item.name}
                                 alt={item.name}
                                 url={item.image[3]["#text"]}
                               />
                         </EuiFlexItem>
                    ))}
                 </EuiFlexGrid>
               </EuiFlexItem>
            </EuiFlexGrid>
        </Fragment>
    );


    return (
      <Fragment>
        <EuiText><h1>{queryText == '' ? 'Search' : ''}</h1></EuiText>
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
