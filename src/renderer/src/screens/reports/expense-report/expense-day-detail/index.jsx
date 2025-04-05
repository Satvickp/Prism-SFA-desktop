import { useExpenseDayDetail } from "./useExpenseDayDetail";
import PageHeader from "../../../../components/common/PageHeader";
import DataTable from "react-data-table-component";
import { IoChevronBackCircle } from "react-icons/io5";
function ExpenseDayDetail() {
  const {
    expenseData,
    columns,
    navigate,
    paginatedData,
    setCurrentPage,
    setRowsPerPage,
    totalRows,
  } = useExpenseDayDetail();

  return (
    <div>
      <IoChevronBackCircle
        size={28}
        color="#484c7f"
        style={{ marginBottom: "-10px" }}
        onClick={() => navigate(-1)}
      />
      <PageHeader
        headerTitle={`Expense Detail ${
          expenseData?.length > 0 ? `(${expenseData[0]?.date})` : ""
        }`}
      />
      <DataTable
        columns={columns}
        data={paginatedData}
        pagination
        paginationServer
        paginationTotalRows={totalRows}
        onChangePage={(page) => setCurrentPage(page)}
        onChangeRowsPerPage={(newRows, page) => {
          setRowsPerPage(newRows);
          setCurrentPage(page);
        }}
        highlightOnHover
        customStyles={{
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

export default ExpenseDayDetail;
