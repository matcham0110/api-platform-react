import moment from "moment";
import React, { useEffect, useState } from "react";
import Pagination from "../components/Pagination";
import invoicesAPI from "../services/InvoicesAPI";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import { toast } from "react-toastify";
import TableLoader from "../components/loaders/TableLoader";

const STATUS_CLASSES = {
  PAID: "success",
  SENT: "primary",
  CANCELLED: "danger"
};

const STATUS_LABEL = {
  PAID: "Payée",
  SENT: "Envoyé",
  CANCELLED: "Annulé"
};

const InvoicesPage = props => {
  const [invoices, setInvoices] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const itemsPerPage = 8;
  const formatDate = str => moment(str).format("DD/MM/YYYY");
  // gestion du changement de page
  const handlePageChange = page => setCurrentPage(page);

  // gestion de la recherche
  const handleSearch = ({ currentTarget }) => {
    setSearch(currentTarget.value);
    setCurrentPage(1);
  };

  // Récupération des invoices API
  const fetchInvoices = async () => {
    try {
      const data = await invoicesAPI.findAll();
      setInvoices(data);
      setLoading(false);
    } catch (error) {
      console.log(error.response);
    }
  };

  // gére la suppression data API sur un événement
  const handleDelete = async id => {
    const originalInvoices = [...invoices];

    setInvoices(invoices.filter(invoice => invoice.id !== id));

    try {
      await invoicesAPI.delete(id);
      toast.success("Supprésion réusie de la facture " + id);
    } catch (error) {
      console.log(error.response);
      setInvoices(originalInvoices);
      toast.error("pas supprimé ");
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // filtrage des customers en fonction des éléments
  const filteredInvoices = invoices.filter(
    i =>
      i.customer.firstName.toLowerCase().includes(search.toLowerCase()) ||
      i.customer.lastName.toLowerCase().includes(search.toLowerCase()) ||
      i.amout.toString().includes(search.toLowerCase()) ||
      STATUS_LABEL[i.status].toLowerCase().includes(search.toLowerCase())
  );

  // gestion de la pagination
  const paginatedInvoices = Pagination.getData(
    filteredInvoices,
    currentPage,
    itemsPerPage
  );

  return (
    <>
      <div className="d-flex justify-content-between align-items-center">
        <h1>Liste des factures</h1>
        <Link className="btn btn-primary" to="/invoices/new">
          Créer une facture
        </Link>
      </div>

      <div className="form-group">
        <input
          type="text"
          onChange={handleSearch}
          value={search}
          className="form-control"
          placeholder="rechercher"
        />
      </div>
      <table className="table table-hover table-striped">
        <thead>
          <tr>
            <th>Numéro</th>
            <th>Client</th>
            <th>Date d'envoie</th>
            <th>Status</th>
            <th>Montant</th>
            <th />
          </tr>
        </thead>
        {!loading && (
          <tbody>
            {paginatedInvoices.map(invoice => (
              <tr key={invoice.id}>
                <td>{invoice.chrono}</td>
                <td>
                  <Link to={"/customers/" + invoice.customer.id}>
                    {invoice.customer.lastName} {invoice.customer.firstName}
                  </Link>
                </td>
                <td>{formatDate(invoice.sentAt)}</td>
                <td>
                  <span
                    className={"badge badge-" + STATUS_CLASSES[invoice.status]}
                  >
                    {STATUS_LABEL[invoice.status]}
                  </span>
                </td>
                <td>{invoice.amout.toLocaleString()}</td>
                <td>
                  <Link
                    to={`/invoices/${invoice.id}`}
                    className="btn btn-sm btn-success mr-1"
                  >
                    Editer
                  </Link>
                  <button
                    className="btn btn-sm btn-danger"
                    onClick={() => handleDelete(invoice.id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        )}
      </table>
      {loading && <TableLoader />}
      <Pagination
        currentPage={currentPage}
        itemsPerPage={itemsPerPage}
        length={filteredInvoices.length}
        onPageChanged={handlePageChange}
      />
    </>
  );
};

export default InvoicesPage;
