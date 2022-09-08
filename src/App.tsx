import { Switch, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import TestConnect from './pages/TestConnect';

const App = () => (
  <Switch>
    <Route exact path="/home-page" component={HomePage} />
    <Route exact path="/test-connect" component={TestConnect} />
  </Switch>
);

export default App;
