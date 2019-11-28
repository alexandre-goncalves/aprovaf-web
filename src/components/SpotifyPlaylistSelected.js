import React from "react";
import { Switch, Route } from "react-router-dom";
import {
  Button,
  Checkbox,
  Form,
  Header,
  Message,
  Card,
  Image,
  Icon,
  Grid,
  Dimmer,
  Loader,
  List
} from "semantic-ui-react";
import BaseLayout from "../BaseLayout";
import api from "../server/api";
import * as _ from "lodash";

class SpotifyPlaylistSelected extends React.Component {
  constructor() {
    super();
    this.state = {
      playlist: null,
      loading: true,
      usersSelected: [],
      generating: false
    };
  }

  componentDidMount = async () => {
    const id = this.props.match.params.id;

    this.setState({
      loading: true
    });

    const result = await api.get("/spotify/playlist/" + id);

    if (result && result.ok) {
      this.setState({
        playlist: result.playlist
      });
    } else {
      console.error("ERRO");
    }

    this.setState({
      loading: false
    });
  };

  select = u => {
    const index = this.state.usersSelected.indexOf(u.id);
    if (index >= 0) {
      const copy = [...this.state.usersSelected];
      copy.splice(index, 1);

      this.setState({
        usersSelected: copy
      });
    } else {
      this.setState({
        usersSelected: [...this.state.usersSelected, u.id]
      });
    }
  };

  getImage(p) {}

  getUsers() {
    return _.uniqBy(
      this.state.playlist.tracks.map(p => p.added_by),
      u => u.id
    );
  }

  isUserSelected = u => {
    return this.state.usersSelected.indexOf(u.id) >= 0;
  };

  generate = async () => {
    this.setState({
      generating: true
    });

    const result = await api.post("/spotify/generate/", {
      source: this.state.playlist.id,
      users: this.state.usersSelected
    });

    this.setState({
      generating: false
    });

    if (result && result.ok) {
      this.props.history.push("/spotify/playing");
    } else {
      console.error("ERRO");
    }
  };

  render() {
    return (
      <BaseLayout>
        <Grid padded>
          <Grid.Column>
            {this.state.loading && !this.state.playlist ? (
              <Dimmer active inverted>
                <Loader inverted />
              </Dimmer>
            ) : (
              <React.Fragment>
                <Header style={{ marginBottom: "30px" }} as="h1">
                  {this.state.playlist.name}
                </Header>

                <Header as="h5">Escolha os usuários</Header>
                <List selection>
                  {this.getUsers().map(u => (
                    <List.Item
                      onClick={() => this.select(u)}
                      key={u.id}
                      active={this.isUserSelected(u)}
                    >
                      <List.Content>
                        <List.Header as="a">{u.uri}</List.Header>
                      </List.Content>
                    </List.Item>
                  ))}
                </List>

                {this.state.usersSelected.length ? (
                  <Button
                    onClick={this.generate}
                    loading={this.state.generating}
                    primary
                    fluid
                    size="big"
                  >
                    Gerar
                  </Button>
                ) : null}
              </React.Fragment>
            )}
          </Grid.Column>
        </Grid>
      </BaseLayout>
    );
  }
}

export default SpotifyPlaylistSelected;
