import React, { Component, Fragment } from 'react';
import { Link } from 'react-router';
import { albumsBy, toptracksBy } from '../../../../src/utils/api/fetch';
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
      listGroup: [],
    };
  }

  componentDidMount() {
    const { openPlayer } = this.props;
    let artistName = this.props.location.pathname
      .split('/')
      .pop()
      .replace(/-/g, ' ');

    const combinedData = { albums: {}, toptracks: {} };
    Promise.all([albumsBy(artistName), toptracksBy(artistName)]).then(values => {
      combinedData.albums = values[0].topalbums.album;
      combinedData.toptracks = values[1].toptracks.track;

      const toptrackList = combinedData.toptracks.map((item,key) => {
        return {
          key,
          artist: item.artist.name,
          song: item.name,
        }
      });

      this.setState({
        toptrackList: toptrackList,
      });

      const listGroup = toptrackList.map((item,key) => {
        return {
          label: item.song,
          onClick: () => {
            openPlayer(this.state.toptrackList, key)
          },
          iconType: 'play',
          size: 's',
          wrapText: true,
        }
      });

      this.setState({
        artistName: values[0].topalbums.album[0].artist.name,
        results: combinedData,
        listGroup,
      });
    });
  }

  render() {

    const { results, artistName, listGroup } = this.state;

    return (
      results.length < 1 || (
        <Fragment>
          <EuiText>
            <h1 className="guideTitle">{artistName}</h1>
          </EuiText>
          <EuiFlexGroup responsive={false}>
            <EuiFlexItem className="toptracksResults" grow={3} style={{ minWidth: 150 }}>
              <EuiSpacer size="s" />
              <EuiText>
                <h6>Top Songs</h6>
              </EuiText>
              <EuiSpacer size="m" />
              <EuiFlexGrid columns={1} gutterSize="s">
                <EuiListGroup
                  flush={true}
                  bordered={false}
                  listItems={listGroup}
                />
              </EuiFlexGrid>
            </EuiFlexItem>

            <EuiFlexItem className="albumResults" grow={7}>
              <EuiSpacer size="s" />
              <EuiText>
                <h6>Albums</h6>
              </EuiText>
              <EuiSpacer size="m" />
              <EuiFlexGrid columns={3} gutterSize="s">
                {results.albums.map((item, key) => (
                  <EuiFlexItem key={key}>
                    <Link to={{
                      pathname: `album/${slugify(item.artist.name)}/${slugify(item.name)}`,
                    }}>
                      <EuiImage
                        hasShadow
                        caption={item.name}
                        alt={item.name}
                        url={item.image[3]['#text']}
                      />
                    </Link>
                  </EuiFlexItem>
                ))}
              </EuiFlexGrid>
            </EuiFlexItem>
          </EuiFlexGroup>
        </Fragment>
      )
    );
  }
}
