import React from 'react';
import {LogBox} from 'react-native';
import Providers from './navigation';

LogBox.ignoreAllLogs([
  'VirtualizedLists should never be nested inside plain ScrollViews with the same orientation because it can break windowing and other functionality - use another VirtualizedList-backed container instead.',
  "ViewPropTypes will be removed from React Native  Migrate to ViewPropTypes exported from 'deprecated-react-native-prop-types'.",
]);

const App = () => {
  return <Providers />;
};

export default App;
