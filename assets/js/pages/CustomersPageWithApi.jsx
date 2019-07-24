import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "../components/Pagination";

const CustomersPageWithApi = props => {
  const [customers, setCustomers] = useState([]);
  const [totalItems, setTotalItems] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 8;

  useEffect(() => {
    axios
      .get(
        `http://localhost:8000/api/customers?pagination=true&count=${itemsPerPage}&page=${currentPage}`
      )
      .then(response => {
        setCustomers(response.data["hydra:member"]);
        setTotalItems(response.data["hydra:totalItems"]);
        setLoading(false);
      })
      .catch(error => console.log(error.response));
  }, [currentPage]);

  const handleDelete = id => {
    const originalCustomers = [...customers];
    // Approche optimiste (cache avant validation API)
    setCustomers(customers.filter(customer => customer.id !== id));
    // Approche pessimiste (cache aprés validation API)
    axios
      .delete("http://localhost:8000/api/customers/" + id)
      .then(response => console.log("ok"))
      .catch(error => {
        console.log(error.response);
        setCustomers(originalCustomers);
      });
  };

  const handlePageChange = page => {
    setLoading(true);
    setCurrentPage(page);
  };

  return (
    <>
      <h1>Liste des clients API</h1>
      <table className="table table-hover">
        <thead>
          <tr>
            <th>Id</th>
            <th>Client</th>
            <th>Email</th>
            <th>Entreprise</th>
            <th>Factures</th>
            <th>Montant total</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {loading && (
            <tr>
              <td>Chargement...</td>
            </tr>
          )}
          {!loading &&
            customers.map(customer => (
              <tr key={customer.id}>
                <td>{customer.id}</td>
                <td>
                  <a href="#">
                    {customer.firstName} {customer.lastName}
                  </a>
                </td>
                <td>{customer.email}</td>
                <td>{customer.company}</td>
                <td>
                  <span className="badge badge-light">
                    {customer.invoices.length}
                  </span>
                </td>
                <td>{customer.totalAmout.toLocaleString()} €</td>
                <td>
                  <button
                    onClick={() => handleDelete(customer.id)}
                    disabled={customer.invoices.length > 0}
                    className="btn btn-sm btn-danger"
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={totalItems}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default CustomersPageWithApi;
