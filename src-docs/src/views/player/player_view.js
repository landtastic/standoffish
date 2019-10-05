import React, { Component } from 'react';
import ReactPlayer from 'react-player';

import {
  EuiBottomBar,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLink,
  EuiText,
} from '../../../../src/components';

const youtubeJSON = query => {
  return fetch(`https://www.googleapis.com/youtube/v3/search?&q=${query}&maxResults=10&part=snippet&key=AIzaSyDlcHPnr5gJr1_pBSvVSRtFudfpIUppfjM`)
  .then(response => response.json())
}

export class PlayerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedYoutubeId: null,
    };

  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.playerQuery !== this.props.playerQuery) {
      this.playSong(this.props.playerQuery);
    }
  }

  setYoutubeId = query => {
    youtubeJSON(query).then((result) => {
      this.setState({
        selectedYoutubeId: result.items[0].id.videoId,
      });
    });
  }

  playSong = selectedSong => {
    this.setYoutubeId(selectedSong);
  }

  render() {

    let bottomBar;
    if (this.props.isPlayerOpen) {
      bottomBar = (
        <EuiBottomBar paddingSize="s">
          <EuiFlexGroup justifyContent="spaceAround" responsive={false} alignItems="center">
            <EuiFlexItem grow={1}>
              &nbsp;
            </EuiFlexItem>
            <EuiFlexItem grow={4}>
              <EuiFlexGroup gutterSize="none" responsive={false}>
                <EuiFlexItem>
                  <EuiLink onClick={ () => console.log('prev') }>
                    <EuiText textAlign="center">
                      <EuiIcon size="xl" type="arrowLeft" />
                    </EuiText>
                  </EuiLink>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiText textAlign="center">
                    <EuiLink onClick={ () => console.log('play') }>
                      <EuiIcon size="xxl" type="play" />
                    </EuiLink>
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiText textAlign="center">
                    <EuiLink onClick={ () => console.log('next') }>
                      <EuiIcon size="xl" type="arrowRight" />
                    </EuiLink>
                  </EuiText>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <ReactPlayer
                url={`https://www.youtube.com/embed/${this.state.selectedYoutubeId}`}
                height={100}
                width={178}
                controls
                playing
                config={{
                  youtube: {
                    playerVars: {
                      modestbranding: 1,
                			enablejsapi : 1,
                      playsinline: 1,
                			iv_load_policy: 3,
                			theme: 'dark',
                			color: 'white',
                      origin: 'http://standoffish.com',
                			showinfo: 1,
	                  }
                  },
                }}
              />
            </EuiFlexItem>
          </EuiFlexGroup>
        </EuiBottomBar>
      );
    }

    return (
      <div>
        {bottomBar}
      </div>
    );
  }
}

// PlayerView.propTypes = {
//   selectedYoutubeId: PropTypes.string.isRequired,
//   theme: PropTypes.string.isRequired,
//   toggleTheme: PropTypes.func.isRequired,
//   locale: PropTypes.string.isRequired,
//   toggleLocale: PropTypes.func.isRequired,
//   routes: PropTypes.object.isRequired,
// };
//
// PlayerView.defaultProps = {
//   currentRoute: {},
// };
