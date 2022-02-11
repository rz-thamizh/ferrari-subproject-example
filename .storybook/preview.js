// import '!style-loader!css-loader!sass-loader!../roanuz/styles/main.scss';
import '../roanuz/styles/storybook.scss';
import { MINIMAL_VIEWPORTS} from '@storybook/addon-viewport';

const customViewports = {
  MobileBegin: {
    name: 'MobileBegin',
    styles: {
      width: '320px',
      height: '568px',
    },
  },
  MobileEnd: {
    name: 'MobileEnd',
    styles: {
      width: '767px',
      height: '568px',
    },
  },
  TabBegin: {
    name: 'TabBegin',
    styles: {
      width: '768px',
      height: '800px',
    },
  },
  TabEnd: {
    name: 'TabEnd',
    styles: {
      width: '1439px',
      height: '800px',
    },
  },
  DesktopBegin: {
    name: 'DesktopBegin',
    styles: {
      width: '1440px',
      height: '800px',
    },
  },
};

export const parameters = {
  actions: { argTypesRegex: "^on[A-Z].*" },
  controls: {
    matchers: {
      color: /(background|color)$/i,
      date: /Date$/,
    },
  },
  viewport: {
    viewports: {
       ...MINIMAL_VIEWPORTS,
      ...customViewports,
    },
  },
}