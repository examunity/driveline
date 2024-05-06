import { AppRegistry } from 'react-native';
import App from './App';

export default ({ ready, rootTag }) => {
  ready(() => {
    AppRegistry.registerComponent('App', () => App);

    AppRegistry.runApplication('App', {
      initialProps: {},
      rootTag,
    });
  });
};
