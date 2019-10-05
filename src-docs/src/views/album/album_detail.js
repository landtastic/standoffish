import React, { Component, Fragment } from 'react';
import { Link } from 'react-router';
import { albumTracks } from '../../../../src/utils/api/fetch';
import { slugify } from '../../../../src/services/utils';
import {
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlexGrid,
  EuiImage,
  EuiText,
  EuiListGroup,
} from '../../../../src/components';

export class AlbumDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: {
          tracks: [],
          image: '',
      },
    };
    const urlParts = this.props.location.pathname.split('/');
    const lastTwo = urlParts.slice(-2);
    this.artistName = lastTwo[0].replace(/-/g, ' ');
    this.albumName = lastTwo[1].replace(/-/g, ' ');
  }

  componentDidMount() {
    const openPlayer = this.props.openPlayer;

    albumTracks(this.artistName, this.albumName).then(values => {
      const trackList = values.album.tracks.track.map(function(item,key) {
        return {
          label: item.name,
          onClick: () => openPlayer(`${item.artist.name} ${item.name}`),
          iconType: 'play',
          size: 's',
          wrapText: true,
        };
      });

      // const resultsObj = values.album.map(function(item,key) {
      //   return {
      //     artist: item.artist.name,
      //     name: item.name,
      //     tracks: item.tracks.track.name,
      //     image: item.image[5]['#text'],
      //   };
      // });

      this.setState({
        results: {
          artist: values.album.artist,
          name: values.album.name,
          tracks: values.album.tracks.track.name,
          image: values.album.image[5]['#text'],
        },
        trackList,
      });
      console.log(this.state);
    });
  }

  render() {
    return (
      this.state.results.length < 1 || (
        <Fragment>
          <EuiText>
            <h1 className="guideTitle">{this.state.results.artist} - {this.state.results.name}</h1>
          </EuiText>
          <EuiFlexGroup responsive={false}>
            <EuiFlexItem className="tracks">
              <EuiSpacer size="s" />
              <EuiListGroup
                flush={true}
                bordered={false}
                listItems={this.state.trackList}
              />
            </EuiFlexItem>

            <EuiFlexItem className="albumResults">
              <EuiSpacer size="s" />
              <EuiImage
                hasShadow
                size="fullWidth"
                style={{ maxWidth: 500 }}
                alt={this.state.results.name}
                url={this.state.results.image}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </Fragment>
      )
    );
  }
}
