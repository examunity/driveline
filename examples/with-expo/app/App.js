import React, { Suspense } from 'react';
import { StatusBar } from 'expo-status-bar';
import { View, StyleSheet } from 'react-native';
import lazy from 'driveline/lazy';

const Chunk = lazy(() => import('./Chunk'));

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

function App() {
  return (
    <Suspense>
      <View style={styles.container}>
        <Chunk />
        <StatusBar />
      </View>
    </Suspense>
  );
}

export default App;
