import React, { useState, useEffect } from "react";
import Field from "../components/forms/Field";
import Select from "../components/forms/Select";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import CustomersAPI from "../services/customersAPI";
import InvoicesAPI from "../services/invoicesAPI";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

// 1. variables props
// 2. useState variables
// 3. useEffect variables
// 4. Handler
// 5. Custom Fonctions
const InvoicePage = ({ history, match }) => {
  const { id = "new" } = match.params;
  const [invoice, setInvoice] = useState({
    amout: "",
    customer: "",
    status: "SENT"
  });

  const [customers, setCustomers] = useState([]);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [errors, setErrors] = useState({
    amout: "",
    customer: "",
    status: ""
  });

  const fetchInvoice = async id => {
    try {
      const { amout, customer, status } = await InvoicesAPI.find(id);
      setInvoice({ amout, customer: customer.id, status });
    } catch (error) {
      console.log(error.response);
      history.replace("/invoices");
    }
  };

  const fetchCustomers = async () => {
    try {
      const data = await CustomersAPI.findAll();
      setCustomers(data);
      if (!invoice.customer) {
        setInvoice({
          ...invoice,
          customer: data[0].id
        });
      }
      setLoading(false);
    } catch (error) {
      console.log(error.response);
      toast.error("Error");
      history.replace("/invoices");
    }
  };

  // Récupération des clients de l'utilisateur
  useEffect(() => {
    fetchCustomers();
  }, []);

  // Récupération de l'invoice ID au changement d'ID
  useEffect(() => {
    if (id != "new") {
      fetchInvoice(id);
      setEditing(true);
    }
  }, [id]);

  // Gestion du changements des inputs dans le formulaire
  const handleChange = ({ currentTarget }) => {
    const { name, value } = currentTarget;
    setInvoice({ ...invoice, [name]: value });
  };

  const handleSubmit = async event => {
    event.preventDefault();
    console.log(invoice);

    try {
      if (!editing) {
        const response = await InvoicesAPI.create(invoice);
        history.replace("/invoices");
      } else {
        const response = await InvoicesAPI.update(id, invoice);
      }
    } catch ({ response }) {
      const { violations } = response.data;

      if (violations) {
        const apiErrors = {};
        violations.forEach(({ propertyPath, message }) => {
          apiErrors[propertyPath] = message;
        });
        console.log(violations);
        setErrors(apiErrors);
        toast.error("Error");
      }
    }
  };
  return (
    <>
      {(!editing && <h1>Création d'une facture</h1>) || (
        <h1>Modification de la facture {id}</h1>
      )}
      {!loading && (
        <form onSubmit={handleSubmit}>
          <Field
            name="amout"
            type="number"
            placeholder="Montant de la facture"
            onChange={handleChange}
            value={invoice.amout}
            error={errors.amout}
          />
          <Select
            name="customer"
            label="Client"
            value={invoice.customer}
            error={errors.customer}
            onChange={handleChange}
          >
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName}
              </option>
            ))}
          </Select>
          <Select
            name="status"
            label="Statut"
            value={invoice.status}
            error={errors.status}
            onChange={handleChange}
          >
            <option value="SENT">Envoyé</option>
            <option value="PAID">Payée</option>
            <option value="CANCELLED">Annulée</option>
          </Select>
          <div className="form-group">
            <button type="submit" className="btn btn-primary">
              Enregistrer
            </button>
            <Link to="/invoices" className="btn btn-link">
              Retour
            </Link>
          </div>
        </form>
      )}
      {loading && <TableLoader />}
    </>
  );
};

export default InvoicePage;
