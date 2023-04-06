import { Routes } from '@src/types/routes';
import { generatePath } from 'react-router-dom';

export function getEventCreatePath() {
  return generatePath(Routes.EventCreate);
}

export function getHostPath(eventId: string) {
  return generatePath(Routes.Host, { id: encodeURIComponent(eventId) });
}

export function getViewerPath(eventId: string) {
  return generatePath(Routes.Viewer, { id: encodeURIComponent(eventId) });
}

export function getHostExitPath(eventId: string) {
  return generatePath(Routes.HostExit, { id: encodeURIComponent(eventId) });
}
