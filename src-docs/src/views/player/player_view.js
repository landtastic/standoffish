import React, { Component } from 'react';
import ReactPlayer from 'react-player';
import { youtubeSearch } from '../../../../src/utils/api/fetch';
import {
  EuiBottomBar,
  EuiFlexGroup,
  EuiFlexItem,
  EuiIcon,
  EuiLink,
  EuiText,
} from '../../../../src/components';

export class PlayerView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      results: {},
      selectedYoutubeId: null,
      index: 0,
      isPlaying: true,
    };

  }

  componentDidUpdate(prevProps, prevState) {
    const {currentIndex, playlistObj} = this.props;

    if (prevProps.currentIndex !== currentIndex) {
      this.setState({
        index: currentIndex,
      });
    }
    if (prevProps.playlistObj !== playlistObj) {
      this.playSong(playlistObj, currentIndex);
    }
  }

  playSong = (playlistObj, currentIndex) => {
    console.log(playlistObj);
    let currentSong = `${playlistObj[currentIndex].artist} ${playlistObj[currentIndex].song}`;
    console.log(currentSong);
    youtubeSearch(currentSong).then((result) => {
      this.setState({
        results: result.items,
        selectedYoutubeId: result.items[0].id.videoId,
      });
    });
  }

  playNextSong = () => {
    const {index} = this.state;
    const {playlistObj, currentIndex} = this.props;
  	(index + 1 === playlistObj.length) ?
      this.setState({ index: 0 }) : this.setState({ index: index + 1 });
    this.playSong(playlistObj, this.state.index);
  }

  playPrevSong = () => {
    const {index} = this.state;
    const {playlistObj, currentIndex} = this.props;
    (index - 1 < 0) ?
      this.setState({ index: 0 }) : this.setState({ index: index - 1 });
    this.playSong(playlistObj, this.state.index);
  }

  togglePlay = () => {
    this.setState({
      isPlaying: !this.state.isPlaying,
    });
  }

  onEnded = () => {
  	this.playNextSong();
  }

  render() {

    let bottomBar;
    const {isPlaying, selectedYoutubeId} = this.state;

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
                  <EuiLink onClick={ () => this.playPrevSong() }>
                    <EuiText textAlign="center">
                      <EuiIcon size="xl" type="arrowLeft" />
                    </EuiText>
                  </EuiLink>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiLink onClick={ () => this.togglePlay() }>
                    <EuiText textAlign="center">
                      <EuiIcon size="xxl" type={ isPlaying ? "pause" : "play" } />
                    </EuiText>
                  </EuiLink>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiLink onClick={ () => this.playNextSong() }>
                    <EuiText textAlign="center">
                      <EuiIcon size="xl" type="arrowRight" />
                      </EuiText>
                  </EuiLink>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
                  <ReactPlayer
                    url={`https://www.youtube.com/embed/${selectedYoutubeId}`}
                    height={100}
                    width={178}
                    controls
                    playing={isPlaying}
                    onEnded={this.onEnded}
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
