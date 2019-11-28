import React from "react";
import { Switch, Route } from "react-router-dom";
import { Button, Checkbox, Form, Header } from "semantic-ui-react";
import BaseLayout from "../BaseLayout";
import api from "../server/api";

class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      email: "",
      password: "",
      loading: false
    };
  }

  login = async () => {
    this.setState({
      loading: true
    });

    const result = await api.post("/user/login", {
      email: this.state.email,
      password: this.state.password
    });

    if (result && result.ok) {
      api.setUser(result.user);
      this.props.history.push("/");
    } else {
      console.error("ERRO");
    }

    this.setState({
      loading: false
    });
  };

  render() {
    return (
      <BaseLayout>
        <Header as="h1">Login</Header>
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
          <Button loading={this.state.loading} onClick={this.login}>
            Entrar
          </Button>
        </Form>
      </BaseLayout>
    );
  }
}

export default Login;
