import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import ModalLoader from "../../../screens/UIComponents/ModalLoader";
import { useSelector, useDispatch } from "react-redux";

import {
  getAllPrimarySales,
  getPrimarySales,
} from "../../../api/sales/primarySales/primarySales-api";

import { concatPrimarySale } from "../../../redux/features/primarySalesSlice";

import DataTable from "react-data-table-component";

function OurPrimarySales(props) {
  const Data = props.data
  // const Data = props.map((data, index) => data );

  // console.log(Data)

  const [saleId, setSaleId] = useState(Data.saleId);
  const [productId, setProductId] = useState(Data.productId);
  const [batchNumber, setBatchNumber] = useState(Data.batchNumber);
  const [quantity, setQuantity] = useState(Data.quantity);
  const [unitPrice, setUnitPrice] = useState(Data.unitPrice);
  const [customerId, setCustomerId] = useState(Data.customerId);
  const [salesRepId, setSalesRepId] = useState(Data.salesRepId);

  const [loading, setloading] = useState(false);
  const [delLoad, setDelLoad] = useState(false);
  const { index } = props;
  const Cred = useSelector((state) => state.Cred);
  const [isModal, setIsModal] = useState(false);
  const [isView, setIsView] = useState(false);
  const [isModalDelete, setIsModalDelete] = useState(false);
  const [loadMore, setLoadMore] = useState(false);
  const [authority, setAuthority] = useState(false);
  const [DATAID, setDATAID] = useState(null)

  const [buttonLoader, setButtonLoader] = useState({
    updatePrimarySales: false,
  });

  const Dispatch = useDispatch();

  const PrimarySales = useSelector((state) => state.PrimarySales);

  const Products = useSelector((state) => state.Products)
  const clientIdentity = useSelector((state) => state.Client);
  const memberIdentity = useSelector((state) => state.Member);


  // console.log(PrimarySales)

  
  var columnT = "";
  columnT = [
    {
      name: "Date",
      selector: (row) => (new Date()).toDateString(),
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.productId,
      sortable: true,
    },
    {
      name: "Client ID",
      selector: (row) => row.customerId,
      sortable: true,
    },
    {
      name: "Member ID",
      selector: (row) => row.salesRepId,
      sortable: true,
    },
    {
      name: "Quantity",
      selector: (row) => row.quantity,
      sortable: false,
    },
    {
      name: "Unit Price",
      selector: (row) => row.unitPrice,
      sortable: true,
    },
    {
      name: "Total Sale (INR)",
      selector: (row) => row.unitPrice*row.quantity,
      sortable: true,
    },
    {
      name: "",
      selector: (row) =>
        row.productId ? (
          <div
            className="btn-group mt-2"
            role="group"
            aria-label="Basic outlined example"
          >
            {/* edit button */}

            <button
              onClick={async () => {
                setloading(true);
                setDATAID(row.id);
                try {

                  const resp = await getPrimarySales(Cred.token, row.id);
                  
                  // console.log(resp)

                  setSaleId(resp.saleId);
                  setProductId(resp.productId);
                  setBatchNumber(resp.batchNumber);
                  setQuantity(resp.quantity);
                  setUnitPrice(resp.unitPrice);
                  setCustomerId(resp.customerId);
                  setSalesRepId(resp.salesRepId);
                  setIsModal(true);
                } catch (error) {
                  setIsModal(false);
                  Swal.fire(
                    "Something went wrong",
                    "Can't Fetch Necessary data"
                  );
                }
                setloading(false);
              }}
              type="button"
              className="btn btn-outline-secondary "
            >
              <i className="icofont-edit text-success fs-5"></i>
            </button>

            {/* delete button */}

            <button
              onClick={() => {
                setDATAID(row.id);
                setIsModalDelete(true)}
              }
              type="button"
              className="btn btn-outline-secondary "
            >
              <i className="icofont-ui-delete text-danger fs-5"></i>
            </button>
          </div>
        ) : (
          <span className="text-danger">Access Denied</span>
        ),
      sortable: false,
    },
  ];

  const handlePageChange = async (NextPage) => {
    if (
      PrimarySales.paginationData.totalPages - 1 == PrimarySales.paginationData.number ||
      PrimarySales.paginationData.number > PrimarySales.paginationData.totalPages
    ) {
      return;
    }
    setLoadMore(true);
    try {
      const resp = await getAllPrimarySales(
        Cred.token,
        PrimarySales.paginationData.number + 1,
        Cred.sub
      );
        const valueObject = {
          paginationData: resp.paginationData,
          allPrimarySales: resp.data,
        }
      Dispatch(concatPrimarySale(valueObject));
    } catch (error) {
      Swal.fire("Something Went Wrong", "Can't Fetch More Data");
    }
    setLoadMore(false);
  };

  return (
    <div className="container-xxl">
      <div className="row clearfix g-3">
        <div className="col-sm-12">
          <DataTable
            id="Data_table"
            title={PrimarySales.allPrimarySales.salesId}
            columns={columnT}
            data={PrimarySales.allPrimarySales}
            defaultSortField="title"
            onChangePage={handlePageChange}
            pagination
            selectableRows={false}
            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
            highlightOnHover={true}
            page
            paginationServer
            paginationTotalRows={PrimarySales.paginationData.totalElements}
            paginationComponentOptions={{
              noRowsPerPage: true,
            }}
            // customStyles={customStyles}
          />
        </div>
      </div>
      <Modal
        // size="xl"
        centered
        show={isModal}
        onHide={() => {
          setIsModal(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Edit Sales</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="deadline-form">
            <form>
            <div className="row g-3 mb-3">
                    {/* <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput878"
                        className="form-label"
                      >
                        Product Name
                      </label>
                      <input
                        type="text"
                        value={productId}
                        className="form-control"
                        id="exampleFormControlInput878"
                        onChange={(e) => setProductId(e.target.value)}
                        placeholder="Product Name"
                      />
                    </div> */}
                    <div className="col-sm-6">
                        <label className="form-label">Product Name*</label>
                        <select
                          className="form-select"
                          value={productId}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setProductId(selectedValue);
                          }}
                        >
                          {" "}
                          <option value="">Select Product Name</option>
                          {Products.allProducts.map((value, i) => {
                            return (
                              <option value={value.productId} key={value.id}>
                                {value.genericName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    <div className="col-lg-6">
                      <label
                        className="form-label"
                        htmlFor="exampleFormControlInput257"
                      >
                        Quantity
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        value={quantity}
                        placeholder="Quantity"
                        id="exampleFormControlInput257"
                        onChange={(e) => setQuantity(e.target.value)}
                      />
                    </div>
                    <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput277"
                        className="form-label"
                      >
                        Unit Price
                      </label>
                      <input
                        type="text"
                        value={unitPrice}
                        onChange={(e) => setUnitPrice(e.target.value)}
                        className="form-control"
                        id="exampleFormControlInput277"
                        placeholder="Unit Price"
                      />
                    </div>
                    {/* <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput477"
                        className="form-label"
                      >
                        Client ID
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        id="exampleFormControlInput477"
                        placeholder="Client ID"
                        value={customerId}
                        onChange={(e) => setCustomerId(e.target.value)}
                      />
                    </div> */}
                    <div className="col-sm-6">
                        <label className="form-label">Client ID*</label>
                        <select
                          className="form-select"
                          value={customerId}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setCustomerId(selectedValue);
                          }}
                        >
                          {" "}
                          <option value="">Select Client Id</option>
                          {clientIdentity.map((value, i) => {
                            return (
                              <option value={value.clientCode} key={value.id}>
                                {value.clientFirstName} {value.clientLastName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                    {/* <div className="col-lg-6">
                      <label
                        htmlFor="exampleFormControlInput777"
                        className="form-label"
                      >
                      Members ID
                      </label>
                      <input
                        type="text"
                        value={salesRepId}
                        onChange={(e) => setSalesRepId(e.target.value)}
                        className="form-control"
                        id="exampleFormControlInput777"
                        placeholder="Member ID"
                      />
                    </div> */}
                    <div className="col-sm-6">
                        <label className="form-label">Member ID*</label>
                        <select
                          className="form-select"
                          value={salesRepId}
                          onChange={(e) => {
                            const selectedValue = e.target.value;
                            setSalesRepId(selectedValue);
                          }}
                        >
                          {" "}
                          <option value="">Select Member ID</option>
                          {memberIdentity.allMembers.map((value, i) => {
                            return (
                              <option value={value.employeeId} key={value.id}>
                                {value.firstName} {value.lastName}
                              </option> 
                            );
                          })}
                        </select>
                      </div>
                  </div>
            </form>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setIsModal(false);
              setDATAID(null);
            }}
          >
            Cancel
          </button>
          <Button
            variant="primary"
            onClick={async () => {
              setIsModal(true);
              if (
                !saleId ||
                !productId ||
                !batchNumber ||
                !quantity ||
                !unitPrice ||
                !customerId ||
                !salesRepId
              ) {
                setIsModal(false);
                Swal.fire({
                  title: "Invalid Details",
                  text: "Make Sure You Filled Each Details With Correct Value",
                  timer: 2000,
                  icon: "warning",
                }).then((e) => setIsModal(true));
                return;
              }
              setButtonLoader({
                ...buttonLoader,
                ...{ updatePrimarySales: true },
              });

              await props.Update(index, {
                saleId: saleId,
                productId: productId,
                batchNumber: batchNumber,
                quantity: quantity,
                unitPrice: unitPrice,
                customerId: customerId,
                salesRepId: salesRepId,
                id: DATAID,
              });
              setIsModal(false);
              setDATAID(null);
              setButtonLoader({
                ...buttonLoader,
                ...{ updatePrimarySales: false },
              });
            }}
          >
            {buttonLoader.updatePrimarySales && (
              <Spinner
                as="span"
                animation="border"
                size="sm"
                role="status"
                aria-hidden="true"
                className="me-1"
              />
            )}
            Update
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={isModalDelete}
        centered
        onHide={() => {
          setIsModalDelete(false);
        }}
      >
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold">Delete Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body className="justify-content-center flex-column d-flex">
          <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
          <p className="mt-4 fs-5 text-center">
            You can delete this item Permanently
          </p>
        </Modal.Body>
        <Modal.Footer>
          <button
            type="button"
            className="btn btn-secondary"
            onClick={() => {
              setIsModalDelete(false);
            }}
          >
            Cancel
          </button>
          <Button
            variant="primary"
            className="btn btn-danger color-fff"
            onClick={async () => {
              try {
                setDelLoad(true);
                setIsModalDelete(false);
                await props.Delete(DATAID);
                setDelLoad(false);
                setDATAID(null);
              } catch (error) {
                setIsModal(false);
                setDelLoad(false);
                setDATAID(null);
                setIsModalDelete(false);
                Swal.fire("Something went wrong", "Can't Fetch Necessary data");
              }
            }}
          >
            Delete
          </Button>
        </Modal.Footer>
      </Modal>

      <ModalLoader show={loading} message={"Fetching Details"} />
      <ModalLoader show={delLoad} message={"Deleting Primary Sale"} />
    </div>
  );
}

export default OurPrimarySales;
