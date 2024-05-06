import React, { ReactNode } from 'react';
import App from './App';

type DrivelineClient = {
  root: HTMLElement;
  ssr: boolean;
  ready: (ready: () => void) => void;
  render: (element: ReactNode) => void;
};

export default ({ render }: DrivelineClient) => {
  render(<App />);
};
