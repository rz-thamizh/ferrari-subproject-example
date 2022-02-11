import React from 'react';
import Link from 'next/link';
import PropTypes from 'prop-types';
import { withDependencySupport } from '@/roanuz/lib/dep';
import RZLogoImage from '@/rz/view/imgs/TlLogo.svg';
import { ImageView } from '@/roanuz/view/image';

export const BaseLogoView = ({ logo = RZLogoImage, href = '/' }) => {
  return (
    <Link href={href}>
      <a alt="Goto Home" className="plain">
        <ImageView
          src={logo}
          alt="Logo"
        />
      </a>
    </Link>
  );
};

BaseLogoView.propTypes = {
  logo: PropTypes.string,
  href: PropTypes.string,
};

export const LogoView = withDependencySupport(BaseLogoView, 'LogoView');
