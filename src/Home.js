import React from "react";
import api from "./server/api";
import { Redirect } from "react-router-dom";

const Home = () => (api.hasUser() ? <Redirect to={"/user"}></Redirect> : null);

export default Home;
