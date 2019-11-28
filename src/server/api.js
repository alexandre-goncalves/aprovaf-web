import * as axios from "axios";

class Api {
  url = "http://localhost:4000";
  key = "aprovafy-user";

  async post(path, data) {
    return await this.doRequest("post", path, data);
  }

  async get(path) {
    return await this.doRequest("get", path, {});
  }

  async doRequest(method, path, data) {
    try {
      let user = this.getUser();
      let result = { data: null };
      let headersObj = {
        headers: {
          Authorization: user ? user.token : ""
        }
      };

      if (method === "get") {
        result = await axios.default.get(this.url + path, headersObj);
      } else {
        result = await axios.default[method](this.url + path, data, headersObj);
      }

      return result.data;
    } catch (error) {
      console.error(error);
      if (error.response.status === 401) {
        window.location.href = "/login";
      } else {
        return error.toJSON();
      }
    }
  }

  removeUser() {
    localStorage.removeItem(this.key);
  }

  setUser(user) {
    let json = JSON.stringify(user);
    localStorage.setItem(this.key, json);
  }

  getUser() {
    let json = localStorage.getItem(this.key);
    let user = null;

    if (json) {
      user = JSON.parse(json);
    }

    return user;
  }

  hasUser() {
    let user = this.getUser();
    return user !== null;
  }
}

export default new Api();
