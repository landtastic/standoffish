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
  EuiPopover,
} from '../../../../src/components';

export class AlbumDetailView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: {
          tracks: [],
          image: '',
      },
      trackList: [],
      isPopoverOpen: false,
    };
    const urlParts = this.props.location.pathname.split('/');
    const lastTwo = urlParts.slice(-2);
    this.artistName = lastTwo[0].replace(/-/g, ' ');
    this.albumName = lastTwo[1].replace(/-/g, ' ');
  }

  onButtonClick() {
    this.setState({
      isPopoverOpen: !this.state.isPopoverOpen,
    });
  }

  closePopover() {
    this.setState({
      isPopoverOpen: false,
    });
  }

  componentDidMount() {
    const { openPlayer } = this.props;

    albumTracks(this.artistName, this.albumName).then(values => {
      const trackList = values.album.tracks.track.map((item,key) => {
        return {
          key,
          artist: item.artist.name,
          song: item.name,
          label: `${item.name}`,
          onClick: () => {
            openPlayer(this.state.trackList, key)
          },
          iconType: 'play',
          size: 's',
          wrapText: true,
          showTooltip: true,
          extraAction: {
            color: 'subdued',
            onClick: (e) => {
              console.log(`${item.artist.name} - ${item.name}`);
              this.onButtonClick();
            },
            //iconType: favorite1 === 'link1' ? 'pinFilled' : 'pin',
            iconType: 'plusInCircle',
            iconSize: 's',
            'aria-label': 'Favorite link1',
            // alwaysShow: favorite1 === 'link1',
          },
        };
      });

      this.setState({
        results: {
          artist: values.album.artist,
          name: values.album.name,
          tracks: values.album.tracks.track.name,
          image: values.album.image[5]['#text'],
        },
        trackList,
      });
    });
  }

  render() {
    const { results, trackList } = this.state;
    return (
      results.length < 1 || (
        <Fragment>
          <EuiText>
            <h1 className="guideTitle">{results.artist} - {results.name}</h1>
          </EuiText>
          <EuiFlexGroup responsive={false}>
            <EuiFlexItem className="tracks">
              <EuiSpacer size="s" />
              <EuiListGroup
                flush={true}
                bordered={false}
                listItems={trackList}
              />
            </EuiFlexItem>

            <EuiFlexItem className="albumResults">
              <EuiSpacer size="s" />
              <EuiImage
                hasShadow
                size="fullWidth"
                style={{ maxWidth: 500 }}
                alt={results.name}
                url={results.image}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </Fragment>
      )
    );
  }
}
