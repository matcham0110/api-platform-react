import React, { useState, useContext } from "react";
import axios from "axios";
import CustomersAPI from "../services/customersAPI";
import authApi from "../services/authApi";
import AuthContext from "../contexts/AuthContext";

const LoginPage = ({ onLogin, history }) => {
  const { setIsAuthenticated } = useContext(AuthContext);

  const [credentials, setCredentials] = useState({
    username: "",
    password: ""
  });

  const [error, setError] = useState("");

  // Gestion des inputs
  const handleChange = ({ currentTarget }) => {
    const { value, name } = currentTarget;

    setCredentials({ ...credentials, [name]: value });
  };
  // Gestion au submit authentification
  const handleSubmit = async event => {
    event.preventDefault();
    console.log(credentials);

    try {
      await authApi.authenticate(credentials);
      setError("");
      setIsAuthenticated(true);
      history.replace("/customers");
    } catch (error) {
      setError("Aucun compte ne posséde cette combinaison");
    }
    console.log(error);
  };
  return (
    <>
      <h1>Connexion à l'application</h1>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="username">Adresse mail</label>
          <input
            type="email"
            className={"form-control" + (error && " is-invalid")}
            placeholder="adresse mail"
            id="username"
            name="username"
            value={credentials.username}
            onChange={handleChange}
          />
        </div>
        {error && <p className="invalid-feedback">{error}</p>}
        <div className="form-group">
          <label htmlFor="password">Mot de passe</label>
          <input
            type="password"
            className="form-control"
            placeholder="mot de passe"
            id="password"
            name="password"
            value={credentials.password}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Connexion
          </button>
        </div>
        <div className="form-group">
          <button type="submit" className="btn btn-info">
            Inscription
          </button>
        </div>
      </form>
    </>
  );
};

export default LoginPage;
