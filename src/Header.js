import React from "react";
import { Link } from "react-router-dom";
import { Menu } from "semantic-ui-react";
import { Container } from "semantic-ui-react";
import * as api from "./server/api";

export default class Header extends React.Component {
  logout = async () => {
    await api.default.doRequest("post", "/user/logout", {});
    api.default.removeUser();
  };

  render() {
    return (
      <Menu fixed="top" inverted>
        <Container>
          <Menu.Item header>
            <Link to="/">Home</Link>
          </Menu.Item>
          <Menu.Item header>
            <Link to="/spotify">Spotify</Link>
          </Menu.Item>
          <Menu.Menu position="right">
            <Menu.Item link onClick={this.logout}>
              Logout
            </Menu.Item>
          </Menu.Menu>
        </Container>
      </Menu>
    );
  }
}
