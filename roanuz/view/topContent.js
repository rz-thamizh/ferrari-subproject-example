import { withDependencySupport } from '@/roanuz/lib/dep';

export const BaseTopContentView = () => {
  return null;
};

BaseTopContentView.propTypes = {};
export const TopContentView = withDependencySupport(BaseTopContentView, 'TopContentView');
