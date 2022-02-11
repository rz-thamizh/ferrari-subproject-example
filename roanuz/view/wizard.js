import React from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
import Link from 'next/link';
import { TextMedium16 } from '@/roanuz/typopgraphy';
import { ReactComponent as BreadCrumbArrowIcon } from '@/roanuz/view/imgs/BreadCrumbArrow.svg';
import { asRem } from '@/roanuz/lib/css';
import { SVGIcon } from './icon';

const ItemViewWrapper = styled(TextMedium16)`
  max-width: 24ch;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  display: block;

  ${(p) => p.future && css`
    color: var(--color-grey);
  `};

  ${(p) => p.completed && css`
    color: var(--color-button);
    cursor: pointer;
  `};
`;

const ItemView = ({
  text, href, alt,
  future, completed, onClick,
}) => {
  if (href && completed) {
    return (
      <Link href={href} prefetch={false}>
        <ItemViewWrapper
          as="a"
          alt={alt || text}
          future={future}
          completed={completed}
          href=""
        >
          {text}
        </ItemViewWrapper>
      </Link>
    );
  }
  return (
    <ItemViewWrapper
      future={future}
      completed={completed}
      onClick={onClick}
    >
      {text}
    </ItemViewWrapper>
  );
};

ItemView.propTypes = {
  text: PropTypes.string.isRequired,
  href: PropTypes.string.isRequired,
  alt: PropTypes.string,
  future: PropTypes.bool,
  completed: PropTypes.bool,
  onClick: PropTypes.func,
};

const WizardProgressViewWrapper = styled.ul`
  display: flex;
  flex-wrap: nowrap;
  overflow-y: auto;
  align-items: center;
  > li {
    display: flex;
    > span {
      display: block;
      color: var(--color-grey);
    }

    svg {
      color: var(--color-grey);
      padding: 0 ${asRem(7)};
    }

    & :last-child {
      > span {
        display: none;
      }
    }
  }
`;

export const WizardProgressView = ({ items }) => {
  return (
    <WizardProgressViewWrapper>
      {items.map((item) => (
        <li key={item.text}>
          <ItemView {...item} />
          <TextMedium16 as="span">
            <SVGIcon heightPx={10}>
              <BreadCrumbArrowIcon />
            </SVGIcon>
          </TextMedium16>
        </li>
      ))}
    </WizardProgressViewWrapper>
  );
};

WizardProgressView.propTypes = {
  items: PropTypes.arrayOf(PropTypes.shape(ItemView.propTypes)),
};
