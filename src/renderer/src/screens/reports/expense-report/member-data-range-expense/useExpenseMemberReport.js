import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { errorMsg, formatPriceINR } from "../../../../helper/exportFunction";
import { apiGetAllExpenseByMemberIdAndDateRange } from "../../../../api/expense/expense-api";
import { getDateFormat } from "../../../../helper/date-functions";
import { EXPENSE_WAY } from "../../../../constants/constants";
import { exportToExcel } from "../../beet-report/hook";
import { exportToPdf } from "./pdf";

function calculateExpenseData(expenseData) {
  let data = {};
  let otherExpense = [];
  let totalOtherExpense = 0;
  let approvedAmount = 0;
  let nonApprovedAmount = 0;
  expenseData.expenseDto?.map((exp) => {
    if (exp?.expenseWay === EXPENSE_WAY.ta_da_expense) {
      data.distanceTraveled = ((exp.distanceTraveled ?? 0) / 1000).toFixed(2);
      data.da_EXCity = exp?.da_EXCity ?? 0;
      data.amount = exp?.amount ?? 0;
      data.ta = exp.totalTa * data.distanceTraveled ?? 0;
      data.da = data.amount - data.ta ?? 0;
      approvedAmount += data.amount ?? 0;
    } else {
      otherExpense.push(exp);
      totalOtherExpense += exp?.amount ?? 0;
      if (exp.expenseStatus === "ACCEPTED") {
        approvedAmount += exp.approvedAmount || 0;
      }
      else if(exp.expenseStatus ==="Rejected" || "Pending"){
        nonApprovedAmount += exp.amount - (exp.approvedAmount || 0);
      }
    }
  });
  approvedAmount += data.amount ?? 0;
  data.otherExpense = otherExpense;
  data.totalOtherExpense = totalOtherExpense;
  data.approvedAmount = approvedAmount;
  data.nonApprovedAmount = nonApprovedAmount;
  data.totalExpenseAmount = totalOtherExpense + (data.amount ?? 0);
  data.date = expenseData.localDate;
  return data;
}

const fn_refine_data = (data) => {
  let expData = [];
  let expenseUnique = new Map();
  data.forEach((exp_date) => {
    const resp = calculateExpenseData(exp_date);
    expData.push(resp);
    expenseUnique.set(exp_date.localDate, exp_date.expenseDto ?? []);
  });
  return {
    expData,
    expenseUnique,
  };
};

export const useExpenseMemberReport = () => {
  const { state: expenseState } = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [allExpense, setAllExpense] = useState([]);
  const expenseRef = useRef(new Map());

  async function getCall(startDate, endDate) {
    setLoading(true);
    try {
      const expenseResp = await apiGetAllExpenseByMemberIdAndDateRange({
        startDate,
        endDate,
        memberId: expenseState.memberId,
      });
      let format = fn_refine_data(expenseResp);
      setAllExpense(format.expData);
      expenseRef.current = format.expenseUnique;
    } catch (error) {
      Swal.fire("Oops", errorMsg(error), "warning");
    }
    setLoading(false);
  }

  useEffect(() => {
    if (!expenseState || !expenseState.isExpense || !expenseState.memberName) {
      navigate("/");
      return;
    }
    let startDate = new Date();
    startDate.setDate(1);
    let endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    );
    getCall(getDateFormat(startDate), getDateFormat(endDate));
  }, []);

  const columns = useMemo(() => {
    let returnCol = [
      {
        name: "Date",
        selector: (row) => row.date,
        wrap: true,
      },
      {
        name: "TA",
        selector: (row) => formatValue(row.ta, formatPriceINR(row.ta)),
      },
      {
        name: "DA",
        selector: (row) => formatValue(row.da, formatPriceINR(row.da?.toFixed(0) ?? 0)),
      },
      {
        name: "DA+TA",
        selector: (row) => formatValue(row.amount, formatPriceINR(row.amount)),
      },
      {
        name: <span className="text-warp">Other expense counts</span>,
        selector: (row) => formatValue(row.otherExpense?.length),
        center: true,
      },
      {
        name: "Approved Amount",
        selector: (row) =>
          formatValue(row.approvedAmount, formatPriceINR(row.approvedAmount)),
      },
      {
        name: "Un-Approved Amount",
        selector: (row) =>
          formatValue(
            row.nonApprovedAmount,
            formatPriceINR(row.nonApprovedAmount)
          ),
      },
      {
        name: "Total Expense",
        selector: (row) =>
          formatValue(
            row.totalExpenseAmount,
            formatPriceINR(row.totalExpenseAmount)
          ),
      },
    ];
    return returnCol;
  }, [allExpense]);

  const onRowClicked = (row) =>
    navigate("/expense-day-detail", {
      state: {
        data: expenseRef.current.get(row.date),
      },
    });

  const expenseGrandTotal = useMemo(() => {
    return allExpense?.reduce((previousValue, expense) => {
      return (
        previousValue +
        (isNaN(expense.totalExpenseAmount) ? 0 : expense.totalExpenseAmount)
      );
    }, 0);
  }, [allExpense]);

  return {
    loading,
    memberName: expenseState?.memberName ?? "",
    allExpense,
    columns,
    getCall,
    onRowClicked,
    navigate,
    exportToExcel: () =>
      exportToExcel(
        allExpense,
        columns,
        expenseState?.memberName + " expense",
        "expense.xlsx"
      ),
    exportToPdf: () =>
      exportToPdf(
        columns,
        allExpense,
        expenseState?.memberName + " expense",
        formatPriceINR(expenseGrandTotal)
      ),
    expenseGrandTotal,
    formatPriceINR,
  };
};

const formatValue = (val, custom) =>
  val === null || val === undefined ? "N/A" : custom ? custom : val;
