import React from "react";
import { Switch, Route } from "react-router-dom";
import { Button, Checkbox, Form, Header } from "semantic-ui-react";
import BaseLayout from "../BaseLayout";
import api from "../server/api";

class UserNew extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false
    };
  }

  save = async () => {
    if (!this.state.email || !this.state.password) {
      return;
    }

    this.setState({
      loading: true
    });

    const result = await api.post("/user", {
      email: this.state.email,
      password: this.state.password
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
        <Header as="h1">Novo usuário</Header>

        <Form>
          <Form.Field>
            <label>E-mail</label>
            <input
              placeholder="Informe seu email..."
              onChange={e => this.setState({ email: e.target.value })}
            />
          </Form.Field>
          <Form.Field>
            <label>Senha</label>
            <input
              placeholder="Informe sua senha..."
              type="password"
              onChange={e => this.setState({ password: e.target.value })}
            />
          </Form.Field>
          <Button loading={this.state.loading} onClick={this.save}>
            Salvar
          </Button>
        </Form>
      </BaseLayout>
    );
  }
}

export default UserNew;
