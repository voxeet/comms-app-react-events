import getProxyUrl from '@src/utils/getProxyUrl';
import { useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import fetch from '../utils/fetch';

const useToken = () => {
  const location = useLocation();
  const accessToken = useMemo(() => {
    return encodeURIComponent(
      new URLSearchParams(window.location.search).get('token') || import.meta.env.VITE_CLIENT_ACCESS_TOKEN || '',
    );
  }, [location]);

  const [YOUR_TOKEN, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | undefined>();

  const getToken = async () => {
    if (accessToken && accessToken.length) {
      return accessToken;
    }
    const res = await fetch(`${getProxyUrl()}/access_token`, {
      method: 'POST',
    });

    if (!res.data.access_token) {
      setError(
        `There was an error connecting to the proxy server at "${getProxyUrl()}" - check the server there is running and that it has a route for "${getProxyUrl()}/access_token"`,
      );
    }
    setError(undefined);
    return res.data.access_token;
  };

  useEffect(() => {
    (async () => {
      setToken(await getToken());
    })();
  }, []);

  return { YOUR_TOKEN, getToken, error };
};

export default useToken;
