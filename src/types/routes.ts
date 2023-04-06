export enum Routes {
  EventCreate = '/',
  Host = `/:id`,
  Viewer = '/:id/watch',
  HostExit = '/:id/exit',
}

export enum CreateStep {
  userSetup = 0,
  deviceSetup = 1,
}
