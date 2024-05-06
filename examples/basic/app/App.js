import React, { Suspense } from 'react';
import lazy from 'driveline/lazy';

const Chunk = lazy(() => import('./Chunk'));

function App() {
  return (
    <Suspense>
      <Chunk />
    </Suspense>
  );
}

export default App;
