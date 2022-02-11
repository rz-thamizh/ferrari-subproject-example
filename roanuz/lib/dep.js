import React from 'react';
import { getDisplayName } from './utils';

const Register = {
  lookup: {},
};

export function injectComponent(key, WrappedComponent) {
  Register.lookup[key] = WrappedComponent;
}

export function withDependencySupport(WrappedComponent, key) {
  if (!key) {
    throw new Error('Key can not be empty');
  }

  const displayName = getDisplayName(WrappedComponent);
  const registerKey = key;

  // eslint-disable-next-line react/prefer-stateless-function
  class RegistrySupportedComp extends React.Component {
    render() {
      if (Register.lookup[registerKey]) {
        const RegisteredComp = Register.lookup[registerKey];
        return (
          <RegisteredComp
            {...this.props}
          />
        );
      }
      return (
        <WrappedComponent
          {...this.props}
        />
      );
    }
  }

  RegistrySupportedComp.displayName = `withDependencySupport(${displayName})`;
  return RegistrySupportedComp;
}
