import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import {
  Display24,
} from '@/roanuz/typopgraphy';
import { ReactComponent as VideoPlayIcon } from '@/roanuz/view/imgs/VideoPlayIcon.svg';
import { withDependencySupport } from '@/roanuz/lib/dep';
import { DailogView } from '@/roanuz/view/dialog';
import { GalleryLargeView } from '@/roanuz/view/product/galleryLargeView';
import { ImageView, NoImageView } from '../image';

export const BaseProductGalleryViewWrapper = styled.div`
  --preview-height: ${asRem(250)};
  @media screen and (min-width: ${Breakpoint.sm}) {
    --preview-height: ${asRem(480)};
  }
  
  .gallery-container {
    display: flex;
    flex-direction: column;

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

    .image-list {
      display: flex;
      overflow: auto;
      // justify-content: center;

      .image-item {
        margin-right: ${asRem(20)};
        cursor: pointer;
        max-width: ${asRem(80)};
        flex: 0 0 ${asRem(80)};
        // @media screen and (min-width: ${Breakpoint.lg}) {
        //   flex: initial;
        // }
        img {
          width: 100%;
          object-fit: contain;
          height: ${asRem(80)};
        }

        &:last-child {
          margin-right: 0
        }

        &.active {
          border-bottom: ${asRem(2)} solid var(--color-button);
        }
      }
    }

    .masked-image {
      position: relative;
      .count {
        background-color: var(--color-text);
        opacity: 0.7;
        position: absolute;
        width: 100%;
        object-fit: contain;
        height: ${asRem(80)};
        top: 0;
        border-radius: ${asRem(6)};
        color: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .video-icon {
      width: 100%;
      object-fit: contain;
      height: ${asRem(80)};
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid var(--color-button);
      border-radius: ${asRem(6)};
      svg {
        width: ${asRem(35)};
        height: ${asRem(35)};
      }
    }
  }
`;

export const BaseProductGalleryViewWrapper2 = styled(BaseProductGalleryViewWrapper)`
  >.gallery-container {
    .image-list-area {
      .image-list {
        @media screen and (min-width: ${Breakpoint.sm}) {
          justify-content: center;
        }
  
        .image-item {
          display: flex;
          justify-content: center;
          align-items: center;
          padding: ${asRem(5)};
          border-radius: var(--color-card-radius);

          @media screen and (min-width: ${Breakpoint.sm}) {
            max-height: ${asRem(100)};
            max-width: ${asRem(100)};
          }
  
          &.active {
            border: ${asRem(1)} solid var(--color-button);
          }
  
          .rz-image-view {
            width: ${asRem(64)};
            height: ${asRem(64)};

            @media screen and (min-width: ${Breakpoint.sm}) {
              width: ${asRem(84)};
              height: ${asRem(84)};
            }
            
            img {
              height: 100%;
            }
          }

          &.video-icon {
            @media screen and (min-width: ${Breakpoint.sm}) {
              height: ${asRem(95)};
            }

            path {
              stroke: var(--color-button);
            }
          }
        }
      }

      .masked-image {
        padding: ${asRem(5)};
        .count {
          @media screen and (min-width: ${Breakpoint.sm}) {
            width: ${asRem(95)};
            height: ${asRem(95)};
          }
        }
      }
    }
  }
`;

export const ProductGalleryView = ({
  product,
  tabIndexStart,
}) => {
  const skipMediaUrlFix = !product.gallery.hasRzGalleryMeta;
  const [previewItem, setPreviewItem] = useState(product.gallery.images[0]);

  const maskedImageIndex = product.gallery.images.length === 5 ? 5 : 4;
  const [showFullScreen, setShowFullScreen] = useState(false);

  const hasVideo = product.galleryVideo;
  const previewItemsCount = Math.min(product.gallery.images.length - (hasVideo ? 1 : 0), 4);
  const hiddentemsCount = product.gallery.images.length - previewItemsCount - (hasVideo ? 1 : 0);

  useEffect(() => {
    // Make sure state is changed with product
    setPreviewItem(product.gallery.images[0]);
  }, [product.sku, product.gallery]);
  return (
    <ProductGalleryViewWrapper>
      <DailogView
        titleText=" "
        showClose
        onClose={() => setShowFullScreen(false)}
        show={previewItem && showFullScreen} // Exclude preview for noimage: Need to decide & remove
      >
        <GalleryLargeView product={product} />
      </DailogView>

      <div className="gallery-container">
        <div className="preview-area">
          <div
            className="preview-item"
            onClick={() => setShowFullScreen(true)}
            onKeyPress={() => { setShowFullScreen(true); }}
            role="button"
            tabIndex="0"
          >
            {previewItem
              ? (
                <ImageView
                  src={previewItem.url}
                  alt={`Image of ${product.name}`}
                  showDefaultPlaceholder
                  skipMediaUrlFix={skipMediaUrlFix}
                />
              ) : <NoImageView />}
          </div>
        </div>
        {product.gallery.images.length > 1 && (
          <div className="image-list-area">
            <div className="image-list">
              {product.gallery.images.map((item, index) => (
                index < maskedImageIndex
                  ? (
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
                  ) : null
              ))}
              {product.gallery.images[maskedImageIndex] && (
                <div
                  key={product.gallery.images[maskedImageIndex].position}
                  className="image-item masked-image"
                  role="button"
                  tabIndex="0"
                  onClick={() => setShowFullScreen(true)}
                  onKeyPress={() => setShowFullScreen(true)}
                >
                  <ImageView
                    src={product.gallery.images[maskedImageIndex].url}
                    alt={`${product.gallery.images[maskedImageIndex].position} Image Preview`}
                    showDefaultPlaceholder
                    skipMediaUrlFix={skipMediaUrlFix}
                  />
                  <Display24 as="p" className="count">
                    +
                    {hiddentemsCount}
                  </Display24>
                </div>
              )}
              {product.galleryVideo && product.galleryVideo.length > 0 && (
                <div
                  key={product.galleryVideo[0].position}
                  className="image-item video-icon"
                  role="button"
                  tabIndex="0"
                  onClick={() => setShowFullScreen(true)}
                  onKeyPress={() => setShowFullScreen(true)}
                  arial-label="Video-icon"
                >
                  <VideoPlayIcon />
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </ProductGalleryViewWrapper>
  );
};

ProductGalleryView.propTypes = {
  product: PropTypes.object,
  tabIndexStart: PropTypes.number,
};

export const ProductGalleryViewWrapper = withDependencySupport(BaseProductGalleryViewWrapper, 'ProductGalleryViewWrapper');
