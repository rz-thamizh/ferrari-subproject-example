import React from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import SiminnImage from '@/roanuz/view/imgs/PaymentMethodSimminLett.png';
import { DisplayMedium18 } from '@/roanuz/typopgraphy';
import { asRem } from '@/roanuz/lib/css';
import { ImageView } from '../../image';

const SiminnStatusViewWrapper = styled.div`
  min-width: ${asRem(280)};
  
  >.image-container {
    text-align: center;
    >div {
      width: ${asRem(166)};
      img {
        max-width: 100%;
      }
    }
  }
  >.message-container {
    p {
      padding: ${asRem(20)} 0;
    }
    text-align: center;

    .loading-bar {
      height: ${asRem(40)};
    }

    .error-message {
      color: var(--color-error);
    }
  }
`;

export const SiminnStatusView = ({
  loading,
  error,
  message,
}) => {
  return (
    <SiminnStatusViewWrapper>
      <div className="image-container">
        <ImageView src={SiminnImage} alt="Siminn Logo" />
      </div>
      <div className="message-container">
        {message && (
          <div>
            <DisplayMedium18>{message}</DisplayMedium18>
            <div className="loading-bar">
              { loading && (
                <div>loading</div>
              )}
            </div>
          </div>
        )}
        {(!message) && loading && (
          <DisplayMedium18>Processing...</DisplayMedium18>
        )}
        {(!message) && error && (
          <DisplayMedium18 className="error-message">Eitthvað fór úrskeiðis, vinsamlegast reynið aftur</DisplayMedium18>
        )}
      </div>
    </SiminnStatusViewWrapper>
  );
};

SiminnStatusView.propTypes = {
  loading: PropTypes.bool.isRequired,
  error: PropTypes.bool.isRequired,
  message: PropTypes.string,
};
