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
  Loader
} from "semantic-ui-react";
import BaseLayout from "../BaseLayout";
import api from "../server/api";
import * as _ from "lodash";

class SpotifyPlaylists extends React.Component {
  constructor() {
    super();
    this.state = {
      playlists: [],
      loading: false
    };
  }

  componentDidMount = async () => {
    this.setState({
      loading: true
    });

    const result = await api.get("/spotify/playlists/");

    this.setState({
      loading: false
    });

    if (result && result.ok) {
      this.setState({
        playlists: result.playlists
      });
    } else {
      console.error("ERRO");
    }
  };

  select = async p => {
    this.props.history.push("/spotify/playlists/" + p.id);
  };

  getImage(p) {
    let url = "";

    if (p.images && p.images.length) {
      const ordered = _.reverse(_.sortBy(p.images, i => i.width || i.height));
      url = ordered[0].url;
    }

    return url;
  }

  getItemsPerRow() {
    if (window.screen.width <= 1400) {
      return 3;
    }

    return 4;
  }

  render() {
    return (
      <BaseLayout fluid>
        <Grid padded>
          <Grid.Column>
            <Header style={{ marginBottom: "30px" }} as="h1">
              Escolha uma playlist de origem
            </Header>

            {this.state.loading ? (
              <Dimmer active inverted>
                <Loader inverted />
              </Dimmer>
            ) : (
              <Card.Group itemsPerRow={this.getItemsPerRow()}>
                {this.state.playlists.map(p => (
                  <Card key={p.uri}>
                    <div className="ui image">
                      <Image
                        style={{ maxHeight: "454px" }}
                        src={this.getImage(p)}
                      />
                    </div>

                    <Card.Content>
                      <Card.Header>{p.name}</Card.Header>
                      <Card.Meta>
                        <code>{p.uri}</code>
                      </Card.Meta>
                      <Card.Description>{p.description}</Card.Description>
                    </Card.Content>
                    <Card.Content extra>
                      <a
                        style={{ width: "100%" }}
                        onClick={() => this.select(p)}
                      >
                        Selecionar
                        <Icon style={{ float: "right" }} name="arrow right" />
                      </a>
                    </Card.Content>
                  </Card>
                ))}
              </Card.Group>
            )}
          </Grid.Column>
        </Grid>
      </BaseLayout>
    );
  }
}

export default SpotifyPlaylists;
