import React from "react";
import { useSaleDetails } from "./useSaleDetails";
import PageHeader from "../../../components/common/PageHeader";
import DataTable from "react-data-table-component";
import { Button, Card, Spinner } from "react-bootstrap";
import PrimarySaleUpdateModal from "../PrimarySales/form/update-pop-up";
import { FaDownload } from "react-icons/fa";
import SaleDetail from "../PrimarySales/sale-detail";
import "../index.css";
import { useIsClient } from "../../../helper/isManager";
function SaleDetailsPage() {
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
  } = useSaleDetails();
  function handleUpdate(order) {
    console.log(order);
    setAllSales(
      allSales.map((e) =>
        e.orderId === order.orderId ? { ...e, ...order } : e
      )
    );
  }
  const isClient = useIsClient();

  return (
    <>
      <div className="container-xxl">
        <Card className="mb-3 shadow-sm">
          <Card.Body className="py-1 px-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 text-primary">Invoice Detail</h5>
              </div>
              <Button
                variant="outline-primary"
                size="sm"
                className="d-flex align-items-center gap-2"
                onClick={generateInvoice}
              >
                <FaDownload />
              </Button>
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
        <PrimarySaleUpdateModal
          isVisible={Boolean(editOrderData)}
          orderData={editOrderData}
          setVisible={() => setEditOrderData(null)}
          isPrimary={true}
          noRedux
          onUpdate={handleUpdate}
        />
        <SaleDetail
          visible={viewData.visible}
          onHide={() => {
            setViewData({
              data: null,
              loading: false,
              visible: false,
            });
            console.log("called");
          }}
          saleData={viewData}
          setSaleData={setViewData}
        />
      </div>
    </>
  );
}

export default SaleDetailsPage;
