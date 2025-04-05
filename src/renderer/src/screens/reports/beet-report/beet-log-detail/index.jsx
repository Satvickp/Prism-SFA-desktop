import React from "react";
import { useBeetLogDetail } from "./useBeetLogDetail";
import PageHeader from "../../../../components/common/PageHeader";
import { Button } from "react-bootstrap";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../../constants/customStyles";
import { IoChevronBackCircle } from "react-icons/io5";
import { startCase } from "lodash";
function BeetLogDetail() {
  const {
    employeeName,
    exportToExcel,
    allLogs,
    columns,
    loading,
    isFMCG,
    allDocLogs,
    docColumns,
    navigate,
    stockistCall,
    allClientLogs,
    exportToExcelStock,
  } = useBeetLogDetail();

  return (
    <div>
      <IoChevronBackCircle
        size={28}
        color="#484c7f"
        style={{ marginBottom: "-10px" }}
        onClick={() => navigate(-1)}
      />
      <PageHeader
        headerTitle={`Member ${
          isFMCG ? "Beet" : "Patch"
        } Journey Report (${employeeName})`}
        renderRight={() => (
          <Button

            style={{
              display: "flex",
              flex: "row",
              gap: "2px",
              alignItems: "center",
              margin: "5px",
              alignSelf: "flex-end",
            }}
            onClick={() => exportToExcel()}
          >
            <i className="icofont-download-alt"></i> Export
          </Button>
        )}
      />
      <DataTable
        columns={columns}
        data={allLogs}
        pagination
        progressPending={loading}
        highlightOnHover
        customStyles={{ ...customStyles }}
      />
      {!isFMCG && (
        <>
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: 20,
              padding: "2px 2px 2px 2px",
            }}
          >
            <Button
              style={{
                display: "flex",
                flex: "row",
                gap: "2px",
                alignItems: "center",
              }}
              onClick={() => exportToExcel(true)}
            >
              <i className="icofont-download-alt"></i> Export
            </Button>
            <h4>Doctor Log</h4>
          </div>
          <br />
          <DataTable
            columns={docColumns}
            data={allDocLogs}
            pagination
            progressPending={loading}
            highlightOnHover
            customStyles={{ ...customStyles }}
          />
        </>
      )}
      <>
        <div
          style={{
            width: "100%",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginTop: 20,
            padding: "2px 2px 2px 2px",
          }}
        >
          <Button
            style={{
              display: "flex",
              flex: "row",
              gap: "2px",
              alignItems: "center",
            }}
            onClick={() => exportToExcelStock()}
          >
            <i className="icofont-download-alt"></i> Export
          </Button>
          <h4>Stockist Log</h4>
        </div>
        <br />
        <DataTable
          columns={stockistCall}
          data={allClientLogs}
          pagination
          progressPending={loading}
          highlightOnHover
          customStyles={{ ...customStyles }}
        />
      </>
    </div>
  );
}

export default BeetLogDetail;
