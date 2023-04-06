import { useErrors, ErrorCodes } from '@dolbyio/comms-uikit-react';
import { Routes as RoutesType } from '@src/types/routes';
import { ungatedFeaturesEnabled } from '@src/utils/env';
import { Navigate, Route, Routes } from 'react-router-dom';

import CreateEvent from './EventCreate';
import HostView from './EventHost/EventHost';
import EventRejoin from './EventRejoin';
import { EventView } from './EventView/EventView';
import RefreshPage from './ExpiredToken';
import { DemoEnded } from './Ungated/PostDemo/DemoEnded';

const Redirect = ({ pathname }: { pathname: RoutesType }) => {
  return <Navigate replace to={{ pathname }} />;
};

const Router = () => {
  const { sdkErrors } = useErrors();
  return (
    <>
      <Routes>
        <Route path={RoutesType.EventCreate} element={<CreateEvent />} />
        <Route path={RoutesType.Host} element={<HostView />} />
        <Route path={RoutesType.Viewer} element={<EventView />} />
        <Route path={RoutesType.HostExit} element={ungatedFeaturesEnabled() ? <DemoEnded /> : <EventRejoin />} />
        <Route path="*" element={<Redirect pathname={RoutesType.EventCreate} />} />
      </Routes>
      {sdkErrors[ErrorCodes.ExpiredOrInvalidToken] && <RefreshPage />}
    </>
  );
};

export const Navigator = () => {
  return <Router />;
};
