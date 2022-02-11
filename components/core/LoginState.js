import React from 'react';
import Config from '@/config';
import Link from 'next/link';
import { UserConsumer } from '@/store/core/context';

const LoginState = () => {
  const loginPath = Config.LoginPath;
  const registerPath = Config.RegisterPath;

  // Load user and order client side
  // useQuery(GET_USER_WITH_ID, { ssr: false });

  return (
    <div className="debug-login-state">
      <UserConsumer>
        {({ token, logoutUser }) => (
          <div>
            {token
              ? (
                <button
                  type="button"
                  onClick={logoutUser}
                >
                  Logout
                </button>
              )
              : (
                <div>
                  <Link href={loginPath}><a>Login</a></Link>
                  {' '}
                  |
                  <Link href={registerPath}><a>Register</a></Link>
                </div>
              )}
          </div>
        )}
      </UserConsumer>
    </div>
  );
};

export default LoginState;
