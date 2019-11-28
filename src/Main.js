import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "./Home";
import UserNew from "./components/UserNew";
import UserList from "./components/UserList";
import Login from "./components/Login";
import SpotifyAuth from "./components/SpotifyAuth";
import SpotifyCallback from "./components/SpotifyCallback";
import SpotifyPlaylists from "./components/SpotifyPlaylists";
import SpotifyPlaylistSelected from "./components/SpotifyPlaylistSelected";
import SpotifyPlaying from "./components/SpotifyPlaying";

import api from "./server/api";

class GeneralRoute extends React.Component {
  can = () => {
    return api.hasUser();
  };
  render() {
    if (this.can()) {
      return (
        <Route
          path={this.props.path}
          exact={this.props.exact}
          component={this.props.component}
        />
      );
    }

    return <Redirect to="/login"></Redirect>;
  }
}

class AnonymousRoute extends React.Component {
  render() {
    return (
      <Route
        path={this.props.path}
        exact={this.props.exact}
        component={this.props.component}
      />
    );
  }
}

// The Main component renders one of the three provided
// Routes (provided that one matches). Both the /roster
// and /schedule routes will match any pathname that starts
// with /roster or /schedule. The / route will only match
// when the pathname is exactly the string "/"
const Main = () => (
  <main>
    <Switch>
      <AnonymousRoute exact path="/login" component={Login} />

      <GeneralRoute exact path="/" component={Home} />
      <GeneralRoute exact path="/user" component={UserList} />
      <GeneralRoute exact path="/user/new" component={UserNew} />

      <GeneralRoute exact path="/spotify" component={SpotifyAuth} />
      <GeneralRoute
        exact
        path="/spotify/callback"
        component={SpotifyCallback}
      />

      <GeneralRoute
        exact
        path="/spotify/playlists"
        component={SpotifyPlaylists}
      />

      <GeneralRoute
        exact
        path="/spotify/playlists/:id"
        component={SpotifyPlaylistSelected}
      />

      <GeneralRoute exact path="/spotify/playing" component={SpotifyPlaying} />
    </Switch>
  </main>
);

export default Main;
