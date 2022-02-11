import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export function useWaitForClientSide() {
  const router = useRouter();
  const [status, setStatus] = useState(false);
  useEffect(() => {
    setStatus(true);
  }, [router.asPath]);

  return status;
}
