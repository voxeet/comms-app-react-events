export enum Routes {
  EventCreate = '/',
  Host = `/:id`,
  Viewer = '/:id/watch',
  HostRejoin = '/:id/rejoin',
}

export enum CreateStep {
  userSetup = 0,
  deviceSetup = 1,
}
