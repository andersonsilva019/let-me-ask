import 'react-toastify/dist/ReactToastify.css';
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { AuthContextProvider } from './context/AuthContext';
import { AdminRoom } from './pages/AdminRoom';
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";
import { Room } from './pages/Room';
import { ToastContainer } from 'react-toastify';

function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Switch>
          <Route path="/" component={Home} exact />
          <Route path="/rooms/new" component={NewRoom} />
          <Route path="/rooms/:roomId" component={Room} />

          <Route path="/admin/rooms/:roomId" component={AdminRoom} />
        </Switch>
        <ToastContainer autoClose={3000} />
      </AuthContextProvider>
    </BrowserRouter>
  );
}

export default App;
