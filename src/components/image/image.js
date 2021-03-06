import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import { EuiOverlayMask } from '../overlay_mask';

import { EuiIcon } from '../icon';

import { EuiFocusTrap } from '../focus_trap';

import { keyCodes } from '../../services';

const sizeToClassNameMap = {
  xs: 'euiImage--xsmall',
  s: 'euiImage--small',
  m: 'euiImage--medium',
  l: 'euiImage--large',
  xl: 'euiImage--xlarge',
  fullWidth: 'euiImage--fullWidth',
  original: '',
};

export const SIZES = Object.keys(sizeToClassNameMap);

const fullScreenIconColorMap = {
  light: 'ghost',
  dark: 'default',
};

export class EuiImage extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isFullScreen: false,
    };
  }

  onKeyDown = event => {
    if (event.keyCode === keyCodes.ESCAPE) {
      event.preventDefault();
      event.stopPropagation();
      this.closeFullScreen();
    }
  };

  closeFullScreen = () => {
    this.setState({
      isFullScreen: false,
    });
  };

  openFullScreen = () => {
    this.setState({
      isFullScreen: true,
    });
  };

  render() {
    const {
      className,
      url,
      size,
      caption,
      hasShadow,
      allowFullScreen,
      fullScreenIconColor,
      alt,
      ...rest
    } = this.props;

    const classes = classNames(
      'euiImage',
      sizeToClassNameMap[size],
      {
        'euiImage--hasShadow': hasShadow,
        'euiImage--allowFullScreen': allowFullScreen,
      },
      className
    );

    let optionalCaption;
    if (caption) {
      optionalCaption = (
        <figcaption className="euiImage__caption">{caption}</figcaption>
      );
    }

    let optionalIcon;

    if (allowFullScreen) {
      optionalIcon = (
        <EuiIcon
          type="fullScreen"
          color={fullScreenIconColorMap[fullScreenIconColor]}
          className="euiImage__icon"
        />
      );
    }

    let fullScreenDisplay;

    if (this.state.isFullScreen) {
      fullScreenDisplay = (
        <EuiOverlayMask onClick={this.closeFullScreen}>
          <EuiFocusTrap clickOutsideDisables={true}>
            <button
              type="button"
              onClick={this.closeFullScreen}
              onKeyDown={this.onKeyDown}>
              <figure
                ref={node => {
                  this.figure = node;
                }}
                className="euiImageFullScreen">
                <img src={url} className="euiImageFullScreen__img" alt={alt} />
                {optionalCaption}
              </figure>
            </button>
          </EuiFocusTrap>
        </EuiOverlayMask>
      );
    }

    const fallbackImg =
      'http://images.45cat.com/sex-pistols-anarchy-in-the-uk-1976-13.jpg';
      //'https://ae01.alicdn.com/kf/HTB1sRh2xXmWBuNjSspdq6zugXXan.jpg_q50.jpg';

    return (
      <button
        type="button"
        onClick={allowFullScreen ? this.openFullScreen : undefined}>
        <figure className={classes} {...rest}>
          <img
            src={url}
            className="euiImage__img"
            alt={alt}
            onError={e => {
              e.target.onerror = null;
              e.target.src = fallbackImg;
            }}
          />
          {optionalCaption}

          {/*
          If the below fullScreen image renders, it actually attaches to the body because of
          EuiOverlayMask's React portal usage.
        */}
          {optionalIcon}
          {fullScreenDisplay}
        </figure>
      </button>
    );
  }
}

EuiImage.propTypes = {
  alt: PropTypes.string.isRequired,
  size: PropTypes.string.isRequired,
  fullScreenIconColor: PropTypes.string,
};

EuiImage.defaultProps = {
  size: 'original',
  fullScreenIconColor: 'light',
};
