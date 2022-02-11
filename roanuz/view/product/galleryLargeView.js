import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import {
  Text14,
} from '@/roanuz/typopgraphy';
import { ImageView } from '../image';
import { VideoView } from '../video';

const GalleryLargeViewWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0;
  --preview-height: ${asRem(250)};
  @media screen and (min-width: ${Breakpoint.sm}) {
    flex-direction: initial;
    --preview-height: ${asRem(600)};
    padding: 0 ${asRem(40)};
  }
  // Temporary - till we finalize video approach
  iframe {
    height: var(--preview-height);
  }
  >div {
    @media screen and (min-width: ${Breakpoint.sm}) {
      margin-right: ${asRem(32)};
    }

    &:last-child {
      margin-right: 0;
    }
  }

  >.section-gallery {
    flex: 1;
    // width: ${asRem(300)};
    @media screen and (min-width: ${Breakpoint.md}) {
      width: ${asRem(500)};
    }
    @media screen and (min-width: ${Breakpoint.lg}) {
      width: ${asRem(800)};
    }
    >.preview-area {
      height: var(--preview-height);
      margin-bottom: ${asRem(20)};

      img {
        width: 100%;
        height: var(--preview-height);
        object-fit: contain;
        object-position: center;
      }
    }
  }

  >.desc-container {
    display: flex;
    flex-flow: column;
    @media screen and (min-width: ${Breakpoint.sm}) {
      width: ${asRem(200)};
    }
    @media screen and (min-width: ${Breakpoint.md}) {
      width: ${asRem(300)};
    }

    .tabs-list {
      display: inline-flex;
      border-bottom: ${asRem(1)} solid var(--color-grey-2);
      >div {
        font-weight: bold;
        padding: ${asRem(9)} ${asRem(18)};
        cursor: pointer;
        margin-bottom: -${asRem(1)};
        &.active {
          border-bottom: ${asRem(1)} solid var(--color-text);
        }
      }
    }

    .tabs-description {
      padding-top: ${asRem(20)};
      .image-list {
        display: flex;
        overflow: auto;
        justify-content: center;
        flex-flow: wrap;
  
        .image-item {
          margin: 0 auto ${asRem(25)};
          cursor: pointer;
          max-width: ${asRem(80)};
          flex: 0 0 ${asRem(80)};
  
          img {
            width: 100%;
            object-fit: contain;
            height: ${asRem(80)};
          }
  
          &.active {
            border-bottom: ${asRem(2)} solid var(--color-button);
          }

          &:focus {
            outline: 0;
            border-bottom: ${asRem(2)} solid var(--color-button);
          }
        }
      }
    }
  } 
}
`;

export const GalleryLargeView = ({
  product,
}) => {
  const skipMediaUrlFix = !product.gallery.hasRzGalleryMeta;
  const [previewItem, setPreviewItem] = useState(product.gallery.images[0]);
  const [tabItem, setTabItem] = useState('image');
  return (
    <GalleryLargeViewWrapper>
      <div className="section-gallery">
        <div className="preview-area">
          <div className="preview-item">
            {previewItem.video_content ? (
              <VideoView
                src={previewItem.video_content.video_url}
                title={previewItem.video_content.video_title}
              />
            ) : (
              <ImageView
                src={previewItem.url}
                alt={`Image of ${product.name}`}
                showDefaultPlaceholder
                skipMediaUrlFix={skipMediaUrlFix}
              />
            )}
          </div>
        </div>
      </div>
      <div className="desc-container">
        <div className="tabs-list">
          <div
            role="button"
            tabIndex="0"
            className={`${tabItem === 'image' ? 'active' : ''}`}
            onClick={() => setTabItem('image')}
            onKeyPress={() => setTabItem('image')}
          >
            <Text14>Myndir</Text14>
          </div>
          {product.galleryVideo && product.galleryVideo.length > 0 && (
            <div
              role="button"
              tabIndex="0"
              className={`${tabItem === 'video' ? 'active' : ''}`}
              onClick={() => setTabItem('video')}
              onKeyPress={() => setTabItem('video')}
            >
              <Text14>Vídeó</Text14>
            </div>
          )}
        </div>
        <div className="tabs-description">
          <div className="image-list">
            {tabItem === 'image' && (
              product.gallery.images.map((item) => (
                !item.video_content && (
                  <div
                    key={item.position}
                    className={`image-item ${item.url === previewItem.url ? 'active' : ''}`}
                    role="button"
                    tabIndex="0"
                    onClick={() => { setPreviewItem(item); }}
                    onKeyPress={() => { setPreviewItem(item); }}
                  >
                    <ImageView
                      src={item.url}
                      alt={`${item.position} Image Preview`}
                      showDefaultPlaceholder
                      skipMediaUrlFix={skipMediaUrlFix}
                    />
                  </div>
                )
              ))
            )}
            {tabItem === 'video' && (
              product.galleryVideo.map((video) => (
                <div
                  key={video.position}
                  className={`image-item ${video.url === previewItem.url ? 'active' : ''}`}
                  role="button"
                  tabIndex="0"
                  onClick={() => { setPreviewItem(video); }}
                  onKeyPress={() => { setPreviewItem(video); }}
                >
                  <ImageView
                    src={video.url}
                    alt={`${video.position} Image Preview`}
                    showDefaultPlaceholder
                  />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </GalleryLargeViewWrapper>
  );
};

GalleryLargeView.propTypes = {
  product: PropTypes.object,
};
