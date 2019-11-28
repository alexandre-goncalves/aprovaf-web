import React from "react";
import { Switch, Route } from "react-router-dom";
import {
  Button,
  Checkbox,
  Form,
  Header,
  Dimmer,
  Loader
} from "semantic-ui-react";
import BaseLayout from "../BaseLayout";
import api from "../server/api";

class UserNew extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      aprovafyId: "",
      aprovafyUri: "",
      loading: false,
      loadingUser: false
    };
  }

  async componentWillMount() {
    const id = this.props.match.params.id;

    this.setState({
      loading: true
    });

    if (id) {
      const result = await api.get("/user/" + id);

      if (result && result.ok) {
        this.setState({
          email: result.user.email,
          aprovafyUri: result.user.aprovafyUri,
          aprovafyId: result.user.aprovafyId
        });
      } else {
        console.error("ERRO");
      }
    }

    this.setState({
      loading: false
    });
  }

  save = async () => {
    if (
      !this.state.email ||
      !this.state.password ||
      !this.state.aprovafyId ||
      !this.state.aprovafyUri
    ) {
      return;
    }

    this.setState({
      loading: true
    });

    const id = this.props.match.params.id;
    let url = id ? `/user/${id}` : "/user";

    const result = await api.post(url, {
      email: this.state.email,
      password: this.state.password,
      aprovafyId: this.state.aprovafyId,
      aprovafyUri: this.state.aprovafyUri
    });

    this.setState({
      loading: false
    });

    if (result && result.ok) {
      this.props.history.push("/user");
    } else {
      console.error("ERRO");
    }
  };

  render() {
    return (
      <BaseLayout>
        <Header as="h1">Cadastro usuário</Header>
        {this.state.loadingUser ? (
          <Dimmer active inverted>
            <Loader inverted />
          </Dimmer>
        ) : (
          <Form>
            <Form.Field>
              <label>E-mail</label>
              <input
                value={this.state.email}
                placeholder="Informe seu email..."
                onChange={e => this.setState({ email: e.target.value })}
              />
            </Form.Field>
            <Form.Field>
              <label>Senha</label>
              <input
                value={this.state.password}
                placeholder="Informe sua senha..."
                type="password"
                onChange={e => this.setState({ password: e.target.value })}
              />
            </Form.Field>

            <Form.Field>
              <label>URL</label>
              <input
                value={this.state.aprovafyUri}
                placeholder="Informe a URL da sua playlist Aprovafy..."
                onChange={e => this.setState({ aprovafyUri: e.target.value })}
              />
            </Form.Field>

            <Form.Field>
              <label>ID</label>
              <input
                value={this.state.aprovafyId}
                placeholder="Informe o ID da sua playlist Aprovafy..."
                onChange={e => this.setState({ aprovafyId: e.target.value })}
              />
            </Form.Field>
            <Button loading={this.state.loading} onClick={this.save}>
              Salvar
            </Button>
          </Form>
        )}
      </BaseLayout>
    );
  }
}

export default UserNew;
