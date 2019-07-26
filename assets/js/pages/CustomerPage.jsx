import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import { Link } from "react-router-dom";
import CustomerAPI from "../services/customersAPI";

const CustomerPage = ({ match, history }) => {
  const { id = "new" } = match.params;

  const [customer, setCustomer] = useState({
    lastName: "",
    firstName: "",
    company: "",
    email: ""
  });

  const [errors, setErrors] = useState({
    lastName: "",
    firstName: "",
    company: "",
    email: ""
  });

  const [editing, setEditing] = useState(false);

  // recupération du customer id
  const fetchCustomer = async id => {
    try {
      const { firstName, lastName, email, company } = await CustomerAPI.find(
        id
      );

      setCustomer({ firstName, lastName, email, company });
    } catch (error) {
      console.log(error.response);
    }
  };

  // chargement du customer si besoin au chargement du composant ou au changement de l'identifiant

  useEffect(() => {
    if (id !== "new") {
      setEditing(true);
      fetchCustomer(id);
    }
  }, [id]);

  // Gestion du changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setCustomer({ ...customer, [name]: value });
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async event => {
    event.preventDefault();

    try {
      if (editing) {
        const response = await CustomerAPI.update(id, customer);
        console.log(response.data);
      } else {
        const response = await CustomerAPI.create(customer);
        // flash notification success
        history.replace("/customers");
      }
      setErrors({});
    } catch ({ response }) {
      const { violations } = response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        setErrors(apiErrors);
      }
    }
  };

  return (
    <>
      {(!editing && <h1>Création d'un client</h1>) || (
        <h1>Modification du client {id}</h1>
      )}
      <form onSubmit={handleSubmit}>
        <Field
          name="lastName"
          label="Quel est votre nom ?"
          placeholder="nom de famille"
          value={customer.lastName}
          onChange={handleChange}
          error={errors.lastName}
        />
        <Field
          name="firstName"
          label="Quel est votre prénom ?"
          placeholder="prénom"
          value={customer.firstName}
          onChange={handleChange}
          error={errors.firstName}
        />
        <Field
          name="email"
          label="Email ?"
          placeholder="mail"
          value={customer.email}
          onChange={handleChange}
          error={errors.email}
        />
        <Field
          name="company"
          label="compagny ?"
          value={customer.company}
          onChange={handleChange}
          error={errors.company}
        />
        <div className="form-group">
          <button type="submit" className="btn btn-success">
            Enregister
          </button>
          <Link to="/customers" className="btn btn-link">
            Retour
          </Link>
        </div>
      </form>
    </>
  );
};

export default CustomerPage;
