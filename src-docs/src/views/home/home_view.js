import React, { Component, Fragment } from 'react';
import { Link } from 'react-router';
import { artists, songs, albums } from '../../../../src/utils/api/fetch';
import { slugify } from '../../../../src/services/utils';
import {
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlexGrid,
  EuiListGroup,
  EuiImage,
  EuiText,
  EuiCallOut,
  EuiSearchBar,
} from '../../../../src/components';

const initialQuery = EuiSearchBar.Query.MATCH_ALL;

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
    };
  }

  onChange = ({ query, queryText, error, songList }) => {

    if (queryText == '') {
      this.emptyResults();
      return;
    }

    let combinedData = { artists:{}, songs:{}, albums:{} };
    Promise.all([ artists(queryText), songs(queryText), albums(queryText) ]).then(values => {
        combinedData.artists = values[0].results;
        combinedData.songs = values[1].results.trackmatches.track;
        combinedData.albums = values[2].results.albummatches.album;
        // combinedData["toptracks"] = values[3].toptracks.track.map(track => track.name);
        this.setState({
          results: combinedData,
          query,
        });

        const { openPlayer, currentIndex } = this.props;
        let songList = this.state.results.songs.map((item, key) => {
          return {
            key,
            artist: item.artist,
            song: item.name,
            label: `${item.artist} - ${item.name}`,
            onClick: () => {
              openPlayer(this.state.songList, key)
            },
            iconType: 'play',
            size: 's',
            wrapText: true,
          };
        });
        this.setState({
          songList: songList,
        });
    });
  };

  emptyResults() {
    this.setState({
        query: null,
        results: {
            artists: [],
            songs: [],
            albums: [],
        },
        songList: [],
    });
  };

  renderSearchBar() {
    return (
      <EuiSearchBar
        defaultQuery={initialQuery}
        box={{
          placeholder: 'Artist, song, or album',
          incremental: true,
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
    const { query, queryText, results, songList } = this.state;

    // const content = this.renderError() ||
    const content = (query == null) || (
        <Fragment>
            <EuiFlexGrid className="searchResults" columns={3} responsive={true} gutterSize="m">
               <EuiFlexItem className="artistResults">
                 <EuiText>
                    <h6>Artists</h6>
                 </EuiText>
                 <EuiSpacer size="m" />
                 <EuiFlexGrid columns={2} gutterSize="m">
                 {results.artists.map((item,key) => (
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
                 <EuiText>
                    <h6>Songs</h6>
                 </EuiText>
                 <EuiSpacer size="m" />
                    <EuiListGroup
                       flush={true}
                       bordered={false}
                       listItems={songList}
                    />
               </EuiFlexItem>

               <EuiFlexItem className="albumResults">
                 <EuiText>
                    <h6>Albums</h6>
                 </EuiText>
                 <EuiSpacer size="m" />
                 <EuiFlexGrid columns={2} gutterSize="m">
                     {results.albums.map((item,key) => (
                         <EuiFlexItem key={key}>
                             <Link to={{
                               pathname: `album/${slugify(item.artist)}/${slugify(item.name)}`,
                             }}>
                               <EuiImage
                                   hasShadow
                                   caption={`${item.artist} - ${item.name}`}
                                   alt={item.name}
                                   url={item.image[3]["#text"]}
                                 />
                              </Link>
                         </EuiFlexItem>
                    ))}
                 </EuiFlexGrid>
               </EuiFlexItem>
            </EuiFlexGrid>
        </Fragment>
    );


    return (
      <Fragment>
        <EuiText>
          <h1>{query == null ? 'Search' : ''}</h1>
        </EuiText>
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
