import { createGlobalStyle } from 'styled-components';
import { withDependencySupport } from './lib/dep';

const BaseAppStyle = createGlobalStyle`
  body {
  }
`;

export const AppStyle = withDependencySupport(BaseAppStyle, 'AppStyle');
