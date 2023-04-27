import { useErrors, ErrorCodes } from '@dolbyio/comms-uikit-react';
import { Routes as RoutesType } from '@src/types/routes';
import { Navigate, Route, Routes } from 'react-router-dom';

import { CreateEvent } from './CreateEvent/CreateEvent';
import RefreshPage from './ExpiredToken';
import { Host } from './Host/Host';
import { Viewer } from './Viewer/Viewer';

const Redirect = ({ pathname }: { pathname: RoutesType }) => {
  return <Navigate replace to={{ pathname }} />;
};

const Router = () => {
  const { sdkErrors } = useErrors();
  return (
    <>
      <Routes>
        <Route path={RoutesType.CreateEvent} element={<CreateEvent />} />
        <Route path={RoutesType.Host} element={<Host />} />
        <Route path={RoutesType.Viewer} element={<Viewer />} />
        <Route path="*" element={<Redirect pathname={RoutesType.CreateEvent} />} />
      </Routes>
      {sdkErrors[ErrorCodes.ExpiredOrInvalidToken] && <RefreshPage />}
    </>
  );
};

export const Navigator = () => {
  return <Router />;
};
