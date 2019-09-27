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
} from '../../../../src/components';

export default class extends Component {

  render() {
    let bottomBar;
    if (this.props.playerOpen) {
      bottomBar = (
        <EuiBottomBar>
          <EuiFlexGroup justifyContent="spaceBetween">
          <EuiFlexItem grow={false}>
            <EuiFlexGroup gutterSize="s">
              <EuiFlexItem grow={false}>
                ...
              </EuiFlexItem>
            </EuiFlexGroup>
          </EuiFlexItem>
            <EuiFlexItem>
              <EuiFlexGroup gutterSize="s">
                <EuiFlexItem>
                  <EuiLink onClick={ console.log('this') }>
                    <EuiIcon size="xxl" type="arrowLeft" />
                  </EuiLink>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiLink onClick={ console.log('this') }>
                    <EuiIcon size="xxl" type="play" />
                  </EuiLink>
                </EuiFlexItem>
                <EuiFlexItem>
                  <EuiLink onClick={ console.log('this') }>
                    <EuiIcon size="xxl" type="arrowRight" />
                  </EuiLink>
                </EuiFlexItem>
              </EuiFlexGroup>
            </EuiFlexItem>
            <EuiFlexItem grow={false}>
              <EuiFlexGroup gutterSize="s">
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
