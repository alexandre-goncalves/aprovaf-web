import React from "react";
import { Container, Header } from "semantic-ui-react";
import CustomHeader from "./Header";
import api from "./server/api";

class BaseLayout extends React.Component {
  render() {
    return (
      <React.Fragment>
        {api.hasUser() ? <CustomHeader></CustomHeader> : null}

        <Container
          fluid={this.props.fluid}
          text={!this.props.fluid}
          style={{ marginTop: "4em" }}
        >
          {this.props.children}
        </Container>
      </React.Fragment>
    );
  }
}

export default BaseLayout;

/*
checkLogin() {
    let url = "";
    let isLogin = window.location.pathname === "login";

    if (!isLogin) {
      if (api.hasUser()) {
        url = "/user";
      } else {
        url = "/login";
      }

      return url;
    }
  }
 */
