import { useErrors, ErrorCodes } from '@dolbyio/comms-uikit-react';
import { Routes as RoutesType } from '@src/types/routes';
import { Navigate, Route, Routes, useSearchParams } from 'react-router-dom';

import CreateEvent from './EventCreate';
import HostView from './EventHost/EventHost';
import EventRejoin from './EventRejoin';
import { EventView } from './EventView/EventView';
import RefreshPage from './ExpiredToken';

const Redirect = ({ pathname }: { pathname: RoutesType }) => {
  const [searchParams] = useSearchParams();

  return <Navigate replace to={{ pathname, search: `id=${searchParams.get('id')}` || undefined }} />;
};

const Router = () => {
  const { sdkErrors } = useErrors();
  return (
    <>
      <Routes>
        <Route path={RoutesType.EventCreate} element={<CreateEvent />} />
        <Route path={RoutesType.Host} element={<HostView />} />
        <Route path={RoutesType.Viewer} element={<EventView />} />
        <Route path={RoutesType.HostRejoin} element={<EventRejoin />} />
        <Route path="*" element={<Redirect pathname={RoutesType.EventCreate} />} />
      </Routes>
      {sdkErrors[ErrorCodes.ExpiredOrInvalidToken] && <RefreshPage />}
    </>
  );
};

export const Navigator = () => {
  return <Router />;
};
