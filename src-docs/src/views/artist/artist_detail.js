import React, { Component, Fragment, useState } from 'react';
import { Link } from 'react-router';
import {
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiFlexGrid,
  EuiImage,
  EuiTitle,
  EuiText,
  EuiHorizontalRule,
  EuiListGroup,
} from '../../../../src/components';

const scrobblerURL = 'http://ws.audioscrobbler.com/2.0/';

const LFapiKey = '946a0b231980d52f90b8a31e15bccb16';
const discogsKey = 'key=eJhCgHcNJQgAdvtQiGfi&secret=AailmhUCMBAkvuggupoBQkncHPNuUbSw';

let artists = query => {
  return fetch(`https://api.discogs.com/database/search?&q=${query}&type=artist&per_page=7&page=1&key=eJhCgHcNJQgAdvtQiGfi&secret=AailmhUCMBAkvuggupoBQkncHPNuUbSw`)
  .then(response => response.json())
}

let artistsDetails = artistId => {
  return fetch(`https://api.discogs.com/artists/${artistId}/releases`)
  .then(response => response.json())
}

let albums = query => {
  return fetch(`${scrobblerURL}?method=artist.gettopalbums&api_key=${LFapiKey}&limit=50&format=json&artist=${query}`)
  .then(response => response.json())
}

let toptracks = artist => {
  return fetch(`${scrobblerURL}?method=artist.gettoptracks&autocorrect=1&api_key=${LFapiKey}&limit=50&format=json&artist=${artist}`) //&callback=response
  .then(response => response.json())
}

export class ArtistDetailView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      artistName: '...',
      results: {
          albums: [],
          toptracks: [],
      },
      toptrackList: [],
    }
  }

  componentDidMount() {
    let artistName = this.props.location.pathname.split('/').pop().replace(/-/g, " ");
    let combinedData = {"albums":{},"toptracks":{}};
    Promise.all([albums(artistName),toptracks(artistName)]).then(values => {
      combinedData["albums"] = values[0].topalbums.album;
      combinedData["toptracks"] = values[1].toptracks.track;
      this.setState({
        artistName: values[0].topalbums.album[0].artist.name,
        results: combinedData,
      });

      let toptrackList = this.state.results.toptracks.map(function(item,key) {
        return {
          label: item.name,
          href: 'https://www.youtube.com/results?search_query=' + item.artist.name + ' ' + item.name,
          iconType: 'play',
          size: 's',
        };
      });
      this.setState({
        toptrackList: toptrackList,
      });
      console.log(this.state);
    });

  }

  render() {

    return ((this.state.results.length < 1) || (
      <Fragment>
        <EuiText>
          <h1 className="guideTitle">{this.state.artistName}</h1>
        </EuiText>
        <EuiFlexGroup responsive={false}>

          <EuiFlexItem className="toptracksResults" grow={false}>
            <EuiSpacer size="s" />
            <EuiText>
              <h6>Top Songs</h6>
            </EuiText>
            <EuiSpacer size="m" />
            <EuiFlexGrid columns={1} gutterSize="s">
               <EuiListGroup
                  flush={true}
                  bordered={false}
                  listItems={this.state.toptrackList}
               />
            </EuiFlexGrid>
          </EuiFlexItem>

          <EuiFlexItem className="albumResults">
            <EuiSpacer size="s" />
            <EuiText>
              <h6>Albums</h6>
            </EuiText>
            <EuiSpacer size="m" />
            <EuiFlexGrid columns={3} gutterSize="s">
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

        </EuiFlexGroup>
      </Fragment>
    ));
  }
}
