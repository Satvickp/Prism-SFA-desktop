import DataTable from "react-data-table-component";
import Loading from "../../components/UI/Loading";
import { useSelector } from "react-redux";
import { ExpensesData } from "../../components/Data/AppData";
import { permissionIds } from "../../constants/constants";
import { useEffect } from "react";
import { customStyles } from "../../constants/customStyles";

export default function ExpenseTable({
  isMemberExpense,
  allMemberArray,
  handlePageChange,
  expenseData,
  SelectedExpense,
  setIsEditModal,
  setIsDeleteModal,
}) {
  const allExpenses = useSelector((state) => state.Expenses);
  const { memberPermissions } = useSelector((state) => state.Permission);

  const getStatusStyles = (status) => {
    if (status === "ACCEPTED") {
      return {
        backgroundColor: "green",
        color: "white",
        padding: 7,
      };
    } else if (status === "PENDING") {
      return {
        backgroundColor: "orange",
        color: "white",
        padding: 7,
      };
    } else {
      return {
        backgroundColor: "red",
        color: "white",
        padding: 7,
      };
    }
  };

  var MemberExpenseT = "";
  MemberExpenseT = [
    {
      name: "Member",
      selector: (row) => `${row?.firstName || "- "} ${row?.lastName || "-"}`,
      sortable: true,
    },
    {
      name: "Spent At",
      selector: (row) => row.spentAt || "NA",
      sortable: true,
    },

    {
      name: "DATE",
      selector: (row) => row.date || "NA",
      sortable: true,
    },
    {
      name: "Amount (INR)",
      selector: (row) => (row.amount ? `₹ ${row.amount}` : "NA"),
      sortable: true,
    },
    {
      name:"Approved Amount",
      selector: (row)=>(row.approvedAmount ? `₹ ${row.approvedAmount}` : "NA"),
      sortable:true,
    },
    {
      name: "Remark",
      selector: () => {},
      sortable: true,
      cell: (row) => (
        <div>
          {" "}
          {/* <img className="avatar rounded-circle" src={row.image} alt=""></img> */}
          <span className="fw-bold ms-1">
            {row.remark ? row.remark : "No Remark"}
          </span>
        </div>
      ),
    },
    {
      name: "ACTION",
      selector: () => {},
      sortable: true,
      cell: (row) => {
        return (
          <div
            className="btn-group"
            role="group"
            aria-label="Basic outlined example"
          >
            {row.expenseStatus == "PENDING" ? (
              <>
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    // acceptExpense(row);
                    SelectedExpense.current = row;
                    setIsEditModal(true);
                  }}
                >
                  <i className="icofont-check-circled text-success"></i>
                </button>
                <button
                  type="button"
                  className="btn btn-outline-secondary deleterow"
                  onClick={() => {
                    SelectedExpense.current = row;
                    setIsDeleteModal(true);
                  }}
                >
                  <i className="icofont-close-circled text-danger"></i>
                </button>
              </>
            ) : (
              <p
                style={{
                  marginTop: "1em",
                  ...getStatusStyles(row.expenseStatus),
                  fontSize: 13,
                  borderTopLeftRadius: 10,
                  borderBottomRightRadius: 10,
                }}
              >
                {row.expenseStatus === "ACCEPTED" ? "Accepted" : "Rejected"}
              </p>
            )}
          </div>
        );
      },
    },
  ];

  var MyExpenseT = "";
  MyExpenseT = [
    {
      name: <span className="text-wrap">BILL IMAGE</span>,
      selector: (row) => (
        <span className={"text-wrap"}>
          {row.imageBase64Url ? (
            <img
              src={row.imageBase64Url}
              alt="bill-image"
              height={"50px"}
              width={"50px"}
            />
          ) : (
            <img
              src={"/no-image-available.png"}
              alt="bill-image"
              height={"50px"}
              width={"50px"}
            />
          )}
        </span>
      ),
      sortable: true,
    },
    {
      name: "Spent At",
      selector: (row) => row.spentAt || "NA",
      sortable: true,
    },

    {
      name: "DATE",
      selector: (row) => row.date || "NA",
      sortable: true,
    },
    {
      name: "Amount (INR)",
      selector: (row) => (row.amount ? `₹ ${row.amount}` : "NA"),
      sortable: true,
    },
    {
      name: "Remark",
      selector: () => {},
      sortable: true,
      cell: (row) => (
        <div>
          {" "}
          {/* <img className="avatar rounded-circle" src={row.image} alt=""></img> */}
          <span className="fw-bold ms-1">
            {row.remark ? row.remark : "No Remark"}
          </span>
        </div>
      ),
    },
    {
      name: "STATUS",
      selector: () => {},
      sortable: true,
      cell: (row) => {
        return (
          <div
            className="btn-group "
            role="group"
            aria-label="Basic outlined example"
          >
            <p
              style={{
                marginTop: "1em",
                ...getStatusStyles(row.expenseStatus),
                fontSize: 13,
                borderTopLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            >
              {row.expenseStatus === "PENDING"
                ? "Pending"
                : row.expenseStatus === "ACCEPTED"
                ? "Accepted"
                : "Rejected"}
            </p>
          </div>
        );
      },
    },
  ];

  // useEffect(()=> {
  //     console.log("Reload Table", expenseData);
  // }, [expenseData])

  const customStyles = {
    headCells: {
      style: {
        padding: "15px",
        fontWeight: "bold",
      },
    },
    cells: {
      style: {
        padding: "1px 15px",
      },
    },
  };

  return (
    <DataTable
      title={ExpensesData.title}
      columns={isMemberExpense ? MemberExpenseT : MyExpenseT}
      data={
        isMemberExpense ? allExpenses.allExpenses?.filter((item) => item.expenseWay !== "TA_DA_EXPENSE") : allExpenses.allMyExpenses
      }
      defaultSortField="title"
      // onChangePage={handlePageChange} // Use a proper function for page changes
      pagination
      selectableRows={false}
      //className="table myDataTable table-hover align-middle mb-0 d-row nowrap dataTable no-footer dtr-inline"
      highlightOnHover={true}
      page
      // paginationServer
      progressComponent={<Loading animation={"border"} color={"black"} />}
      // paginationTotalRows={allExpenses.paginationData.totalElements}
      // paginationComponentOptions={{
      //   noRowsPerPage: true,
      // }}
      customStyles={customStyles}
    />
  );
}
