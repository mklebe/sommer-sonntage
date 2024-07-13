import React from "react";
import { provideDataStream } from "@ts/datastream";

import { AppController } from "./AppController";
import { Viewer3D } from "./Viewer3D";

export const App = () => {
  const appController = new AppController();
  const ConnectedAppRoot = provideDataStream(appController.dataStream)(Viewer3D);
  return <ConnectedAppRoot />;
};
