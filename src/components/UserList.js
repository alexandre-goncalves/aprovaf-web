import React from "react";
import { Switch, Route } from "react-router-dom";
import {
  Button,
  Checkbox,
  Form,
  Header,
  Table,
  Dimmer,
  Loader,
  Message,
  Grid
} from "semantic-ui-react";
import BaseLayout from "../BaseLayout";
import api from "../server/api";

class UserList extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      list: []
    };
  }

  async componentWillMount() {
    this.setState({
      loading: true
    });

    const result = await api.get("/user");

    this.setState({
      loading: false
    });

    if (result && result.ok) {
      this.setState({
        list: result.list
      });
    } else {
      console.error("ERRO");
    }
  }

  render() {
    return (
      <BaseLayout>
        <Grid columns={2}>
          <Grid.Column>
            <Header as="h1">Lista de usuários</Header>
          </Grid.Column>
          <Grid.Column textAlign="right">
            <Button
              onClick={() => this.props.history.push("/user/new")}
              size="small"
              primary
            >
              Criar usuário
            </Button>
          </Grid.Column>
        </Grid>
        {this.state.loading ? (
          <Dimmer active>
            <Loader />
          </Dimmer>
        ) : this.state.list.length ? (
          <Table celled>
            <Table.Header>
              <Table.Row>
                <Table.HeaderCell>Email</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>
              {this.state.list.map(l => (
                <Table.Row key={l._id}>
                  <Table.Cell>{l.email}</Table.Cell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
        ) : (
          <Message>Nenhum registro encontrado</Message>
        )}
      </BaseLayout>
    );
  }
}

export default UserList;
