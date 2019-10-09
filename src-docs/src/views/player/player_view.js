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
      results: [],
      selectedYoutubeId: null,
      isPlaying: false,
    };

  }

  componentDidUpdate(prevProps, prevState) {
    const {currentIndex, playlist} = this.props;

    if (prevProps.currentIndex !== currentIndex || prevProps.playlist.length !== playlist.length) {
      this.playSong(playlist, currentIndex);
    }
  }

  playSong = (playlist, currentIndex) => {
    let currentSong = `${playlist[currentIndex].artist} ${playlist[currentIndex].song}`;
    console.log(currentSong);
    youtubeSearch(currentSong).then((result) => {
      this.setState({
        results: result.items,
        selectedYoutubeId: result.items[0].id.videoId,
        isPlaying: true,
      });
    });
  }

  playNextSong = () => {
    const {playlist, currentIndex, openPlayer} = this.props;
    let index = currentIndex;
  	(currentIndex + 1 === playlist.length) ? index = 0 : index++;
    openPlayer(playlist, index);
  }

  playPrevSong = () => {
    // const {index} = this.state;
    const {playlist, currentIndex, openPlayer} = this.props;
    let index = currentIndex;
    (currentIndex - 1 < 0) ? index = 0 : index--;
    openPlayer(playlist, index);
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
