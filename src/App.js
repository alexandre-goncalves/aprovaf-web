import React from "react";
import Header from "./Header";
import Main from "./Main";
import { Redirect } from "react-router-dom";
import "semantic-ui-css/semantic.min.css";
import { Icon, Label, Menu, Table } from "semantic-ui-react";

class App extends React.Component {
  render() {
    return (
      <React.Fragment>
        <Main></Main>
      </React.Fragment>
    );
  }
}

export default App;
