import React, { Component } from 'react';
import ReactPlayer from 'react-player';

import {
  EuiBottomBar,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiButtonEmpty,
  EuiIcon,
  EuiLink,
  EuiText,
} from '../../../../src/components';

export default class extends Component {

  render() {
    let bottomBar;
    if (this.props.playerOpen) {
      bottomBar = (
        <EuiBottomBar>
          <EuiFlexGroup justifyContent="spaceAround" responsive={false} alignItems="center">
            <EuiFlexItem grow={1}>
              &nbsp;
            </EuiFlexItem>
            <EuiFlexItem grow={7}>
              <EuiFlexGroup gutterSize="s" responsive={false}>
                <EuiFlexItem>
                  <EuiLink onClick={ console.log('prev') }>
                    <EuiText textAlign="center">
                      <EuiIcon size="xxl" type="arrowLeft" />
                    </EuiText>
                  </EuiLink>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiText textAlign="center">
                    <EuiLink onClick={ console.log('play') }>
                      <EuiIcon size="xxl" type="play" />
                    </EuiLink>
                  </EuiText>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiText textAlign="center">
                    <EuiLink onClick={ console.log('next') }>
                      <EuiIcon size="xxl" type="arrowRight" />
                    </EuiLink>
                  </EuiText>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <ReactPlayer
                url={`http://www.youtube.com/embed/${this.props.selectedYoutubeId}`}
                height={113}
                width={200}
                controls
                playing
                playsinline
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
