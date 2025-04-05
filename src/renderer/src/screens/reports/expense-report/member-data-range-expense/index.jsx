import React from "react";
import PageHeader from "../../../../components/common/PageHeader";
import { useExpenseMemberReport } from "./useExpenseMemberReport";
import DataTable from "react-data-table-component";
import { customStyles } from "../../../../constants/customStyles";
import FilterComponent from "../../beet-report/member-range-report/FilterComponent";
import { IoChevronBackCircle } from "react-icons/io5";
import { Card } from "react-bootstrap";
function MemberExpenseReport() {
  const {
    loading,
    memberName,
    allExpense,
    columns,
    getCall,
    onRowClicked,
    navigate,
    exportToExcel,
    exportToPdf,
    expenseGrandTotal,
    formatPriceINR,
  } = useExpenseMemberReport();

  return (
    <div>
      <IoChevronBackCircle
        size={28}
        color="#484c7f"
        style={{ marginBottom: "-10px" }}
        onClick={() => navigate(-1)}
      />
      <PageHeader
        headerTitle={`Expense Report`}
        renderRight={() => (
          <FilterComponent
            onConfirm={(s, e) => getCall(s, e)}
            exportToExcel={exportToExcel}
            exportToPdf={exportToPdf}
          />
        )}
      />
      <Card className="mb-3 shadow-sm">
        <Card.Body className="pt-2 px-3" style={{paddingBottom:'4px'}}>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <strong>Member Name :</strong>{" "}
              <strong className="text-muted">{memberName}</strong>
            </div>
            <div>
              <strong>Grand Total :</strong>{" "}
              <strong className="text-muted font-weight-bold">
                {formatPriceINR(expenseGrandTotal)}
              </strong>
            </div>
          </div>
        </Card.Body>
      </Card>

      <DataTable
        columns={columns}
        onRowClicked={onRowClicked}
        data={allExpense}
        pagination
        paginationServer
        progressPending={loading}
        highlightOnHover
        customStyles={{
          ...customStyles,
          rows: {
            style: {
              cursor: "pointer",
            },
          },
        }}
      />
    </div>
  );
}

export default MemberExpenseReport;
