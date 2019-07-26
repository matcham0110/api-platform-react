import React, { useState } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import UsersAPI from "../services/usersAPI";

const RegisterPage = ({ history }) => {
  const [user, setUser] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    passwordConfirm: ""
  });

  // Gestion du changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setUser({ ...user, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    const apiErrors = {};
    if (user.password === user.passwordConfirm) {
      apiErrors.passwordConfirm =
        "Votre confirmation de mot de passe est fausse";
      setErrors(apiErrors);
    }
    try {
      UsersAPI.register(user);
      setErrors({});
      history.replace("/login");
    } catch (error) {
      const { violations } = error.response.data;
      if (violations) {
        violations.forEach(violation => {
          apiErrors[violation.propertyPath] = violation.message;
        });
        setErrors(apiErrors);
      }
    }
    console.log(user);
  };

  return (
    <>
      <h1>Inscription</h1>
      <form onSubmit={handleSubmit}>
        <Field
          name="firstName"
          label="Prénom"
          placeholder="Votre prénom"
          error={errors.firstName}
          onChange={handleChange}
        />
        <Field
          name="lastName"
          label="nom"
          placeholder="Votre nom"
          error={errors.lastName}
          onChange={handleChange}
        />
        <Field
          name="email"
          label="Email"
          placeholder="Votre Email"
          error={errors.email}
          onChange={handleChange}
          type="email"
        />
        <Field
          name="password"
          label="Mot de passe"
          type="password"
          placeholder="Rentrez mdp"
          error={errors.password}
          onChange={handleChange}
        />
        <Field
          name="passwordConfirm"
          label="Mot de passe confirmation"
          type="password"
          placeholder="Votre mdp ultra secure"
          error={errors.passwordConfirm}
          onChange={handleChange}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Inscription
          </button>
        </div>
        <Link to="/login" className="btn btn-link">
          J'ai déja un compte
        </Link>
      </form>
    </>
  );
};

export default RegisterPage;
