import React from "react";
import { Switch, Route } from "react-router-dom";
import { Button, Checkbox, Form, Header, Message } from "semantic-ui-react";
import BaseLayout from "../BaseLayout";
import api from "../server/api";

class SpotifyCallback extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      authOK: false
    };
  }

  componentDidMount = async () => {
    this.setState({
      loading: true,
      authOK: false
    });

    const params = new URLSearchParams(this.props.location.search);
    const code = params.get("code");

    const result = await api.post("/spotify/auth/" + code, {});

    this.setState({
      loading: false
    });

    if (result && result.ok) {
      this.setState({
        authOK: true
      });

      this.props.history.push("/spotify/playlists");
    } else {
      console.error("ERRO");
    }
  };

  render() {
    return (
      <BaseLayout>
        <Header as="h1">Spotify callback</Header>
        {!this.state.authOK ? (
          <Message>Autenticando ...</Message>
        ) : (
          <Message success>Autenticado com sucesso!</Message>
        )}
      </BaseLayout>
    );
  }
}

export default SpotifyCallback;
