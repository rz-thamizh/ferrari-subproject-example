import React, { useState } from 'react';
import styled, { css } from 'styled-components';
import PropTypes from 'prop-types';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import {
  Text16, TextBold16,
} from '@/roanuz/typopgraphy';
import { subscribeEmailToNewsletterMutation } from '@/store/customer/query';
import { useMutation } from '@apollo/client';
import { DailogView } from '@/roanuz/view/dialog';
import { SVGIcon } from '@/roanuz/view/icon';
import { ReactComponent as RightSidedArrowIcon } from '@/roanuz/view/imgs/RightSidedArrowIcon.svg';
import { SocialLinks } from './socialLinks';

export const NewsLetterSubscriptionWrapper = styled.div`
  padding-top: ${asRem(50)};
  @media screen and (min-width: ${Breakpoint.sm}) {
    padding-top: 0;
  }
  .subscription-text {
    max-width: ${asRem(330)};
  }

  .subscription-error {
    color: var(--color-error);
    margin-top: ${asRem(8)};
    max-width: ${asRem(330)};
  }

  .content-heading {
    margin-bottom: ${asRem(10)};
  }
`;

export const SubscriptionFormWrapper = styled.div`
  .control {
    margin-top: ${asRem(20)};

    input {
      border-right: none !important;
      border: ${asRem(1)} solid var(--color-button);
      padding: ${asRem(12)} ${asRem(19)};
      border-top-left-radius: ${asRem(5)};
      border-bottom-left-radius: ${asRem(5)};
      background-color: transparent;
      height: ${asRem(48)};
      font-size: ${asRem(16)};
      line-height: ${asRem(22)};
      margin: 0;
      width: calc(100% - ${asRem(69)});

      &:focus {
        box-shadow: none;
        outline: none;
      }

      &::placeholder {
        color: var(--color-disabled);
      }
    }

    button {
      height: ${asRem(48)};
      position: absolute;
      border-top-right-radius: ${asRem(5)};
      border-bottom-right-radius: ${asRem(5)};
      padding: ${asRem(13)} ${asRem(18)};
      border-bottom-left-radius: 0;
      border-top-left-radius: 0;
      background-color: var(--color-button);
      border: none;
      color: var(--color-text-rev);
      font-size: ${asRem(16)};
      line-height: ${asRem(22)};
      cursor: pointer;
      margin: 0;
      svg {
        margin-left: ${asRem(5)};
      }
    }
  }

  ${(p) => (p.roundedCorners) && css`
    .control {
      input {
        border: ${asRem(1)} solid var(--color-button);
        border-top-left-radius: ${asRem(30)};
        border-bottom-left-radius: ${asRem(30)};
      }
      button {
        border-top-right-radius: ${asRem(30)};
        border-bottom-right-radius: ${asRem(30)};
      }
    }
  `}

  ${(p) => (p.noBorderRadius) && css`
    .control {
      input, button {
        border-radius: 0;
      }
    }
  `}

  ${(p) => (p.pointerIcon) && css`
    .control {
      input {
        width: calc(100% - ${asRem(85)});
      }
    }
  `}
`;

export const FooterNewsLetterSubscription = ({
  roundedCorners,
  noBorderRadius,
  socialLinks,
  pointerIcon,
}) => {
  const [popup, setPopup] = useState(false);
  const [formInitValue, setFormInitValue] = useState('');
  const [updateCustomer, { error }] = useMutation(subscribeEmailToNewsletterMutation, {
    onCompleted: (updatedData) => {
      // Ensure customer newletter is updated
      console.log(error);
      if (updatedData.subscribeEmailToNewsletter) {
        console.log('✅ newsletter subscribed', updatedData.subscribeEmailToNewsletter, error);
        setPopup(true);
      }
    },
  });

  const onSave = (variables) => {
    updateCustomer({ variables });
  };

  const onPopupClose = () => {
    setPopup(false);
  };

  const submitHandler = (e) => {
    e.preventDefault();

    const buildSaveInput = {
      email: formInitValue,
    };

    if (onSave) {
      onSave(buildSaveInput);
    }

    setFormInitValue('');
  };

  return (
    <NewsLetterSubscriptionWrapper>
      <DailogView
        titleText="Takk fyrir aðð skrá þig á póstlistann!"
        showClose
        onClose={onPopupClose}
        show={popup}
        containerWidth="400px"
      >
        <div>Þú færð tölvupóst innan skamms</div>
      </DailogView>
      <TextBold16 className="content-heading">Skráðu þig á póstlistann okkar</TextBold16>
      <Text16 className="subscription-text">
        Fáðu upplýsingar um nýjungar og tilboð beint í pósthólfið.
      </Text16>
      <SubscriptionFormWrapper
        roundedCorners={roundedCorners}
        noBorderRadius={noBorderRadius}
        pointerIcon={pointerIcon}
      >
        <div className="control">
          <input
            name="email"
            placeholder="Netfang"
            type="email"
            id="newsletter"
            value={formInitValue}
            onChange={(e) => setFormInitValue(e.target.value)}
          />
          <button
            title="Skrá"
            type="submit"
            onClick={submitHandler}
          >
            <span>
              Skrá
              {pointerIcon && (
                <SVGIcon
                  heightPx={10}
                >
                  <RightSidedArrowIcon />
                </SVGIcon>
              )}
            </span>
          </button>
        </div>
      </SubscriptionFormWrapper>
      <div className="subscription-error">
        {error && (
          <div>
            {error.message}
          </div>
        )}
      </div>
      {(socialLinks && socialLinks.length) && (
        <SocialLinks socialLinks={socialLinks} />
      )}
    </NewsLetterSubscriptionWrapper>
  );
};

FooterNewsLetterSubscription.propTypes = {
  roundedCorners: PropTypes.bool,
  noBorderRadius: PropTypes.bool,
  socialLinks: PropTypes.object,
  pointerIcon: PropTypes.bool,
};
