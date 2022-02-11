import React from 'react';
import Link from 'next/link';
import styled from 'styled-components';
import { ImageView } from '@/roanuz/view/image';
import { asRem, Breakpoint } from '@/roanuz/lib/css';
import { Display50 } from '@/roanuz/typopgraphy';
import NotFoundImage from '@/roanuz/view/imgs/Graphics404.svg';

const NotFoundWrapper = styled.div`
  text-align: center;
  margin: ${asRem(50)}  ${asRem(20)};
  @media screen and (min-width: ${Breakpoint.lg}) {
    margin-top: ${asRem(180)};
    margin-bottom: ${asRem(180)};
  }

  >.notfound-container {
    h1 {
      margin-top: ${asRem(50)};
      margin-bottom: ${asRem(25)};
    }

    .rz-image-view {
      img {
        max-width: 50%;
        max-height: ${asRem(370)};
      }
    }
  }
`;

export const NotFound = () => {
  return (
    <NotFoundWrapper>
      <div className="notfound-container">
        <div className="graphics">
          <ImageView
            src={NotFoundImage}
            alt="Not found image"
          />
        </div>
        <Display50 as="h1">
          Síða fannst ekki..
        </Display50>
        <p>
          Því miður fannst ekki umbeðin síða.
          {' '}
          Endilega athugaðu hlekkinn eða farðu aftur á
          {' '}
          <Link href="/" prefetch={false}>
            <a alt="Links to Home">
              forsíðu
            </a>
          </Link>
        </p>
      </div>
    </NotFoundWrapper>
  );
};

NotFound.propTypes = {
};
