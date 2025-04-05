import React, { useState } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import Swal from "sweetalert2";
import ModalLoader from "../../../screens/UIComponents/ModalLoader";
import { useSelector, useDispatch } from "react-redux";


import {
getAllSecondarySales,
getSecondarySales
} from "../../../api/sales/secondarySales/secondarySales-api";

import { concatSecondarySales } from "../../../redux/features/secondarySalesSlice";

import DataTable from "react-data-table-component";


function OurSecondarySales(props) {
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
  const [DATAID, setDATAID] = useState(0)

  const [buttonLoader, setButtonLoader] = useState({
    updateSecondarySales: false,
  });

  const Dispatch = useDispatch();
  const SecondarySales = useSelector(
    (state) => state.SecondarySales.allSecondarySales
  );
  // console.log(SecondarySales)
  const currentPage = useSelector((state) => state.SecondarySales.paginationData);

  var columnT = "";
  columnT = [
    {
      name: "Date",
      selector: (row) => row.Date,
      sortable: true,
    },
    {
      name: "Product Name",
      selector: (row) => row.productId,
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
      name: "Total Sale",
      selector: (row) => row.unitPrice*row.quantity,
      sortable: true,
    },
    {
      name: "Customer ID",
      selector: (row) => row.customerId,
      sortable: true,
    },
    {
      name: "Member ID",
      selector: (row) => row.salesRepId,
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

                  const resp = await getSecondarySales(Cred.token, DATAID);
                  
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
      currentPage.totalPages - 1 == currentPage.number ||
      currentPage.number > currentPage.totalPages
    ) {
      return;
    }
    setLoadMore(true);
    try {
      const resp = await getAllSecondarySales(
        Cred.token,
        currentPage.number + 1,
        Cred.sub
      );
        const valueObject = {
          paginationData: resp.paginationData,
          allSecondarySales: resp.data,
        }
      Dispatch(concatSecondarySales(valueObject));
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
            title={SecondarySales.salesId}
            columns={columnT}
            data={SecondarySales}
            defaultSortField="title"
            onChangePage={handlePageChange}
            pagination
            selectableRows={false}
            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
            highlightOnHover={true}
            page
            paginationServer
            paginationTotalRows={currentPage.totalElements}
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
                    htmlFor="exampleFormControlInput877"
                    className="form-label"
                  >
                    Sale ID*
                  </label>
                  <input
                    type="text"
                    value={saleId}
                    className="form-control"
                    id="exampleFormControlInput877"
                    onChange={(e) => setSaleId(e.target.value)}
                    placeholder="Sale ID"
                  />
                </div> */}
                <div className="col-lg-6">
                  <label
                    htmlFor="exampleFormControlInput878"
                    className="form-label"
                  >
                    Product ID
                  </label>
                  <input
                    type="text"
                    value={productId}
                    className="form-control"
                    id="exampleFormControlInput878"
                    onChange={(e) => setProductId(e.target.value)}
                    placeholder="Product ID"
                  />
                </div>
                {/* <div className="col-lg-6">
                  <label
                    htmlFor="exampleFormControlInput977"
                    className="form-label"
                  >
                    Batch Number
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    id="exampleFormControlInput977"
                    value={batchNumber}
                    placeholder="Batch Number"
                    onChange={(e) => setBatchNumber(e.target.value)}
                  />
                </div> */}
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
                <div className="col-lg-6">
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
                    placeholder="Customer ID"
                    value={customerId}
                    onChange={(e) => setCustomerId(e.target.value)}
                  />
                </div>
                <div className="col-lg-6">
                  <label
                    htmlFor="exampleFormControlInput777"
                    className="form-label"
                  >
                    Member ID
                  </label>
                  <input
                    type="text"
                    value={salesRepId}
                    onChange={(e) => setSalesRepId(e.target.value)}
                    className="form-control"
                    id="exampleFormControlInput777"
                    placeholder="Sales Representative ID"
                  />
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
                ...{ updateSecondarySales: true },
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
              setButtonLoader({
                ...buttonLoader,
                ...{ updateSecondarySales: false },
              });
            }}
          >
            {buttonLoader.updateSecondarySales && (
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
              } catch (error) {
                setIsModal(false);
                setDelLoad(false);
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
      <ModalLoader show={delLoad} message={"Deleting Secondary Sale"} />
    </div>
  );
}

export default OurSecondarySales;
