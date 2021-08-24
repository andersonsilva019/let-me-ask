import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { Home } from "./pages/Home";
import { NewRoom } from "./pages/NewRoom";

function App() {
  return (
    // <Home />
    <BrowserRouter>
      <Switch>
        <Route path="/" component={Home} exact />
        <Route path="/rooms/new" component={NewRoom} />
      </Switch>
    </BrowserRouter>
  );
}

export default App;
