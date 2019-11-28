import React from "react";
import { Switch, Route } from "react-router-dom";
import { Button, Checkbox, Form, Header } from "semantic-ui-react";
import BaseLayout from "../BaseLayout";
import api from "../server/api";

class SpotifyAuth extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false
    };
  }

  auth = async () => {
    this.setState({
      loading: true
    });

    const result = await api.get("/spotify");

    this.setState({
      loading: false
    });

    if (result && result.ok) {
      window.location.href = result.url;
    } else {
      console.error("ERRO");
    }
  };

  render() {
    return (
      <BaseLayout>
        <Header as="h1">Autenticação spotify</Header>
        <Button
          loading={this.state.loading}
          color="green"
          size="large"
          onClick={this.auth}
        >
          Autenticar
        </Button>
      </BaseLayout>
    );
  }
}

export default SpotifyAuth;
