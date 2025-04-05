import React, { useState, useEffect } from "react";
import { Button, Modal, Spinner } from "react-bootstrap";
import DataTable from "react-data-table-component";
import PageHeader from "../../../components/common/PageHeader";
import { useSelector } from "react-redux";
import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import Loading from "../../../components/UI/Loading";
import Swal from "sweetalert2";
import { useReturnSalesHook } from "../../../hooks/saleReturnHook";
import * as XLSX from "xlsx";
import { useNavigate } from "react-router-dom";

function SalesReturn() {
  const [isModal, setIsModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isEditModal, setIsEditModal] = useState(false);
  const [isDeleteModal, setIsDeleteModal] = useState(false);
  const [addLeaveLoader, setAddLeaveLoader] = useState(false);

  const [returnReason, setReturnReason] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  const [key, setKey] = useState("primary");
  const [showQuantityError, setShowQuantityError] = useState(false);
  const [selectedRowId, setSelectedRowId] = useState(null);

  const Order = useSelector((state) => state.Orders);
  const navigate = useNavigate();
  const { Primary, Secondary } = useSelector((state) => state.SaleReturn);

  const {
    addReturnSales,
    deleteReturnSales,
    getAllPrimaryReturnSales,
    getAllReturnSale,
    getAllSecondaryReturnSales,
    updateReturnSales,
    getAllOrdersByClientFMCG,
  } = useReturnSalesHook();

  useEffect(() => {
    getAllReturnSale();
  }, []);

  const getStatusStyles = (status) => {
    if (status?.toUpperCase() === "CREATED") {
      return {
        backgroundColor: "green",
        color: "white",
        padding: 7,
      };
    } else if (status?.toUpperCase() === "PROGRESS") {
      return {
        backgroundColor: "orange",
        color: "white",
        padding: 7,
      };
    } else if (status?.toUpperCase() === "RETURNED") {
      return {
        backgroundColor: "red",
        color: "white",
        padding: 7,
      };
    } else {
      return;
    }
  };

  function handleIsEditModal() {
    setIsEditModal(!isEditModal);
  }

  function handleIsDeleteModal() {
    setIsDeleteModal(!isDeleteModal);
  }

  var ReturnSaleColumnT = "";
  ReturnSaleColumnT = [
    {
      name: <span className="text-wrap">PRODUCT NAME</span>,
      selector: (row) => <span className="text-wrap">{row?.orderResponse?.productRes?.name || "NA"}</span>,
      sortable: true,
    },
    {
      name: <span className="text-wrap">ORDER AMOUNT</span>,
      selector: (row) => <span className="text-wrap">{row?.orderResponse?.totalPrice
        ? `₹ ${row?.orderResponse?.totalPrice}`
        : "NA"}</span>,
      sortable: true,
    },
    {
      name: <span className="text-wrap">GST</span>,
      selector: (row) => <span className="text-wrap">{row?.orderResponse?.gstAmount || "NA"}</span>,
      sortable: true,
    },
    {
      name: <span className="text-wrap">INVOICE</span>,
      selector: (row) => <span className="text-wrap">{row?.orderResponse?.invoiceNumber || "NA"}</span>,
      sortable: true,
    },
    {
      name: <span className="text-wrap">QUANTITY ORDERED</span>,
      selector: (row) => <span className="text-wrap">{row?.orderResponse?.quantity || "NA"}</span>,      
      sortable: true,
    },
    {
      name: <span className="text-wrap">QUANTITY RETURNED</span>,
      selector: (row) => <span className="text-wrap">{row?.quantity || "NA"}</span>,
      sortable: true,
    },
    {
      name: <span className="text-wrap">REASON</span>,
      selector: (row) => <span className="text-wrap">{row?.reason || "NA"}</span>,
      sortable: true,
    },
    {
      name: <span className="text-wrap">STATUS</span>,
      selector: (row) => {},
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <p
            style={{
              marginTop: "1em",
              ...getStatusStyles(row.returnStatus),
              fontSize: 13,
              borderTopLeftRadius: 10,
              borderBottomRightRadius: 10,
              textWrap: "wrap"
            }}
          >
            {row?.returnStatus || "NA"}
          </p>
        </div>
      ),
    },
    {
      name: <span className="text-wrap">ACTION</span>,
      selector: (row) => {},
      sortable: true,
      cell: (row) => (
        <div
          className="btn-group"
          role="group"
          aria-label="Basic outlined example"
        >
          <button
            type="button"
            className="btn btn-outline-secondary"
            onClick={async () => {
              if (Order.allOrder.length <= 0) await getAllOrdersByClientFMCG();
              setSelectedRowId(row.id);
              setSelectedOrder(row.orderResponse.orderId);
              setSelectedQuantity(row.quantity);
              setReturnReason(row.reason);
              handleIsEditModal();
            }}
          >
            <i className="icofont-edit text-success"></i>
          </button>
          <button
            type="button"
            onClick={async () => {
              setSelectedRowId(row.id);
              handleIsDeleteModal();
            }}
            className="btn btn-outline-secondary deleterow"
          >
            <i className="icofont-ui-delete text-danger"></i>
          </button>
        </div>
      ),
    },
  ];

  const exportToExcel = (Data) => {
    if (Data.length <= 0) {
      Swal.fire(
        "Unable to export",
        "There is no data available to export",
        "info"
      );
      return;
    }

    const headers = [
      "Product Name",
      "Order Amount",
      "GST",
      "Invoice",
      "Quantity Ordered",
      "Quantity Returned",
      "Returning Reason",
      "Status",
    ];

    const rows = Data?.map((row) => {
      return [
        row?.orderResponse?.productRes?.name || "NA",
        row?.orderResponse?.totalPrice
          ? `₹ ${row?.orderResponse?.totalPrice}`
          : "NA",
        row?.orderResponse?.gstAmount || "NA",
        row?.orderResponse?.invoiceNumber || "NA",
        row?.orderResponse?.quantity || "NA",
        row?.quantity || "NA",
        row?.reason || "NA",
        row?.returnStatus || "NA",
      ];
    });

    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws["!cols"] = headers.map(() => ({ width: 20 }));

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Sales Return");
    XLSX.writeFile(wb, "_returned_sales.xlsx");
  };

  return (
    <>
      {loading ? (
        <Loading color={"black"} animation={"border"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle="Sales Return"
            renderRight={() => {
              return (
                <div className="col-auto d-flex w-sm-100">
                  <button
                    className="btn btn-dark btn-set-task w-sm-100"
                    onClick={async () => {

                      navigate("/primarySalesReturn")
                      // setIsModal(true);
                      // try {
                      //   setSelectedOrder(null);
                      //   setSelectedQuantity(null);
                      //   setReturnReason("");
                      //   await getAllOrdersByClientFMCG();
                      // } catch (error) {
                      //   setIsModal(false);
                      //   Swal.fire(
                      //     "Something went wrong",
                      //     "Can't Fetch Necessary Data",
                      //     "error"
                      //   );
                      // }
                    }}
                  >
                    <i className="icofont-plus-circle me-2 fs-6"></i>Add Return
                    Sale
                  </button>

                  <button
                    className="btn btn-dark btn-set-task w-sm-100 mx-2"
                    onClick={async () => {
                      try {
                        let mainData =
                          key === "primary"
                            ? Primary.content
                            : Secondary.content;
                        exportToExcel(mainData);
                      } catch (error) {
                        Swal.fire(
                          "Something went wrong",
                          "Can't Export Necessary Data",
                          "error"
                        );
                      }
                    }}
                  >
                    <i class="icofont-download-alt"></i>
                  </button>
                </div>
              );
            }}
          />
          <div className="row clearfix g-3">
            <div className="col-sm-12">
              <Tabs
                id="controlled-tab-example"
                activeKey={key}
                onSelect={(k) => setKey(k)}
                className="mb-3"
              >
                <Tab eventKey="primary" title="Primary Sale">
                  {Primary.content.length <= 0 ? (
                    <h1>No Return Sales to show</h1>
                  ) : (
                    <DataTable
                      title={"Primary Sales Return"}
                      columns={ReturnSaleColumnT}
                      data={Primary.content}
                      defaultSortField="title"
                      pagination
                      selectableRows={false}
                      className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                      highlightOnHover={true}
                      progressComponent={
                        <Loading animation={"border"} color={"black"} />
                      }
                    />
                  )}
                </Tab>
                {/* <Tab eventKey="secondary" title="Secondary Sale">
                  {Secondary.content.length <= 0 ? (
                    <h1>No Return Sales to show</h1>
                  ) : (
                    <DataTable
                      title={"Secondary Sales Return"}
                      columns={ReturnSaleColumnT}
                      data={Secondary.content}
                      defaultSortField="title"
                      pagination
                      selectableRows={false}
                      className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
                      highlightOnHover={true}
                      progressComponent={
                        <Loading animation={"border"} color={"black"} />
                      }
                    />
                  )}
                </Tab> */}
              </Tabs>
            </div>
          </div>
          {/* <Modal
            centered
            show={isModal}
            onHide={() => {
              setIsModal(false);
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Add Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <div className="mb-3">
                <label className="form-label">Select Order</label>
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  className="form-select"
                >
                  <option value={null}>Select Order</option>
                  {Order.allOrder
                    .filter((item) => item.status === "DELIVERED")
                    .map((e, i) => {
                      return (
                        <option key={i} value={e.orderId}>
                          {`${e.productRes.name} (quantity: ${e.quantity})`}
                        </option>
                      );
                    })}
                </select>
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea78d"
                  className="form-label"
                >
                  Quantity{" "}
                  {selectedOrder && (
                    <span className="text-success">
                      {`(max: ${
                        Order.allOrder.find(
                          (item) => item.orderId == selectedOrder
                        )?.quantity || 0
                      })`}
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  value={selectedQuantity}
                  onChange={(e) => {
                    let setQuantity = Number(e.target.value); // Convert to number
                    let quantityLimit = Order.allOrder.find(
                      (item) => item.orderId == selectedOrder
                    )?.quantity; // Extract `quantity` directly

                    if (setQuantity > 0 && setQuantity <= quantityLimit) {
                      setShowQuantityError(false);
                      setSelectedQuantity(setQuantity); // Use numeric value here
                    } else {
                      setShowQuantityError(true);
                    }
                  }}
                  className="form-control"
                  id="exampleFormControlTextarea78d"
                />
                {showQuantityError && (
                  <p className="text-danger text-sm">Invalid quantity</p>
                )}
              </div>

              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea78d"
                  className="form-label"
                >
                  Sale Returning Reason
                </label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="form-control"
                  id="exampleFormControlTextarea78d"
                  rows="3"
                ></textarea>
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
                Done
              </button>
              <button
                onClick={async () => {
                  if (!selectedOrder || !selectedQuantity || !returnReason) {
                    setIsModal(false);
                    Swal.fire(
                      "Incomplete",
                      "Kindly Fill Each Details",
                      "warning"
                    ).finally(() => setIsModal(true));
                    return;
                  }
                  setAddLeaveLoader(true);
                  try {
                    const payload = {
                      orderId: Number(selectedOrder),
                      reason: returnReason,
                      quantity: Number(selectedQuantity),
                    };
                    await addReturnSales(payload);
                    setSelectedOrder(null);
                    setReturnReason("");
                    setSelectedQuantity(null);
                    setIsModal(false);
                    Swal.fire(
                      "Successfully Added",
                      "Sales Return request has been successfully Added.",
                      "success"
                    );
                  } catch (error) {
                    setIsModal(false);
                    Swal.fire(
                      "Something Went Wrong",
                      "Can't Add Return Sale",
                      "error"
                    ).finally(() => setIsModal(true));
                  }
                  setAddLeaveLoader(false);
                }}
                type="button"
                className="btn btn-primary"
              >
                {addLeaveLoader && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1 m-lg-10"
                  />
                )}
                Add
              </button>
            </Modal.Footer>
          </Modal> */}

          <Modal centered show={isEditModal} onHide={handleIsEditModal}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">Update Details</Modal.Title>
            </Modal.Header>
            <Modal.Body>
              {/* <div className="mb-3">
                <label className="form-label">Select Order</label>
                <select
                  value={selectedOrder}
                  onChange={(e) => setSelectedOrder(e.target.value)}
                  className="form-select"
                >
                  <option value={null}>Select Order</option>
                  {Order.allOrder
                    .filter((item) => item.status === "DELIVERED")
                    .map((e, i) => {
                      return (
                        <option key={i} value={e.orderId}>
                          {`${e.productRes.name} (quantity: ${e.quantity})`}
                        </option>
                      );
                    })}
                </select>
              </div> */}
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea78d"
                  className="form-label"
                >
                  Quantity{" "}
                  {selectedOrder && (
                    <span className="text-success">
                      {`(max: ${
                        Order.allOrder.find(
                          (item) => item.orderId == selectedOrder
                        )?.quantity || 0
                      })`}
                    </span>
                  )}
                </label>
                <input
                  type="number"
                  value={selectedQuantity}
                  onChange={(e) => {
                    let setQuantity = Number(e.target.value);
                    let quantityLimit = Order.allOrder.find(
                      (item) => item.orderId == selectedOrder
                    )?.quantity;

                    if (setQuantity > 0 && setQuantity <= quantityLimit) {
                      setShowQuantityError(false);
                      setSelectedQuantity(setQuantity);
                    } else {
                      setShowQuantityError(true);
                    }
                  }}
                  className="form-control"
                  id="exampleFormControlTextarea78d"
                />
                {showQuantityError && (
                  <p className="text-danger text-sm">Invalid quantity</p>
                )}
              </div>

              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlTextarea78d"
                  className="form-label"
                >
                  Sale Returning Reason
                </label>
                <textarea
                  value={returnReason}
                  onChange={(e) => setReturnReason(e.target.value)}
                  className="form-control"
                  id="exampleFormControlTextarea78d"
                  rows="3"
                ></textarea>
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
                Done
              </button>
              <button
                onClick={async () => {
                  if (!selectedOrder || !selectedQuantity || !returnReason) {
                    setIsModal(false);
                    Swal.fire(
                      "Incomplete",
                      "Kindly Fill Each Details",
                      "warning"
                    ).finally(() => setIsModal(true));
                    return;
                  }
                  setAddLeaveLoader(true);
                  try {
                    const payload = {
                      orderId: Number(selectedOrder),
                      reason: returnReason,
                      quantity: Number(selectedQuantity),
                    };
                    await updateReturnSales(
                      payload,
                      "WAREHOUSE",
                      selectedRowId
                    );
                    setSelectedOrder(null);
                    setReturnReason("");
                    setSelectedQuantity(null);
                    setSelectedRowId(null);
                    setIsEditModal(false);
                    Swal.fire(
                      "Successfully Updated",
                      "Sales Return request has been successfully Updated.",
                      "success"
                    );
                  } catch (error) {
                    setIsModal(false);
                    Swal.fire(
                      "Something Went Wrong",
                      "Can't Update Return Sale",
                      "error"
                    ).finally(() => setIsModal(true));
                  }
                  setAddLeaveLoader(false);
                }}
                type="button"
                className="btn btn-primary"
              >
                {addLeaveLoader && (
                  <Spinner
                    as="span"
                    animation="border"
                    size="sm"
                    role="status"
                    aria-hidden="true"
                    className="me-1 m-lg-10"
                  />
                )}
                Update
              </button>
            </Modal.Footer>
          </Modal>

          <Modal show={isDeleteModal} centered onHide={handleIsDeleteModal}>
            <Modal.Header closeButton>
              <Modal.Title className="fw-bold">
                Cancel Returning Sale
              </Modal.Title>
            </Modal.Header>
            <Modal.Body className="justify-content-center flex-column d-flex">
              <i className="icofont-ui-delete text-danger display-2 text-center mt-2"></i>
              <p className="mt-4 fs-5 text-center">
                You are Deleting this Sale's Return
              </p>
            </Modal.Body>
            <Modal.Footer>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={handleIsDeleteModal}
              >
                Cancel
              </button>
              <Button
                variant="primary"
                className="btn btn-danger color-fff"
                onClick={async () => {
                  if (!selectedRowId) {
                    setIsModal(false);
                    Swal.fire("Error", "Something Went Wrong", "error").finally(
                      () => setIsModal(true)
                    );
                    return;
                  }
                  try {
                    const resp = await deleteReturnSales(selectedRowId, "WAREHOUSE");
                    if(resp){
                      setSelectedRowId(null);
                    setIsDeleteModal(false);
                    Swal.fire(
                      "Successfully Deleted",
                      "Sales Return request has been successfully Deleted.",
                      "success"
                    );
                    }
                  } catch (error) {
                    setIsDeleteModal(false);
                    Swal.fire(
                      "Something Went Wrong",
                      "Can't Delete Return Sale",
                      "error"
                    ).finally(() => setIsModal(true));
                  }
                }}
              >
                Delete
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      )}
    </>
  );
}

export default SalesReturn;
