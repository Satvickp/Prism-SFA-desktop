import React, { useState } from "react";
import { useReturnSaleDetails } from "./useReturnSaleDetails";
import DataTable from "react-data-table-component";
import { Button, Card, Modal, Spinner } from "react-bootstrap";
import { FaDownload } from "react-icons/fa";
// import SaleDetail from "../PrimarySales/sale-detail";
import SaleDetail from "../PrimarySalesReturn/return-sale-detail";
import "../index.css";
import { useIsClient } from "../../../helper/isManager";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { useReturnSalesHook } from "../../../hooks/saleReturnHook";
import { useSelector } from "react-redux";
function ReturnSaleDetailsPage() {
  const {
    sales_col,
    allSales,
    loading,
    editOrderData,
    setEditOrderData,
    setAllSales,
    setViewData,
    viewData,
    invoiceNumber,
    generateInvoice,
  } = useReturnSaleDetails();

  const { addReturnSales } = useReturnSalesHook();

  // function handleUpdate(order) {
  //   console.log(order);
  //   setAllSales(
  //     allSales.map((e) =>
  //       e.orderId === order.orderId ? { ...e, ...order } : e
  //     )
  //   );
  // }
  const isClient = useIsClient();
  const navigate = useNavigate();
  const Order = useSelector((state) => state.Orders);

  // const [isModal, setIsModal] = useState(false);
  const [returnReason, setReturnReason] = useState("");
  const [showQuantityError, setShowQuantityError] = useState(false);
  const [selectedQuantity, setSelectedQuantity] = useState(null);
  return (
    <>
      <div className="container-xxl">
        <Card className="mb-3 shadow-sm">
          <Card.Body className="py-1 px-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 text-primary">Invoice Detail</h5>
              </div>
              <div className="d-flex gap-3">
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="d-flex align-items-center gap-2"
                  onClick={() => navigate(-1)}
                >
                  back
                </Button>
                <Button
                  variant="outline-primary"
                  size="sm"
                  className="d-flex align-items-center gap-2"
                  onClick={generateInvoice}
                >
                  <FaDownload />
                </Button>
              </div>
            </div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between">
              <div>
                <strong>Invoice No:</strong>{" "}
                <span className="text-muted">
                  {invoiceNumber || "N/A"} | {allSales?.[0]?.orderCreatedDate}
                </span>
              </div>
              {isClient ? (
                <div>
                  <strong>Member :</strong>{" "}
                  <span className="text-muted">
                    {allSales?.[0]?.memberName || "N/A"}
                  </span>
                </div>
              ) : (
                <div>
                  <strong>Client :</strong>{" "}
                  <span className="text-muted">
                    {allSales?.[0]?.clientName || "N/A"}
                  </span>
                  <strong> | Member :</strong>{" "}
                  <span className="text-muted">
                    {allSales?.[0]?.memberName || "N/A"}
                  </span>
                </div>
              )}
            </div>
          </Card.Body>
        </Card>

        <div className="mt-4  ">
          <DataTable
            columns={sales_col}
            data={allSales}
            pagination
            highlightOnHover
            responsive
            progressPending={loading === 0}
            progressComponent={
              <div className="text-center py-3">
                <Spinner animation="border" size="lg" role="status" />
                <p>Loading orders...</p>
              </div>
            }
            className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline "
            customStyles={{
              headCells: {
                style: {
                  backgroundColor: "#f1f5f9",
                  fontWeight: "bold",
                },
              },
              rows: {
                style: {
                  minHeight: "30px",
                  paddingTop: "-10px",
                  paddingBottom: "4px",
                },
              },
            }}
          />
        </div>

        {console.log("editOrderData", editOrderData)}

        <Modal
          centered
          show={Boolean(editOrderData)}
          onHide={() => {
            setEditOrderData(null);
          }}
        >
          <Modal.Header closeButton>
            <Modal.Title className="fw-bold">Add Details</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="mb-3">
              <label
                htmlFor="exampleFormControlTextarea78d"
                className="form-label"
              >
                Quantity{" "}
                <span className="text-success">
                  {`(max: ${
                    editOrderData?.quantity || 0
                  })`}
                </span>
              </label>
              <input
                type="number"
                value={selectedQuantity}
                onChange={(e) => {
                  let setQuantity = Number(e.target.value); // Convert to number
                  // let quantityLimit = Order.allOrder.find(
                  //   (item) => item.orderId == editOrderData?.orderId
                  // )?.quantity; // Extract `quantity` directly

                  // if (setQuantity > 0 && setQuantity <= quantityLimit) {
                  //   setShowQuantityError(false);
                    setSelectedQuantity(setQuantity); // Use numeric value here
                  // } else {
                  //   setShowQuantityError(true);
                  // }
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
                setEditOrderData(null);
              }}
            >
              Cancel
            </button>
            <button
              onClick={async () => {
                if (!selectedQuantity || !returnReason) {
                  // setEditOrderData(null);
                  Swal.fire(
                    "Incomplete",
                    "Kindly Fill Each Details",
                    "warning"
                  );
                  return;
                }
                try {
                  const payload = {
                    orderId: editOrderData.orderId,
                    reason: returnReason,
                    quantity: Number(selectedQuantity),
                  };
                  const resp = await addReturnSales(payload);
                  if(resp){
                    Swal.fire(
                      "Something Went Wrong",
                      `${resp.message}`,
                      "error"
                    );
                    setEditOrderData(null);
                    return;
                  }
                  setReturnReason("");
                  setSelectedQuantity(null);
                  setEditOrderData(null);
                  Swal.fire(
                    "Successfully Added",
                    "Sales Return request has been successfully Added.",
                    "success"
                  );
                } catch (error) {
                  setEditOrderData(null);
                  Swal.fire(
                    "Something Went Wrong",
                    "Can't Add Return Sale",
                    "error"
                  );
                }
              }}
              type="button"
              className="btn btn-primary"
            >
              Add
            </button>
          </Modal.Footer>
        </Modal>

        <SaleDetail
          visible={viewData.visible}
          onHide={() => {
            setViewData({
              data: null,
              loading: false,
              visible: false,
            });
            // console.log("called");
          }}
          saleData={viewData}
          setSaleData={setViewData}
        />
      </div>
    </>
  );
}

export default ReturnSaleDetailsPage;
