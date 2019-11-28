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
  List,
  Progress
} from "semantic-ui-react";
import BaseLayout from "../BaseLayout";
import api from "../server/api";
import * as _ from "lodash";
import * as moment from "moment";
import "moment-duration-format";

class SpotifyPlaying extends React.Component {
  constructor() {
    super();
    this.state = {
      playlist: null,
      loading: true,
      nowPlaying: null,
      total: 0,
      progress: 0
    };
  }

  componentDidMount = async () => {
    this.setState({
      loading: true
    });

    const result = await api.get("/spotify/aprovafy/");

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

    setInterval(async () => {
      const result = await api.get("/spotify/now-playing/");
      if (result && result.ok) {
        this.setState({
          nowPlaying: result.track,
          total: result.total,
          progress: result.progress
        });
      } else {
        console.error("ERRO");
      }
    }, 1000);
  };

  getImage(a) {
    let url = "";

    if (a.images && a.images.length) {
      const ordered = _.reverse(_.sortBy(a.images, i => i.width || i.height));
      url = ordered[0].url;
    }

    return url;
  }

  getPercent() {
    return Math.abs((this.state.progress * 100) / this.state.total);
  }

  getText() {
    const minutesTotal = this.state.total / 60000;
    const minutesProgress = this.state.progress / 60000;

    return `${moment
      .duration(minutesProgress, "minutes")
      .format("mm:ss")} - ${moment
      .duration(minutesTotal, "minutes")
      .format("mm:ss")}`;
  }
  isCurrent(track) {
    return this.state.nowPlaying && this.state.nowPlaying.id === track.id;
  }

  getNext() {
    if (!this.state.nowPlaying) return [];

    let nexts = [];

    const nextMax = this.getItemsPerRow();

    const currentSong = _.first(
      this.state.playlist.tracks.filter(
        s => s.track.id === this.state.nowPlaying.id
      )
    );
    let currentIndex = this.state.playlist.tracks.indexOf(currentSong);

    if (currentIndex < 0) return [];

    for (let i = 1; i < nextMax; i++) {
      const nextIndex = currentIndex + 1;
      if (
        this.state.playlist.tracks[nextIndex] &&
        this.state.playlist.tracks[nextIndex].track
      ) {
        nexts.push(this.state.playlist.tracks[nextIndex].track);
      }

      currentIndex = nextIndex;
    }

    return nexts;
  }

  getItemsPerRow() {
    return window.screen.width <= 1400 ? 2 : 3;
  }

  render() {
    return (
      <BaseLayout fluid>
        <Grid padded>
          <Grid.Column>
            {this.state.loading &&
            !this.state.playlist &&
            !this.state.nowPlaying ? (
              <Dimmer active inverted>
                <Loader inverted />
              </Dimmer>
            ) : (
              <React.Fragment>
                <Header style={{ marginBottom: "30px" }} as="h1">
                  {this.state.playlist.name}
                </Header>

                <Header as="h5">Tocando agora ...</Header>
                {this.state.nowPlaying ? (
                  <Card.Group itemsPerRow={this.getItemsPerRow()}>
                    <Card link color="green">
                      <Image
                        size="small"
                        src={this.getImage(this.state.nowPlaying.album)}
                        wrapped
                        ui={false}
                      />
                      <Card.Content>
                        <Card.Header>
                          {this.state.nowPlaying.name}-{" "}
                          <b>
                            {this.state.nowPlaying.artists
                              .map(a => a.name)
                              .join(",")}
                          </b>
                        </Card.Header>
                        <Card.Meta>
                          <span className="date">{`${moment(
                            this.state.nowPlaying.album.release_date
                          ).format("L")} ${moment(
                            this.state.nowPlaying.album.release_date
                          ).fromNow()}`}</span>
                        </Card.Meta>
                        <Card.Description>
                          {this.state.nowPlaying.album.name}
                        </Card.Description>
                      </Card.Content>
                      <Card.Content extra>
                        <Progress
                          size={"small"}
                          active
                          indicating
                          percent={this.getPercent()}
                        >
                          {this.getText()}
                        </Progress>
                      </Card.Content>
                    </Card>
                    {this.getNext().map(t => (
                      <Card>
                        <Image
                          size="small"
                          src={this.getImage(t.album)}
                          wrapped
                          ui={false}
                        />
                        <Card.Content>
                          <Card.Header>
                            {t.name}-{" "}
                            <b>{t.artists.map(a => a.name).join(",")}</b>
                          </Card.Header>
                          <Card.Meta>
                            <span className="date">{`${moment(
                              t.album.release_date
                            ).format("L")} ${moment(
                              t.album.release_date
                            ).fromNow()}`}</span>
                          </Card.Meta>
                          <Card.Description>{t.album.name}</Card.Description>
                        </Card.Content>
                      </Card>
                    ))}
                  </Card.Group>
                ) : null}

                <Card fluid>
                  <Card.Content>
                    <Card.Header>Fila</Card.Header>
                  </Card.Content>
                  <Card.Content>
                    <List divided selection>
                      {this.state.playlist.tracks.map(t => (
                        <List.Item
                          active={this.isCurrent(t.track)}
                          key={t.track.id}
                        >
                          <Image avatar src={this.getImage(t.track.album)} />
                          <List.Content>
                            <List.Header as="a">
                              {t.track.name} -{" "}
                              <b>
                                {t.track.artists.map(a => a.name).join(",")}
                              </b>
                            </List.Header>
                            <List.Description>
                              {t.track.album.name}
                              <br />
                              {`${moment(t.track.album.release_date).format(
                                "L"
                              )} (${moment(
                                t.track.album.release_date
                              ).fromNow()})`}
                              <br />
                            </List.Description>
                          </List.Content>
                        </List.Item>
                      ))}
                    </List>
                  </Card.Content>
                </Card>
              </React.Fragment>
            )}
          </Grid.Column>
        </Grid>
      </BaseLayout>
    );
  }
}

export default SpotifyPlaying;
