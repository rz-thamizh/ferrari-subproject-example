import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';

const VideoViewWrapper = styled.div`
  video {
    width: 100%;
  }
`;

export const VideoView = ({ src, title }) => {
  return (
    <VideoViewWrapper
      className="rz-image-view"
    >
      {/* <video controls>
        <track kind="captions" />
        <source src={src} type="video/mp4" />
        Your browser does not support HTML video.
      </video> */}
      {/* Need to discuss this video approach */}
      <iframe
        title={title || 'Video'}
        src={src}
        width="100%"
        height="100%"
      />
    </VideoViewWrapper>
  );
};

VideoView.propTypes = {
  src: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
};
