import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export const useExpenseDayDetail = () => {
  const { state: expenseState } = useLocation();
  const [expenseData, setExpenseData] = useState([]);
  const navigate = useNavigate();
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const totalRows = expenseData.length;
  const paginatedData = expenseData.slice(
    (currentPage - 1) * rowsPerPage,
    currentPage * rowsPerPage
  );

  useEffect(() => {
    if (!expenseState?.data) {
      navigate("/");
      return;
    }
    setExpenseData(expenseState.data);
  }, [expenseState?.data, navigate]);

  const columns = useMemo(
    () => [
      {
        name: "Date",
        selector: (row) => row.date,
        wrap: true,
      },
      {
        name: "Expense Type",
        selector: (row) => row.expenseWay?.split("_").join(" ") ?? "N/A",
        wrap: true,
      },
      {
        name: "Expense Amount",
        selector: (row) => row.amount,
        wrap: true,
      },
      {
        name :"Approved Amount",
        selector:(row)=>row.approvedAmount?? "N/A"

      },
      {
        name: "Spent At",
        selector: (row) => row.spentAt ?? "N/A",
        wrap: true,
      },
      {
        name:"Status",
        selector: (row)=>row.expenseStatus,

      },
    ],
    []
  );

  return {
    expenseData,
    columns,
    navigate,
    currentPage,
    setCurrentPage,
    rowsPerPage,
    setRowsPerPage,
    totalRows,
    paginatedData
  };
};
