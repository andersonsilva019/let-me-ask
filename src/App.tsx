import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext';
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from './pages/Room';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/rooms/new" exact component={NewRoom} />
          <Route path="/rooms/:roomId" component={Room} />
        </Switch>
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
