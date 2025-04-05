import React, { useEffect } from "react";
import PageHeader from "../../components/common/PageHeader";
import useInventory from "./useInventory";
import DataTable from "react-data-table-component";
import { Card, Spinner } from "react-bootstrap";
import FilterComponent from "./FilterComponent";
import { API_URL, setBASE_URL } from "../../constants/api-url";
import { useIsSuperAdmin } from "../../helper/isManager";

function Inventory() {
  const {
    allInventory,
    table_columns,
    paginationData,
    loading,
    isClient,
    helperFunctionInventory,
    selectedClient,
    setSelectedClient,
    conditionalRowStyles,
  } = useInventory();
  const isSuperAdmin = useIsSuperAdmin();
  const handleNextPage = (page, perPage) => {
    page--;
    if (page < paginationData.totalPages && loading === -1) {
      helperFunctionInventory(page, perPage);
    }
  };

  useEffect(() => {
    setBASE_URL();
    console.log("wokring Inventory", API_URL.backend_url);
  });
  return (
    <div className="container-xxl">
      <PageHeader headerTitle="Inventory" />
      {!isClient && (
        <FilterComponent
          loading={loading != -1}
          onSubmit={(e) => {
            helperFunctionInventory(0, e?.value);
            setSelectedClient(e);
          }}
        />
      )}
      {selectedClient && (
        <Card className="mb-3 shadow-sm">
          <Card.Body className="py-1 px-3">
            <div className="d-flex justify-content-between align-items-center">
              <div>
                <h5 className="mb-0 text-primary">Inventory Detail</h5>
              </div>
            </div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between">
              <div>
                <strong>Client :</strong> {selectedClient.clientFirstName}{" "}
                {selectedClient.clientLastName}
              </div>
              <div>
                {isSuperAdmin && (
                  <>
                    <strong>State :</strong> {selectedClient.stateName}
                    {" | "}
                  </>
                )}
                <strong>City :</strong> {selectedClient.cityName}
              </div>
            </div>
          </Card.Body>
        </Card>
      )}
      <div className="mt-4" style={{ position: "relative" }}>
        <DataTable
          conditionalRowStyles={conditionalRowStyles}
          columns={table_columns}
          data={allInventory}
          pagination
          paginationServer
          paginationTotalRows={paginationData.totalElements}
          paginationDefaultPage={paginationData.page + 1}
          onChangePage={handleNextPage}
          highlightOnHover
          responsive
          progressPending={loading === 1}
          progressComponent={
            <div className="text-center py-3">
              <Spinner animation="border" size="lg" role="status" />
              <p>Loading orders...</p>
            </div>
          }
          className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
          customStyles={{
            headCells: {
              style: {
                backgroundColor: "#f1f5f9",
                fontWeight: "bold",
              },
            },
            rows: {
              style: {
                height: "35px",
              },
            },
          }}
        />
      </div>
    </div>
  );
}

export default Inventory;
