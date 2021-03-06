import React, { useState, useContext } from "react";
import axios from "axios";
import CustomersAPI from "../services/customersAPI";
import authApi from "../services/authApi";
import AuthContext from "../contexts/AuthContext";
import Field from "../components/forms/Field";
import { toast } from "react-toastify";

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
      toast.success("Vous êtes connecté ! 🎩");
      history.replace("/customers");
    } catch (error) {
      setError("Aucun compte ne posséde cette combinaison");
      toast.error("Une erreur est survenue");
    }
    console.log(error);
  };
  return (
    <>
      <h1>Connexion à l'application</h1>

      <form onSubmit={handleSubmit}>
        <Field
          name="username"
          label="Adresse email"
          value={credentials.username}
          onChange={handleChange}
          placeholder="Mail"
          type="email"
          error={error}
        />
        <Field
          name="password"
          label="Mot de passe"
          value={credentials.password}
          onChange={handleChange}
          placeholder="Mdp"
          type="password"
        />
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
