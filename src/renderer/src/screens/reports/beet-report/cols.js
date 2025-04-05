import {
  calculateTotalTime,
  getTimeFormat,
} from "../../../helper/date-functions";
import XLSX from "xlsx-js-style";

export function getDCRCols(isFMCG) {
  let templateCol = [
    {
      name: <span className="text-wrap">DCR DATE</span>,
      selector: (row) => <span className="text-wrap">{row.dcrDate}</span>,
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="text-wrap">EMPLOYEE NAME</span>,
      selector: (row) => <span className="text-wrap">{row.employeeName}</span>,
      sortable: true,
      width: "120px",
    },
    {
      name: <span className="text-wrap">EMPLOYEE CODE</span>,
      selector: (row) => (
        <p
          className="text-cyan text-decoration-underline"
          style={{ cursor: "pointer", textWrap: "wrap" }}
        >
          {row.employeeCode}
        </p>
      ),
      sortable: true,
      width: "110px",
    },
    {
      name: <span className="text-wrap">STATE</span>,
      selector: (row) => <span className="text-wrap">{row.state}</span>,
      sortable: true,
      width: "70px",
    },
    {
      name: <span className="text-wrap">DESIGNATION</span>,
      selector: (row) => (
        <span className="text-wrap">{row.designation?.[0]}</span>
      ),
      width: "120px",
    },
    {
      name: <span className="text-wrap">DIVISION NAME</span>,
      selector: (row) => <span className="text-wrap">{row.divisionName}</span>,
      width: "120px",
    },
    {
      name: <span className="text-wrap">DAY PLAN DATE</span>,
      selector: (row) => <span className="text-wrap">{row.dayPlanDate}</span>,
      width: "110px",
    },
    {
      name: <span className="text-wrap">WORKING TYPE</span>,
      selector: (row) => <span className="text-wrap">{row.workingType}</span>,
      width: "120px",
    },
    {
      name: <span className="text-wrap">WORK WITH</span>,
      selector: (row) => <span className="text-wrap">{row.workWith}</span>,
      width: "110px",
    },

    {
      name: <span className="text-wrap">ROUTE ADDRESS</span>,
      selector: (row) => <span className="text-wrap">{row.routeAddress}</span>,
      wrap: true,
      width: "130px",
    },
    {
      name: <span className="text-wrap">PLANNED ROUTE</span>,
      selector: (row) => <span className="text-wrap">{row.plannedRoute}</span>,
      width: "120px",
    },
    {
      name: <span className="text-wrap">DA TYPE</span>,
      selector: (row) => <span className="text-wrap">{row.daType}</span>,
      width: "120px",
    },
    {
      name: <span className="text-wrap">FIRST CALL TIME</span>,
      selector: (row) => (
        <span className="text-wrap">
          {row.firstCallTime != "N/A"
            ? getTimeFormat(row.firstCallTime)
            : "N/A"}
        </span>
      ),
      width: "130px",
    },
    {
      name: <span className="text-wrap">LAST CALL TIME</span>,
      selector: (row) => (
        <span className="text-wrap">
          {row.lastCallTime != "N/A" ? getTimeFormat(row.lastCallTime) : "N/A"}
        </span>
      ),
      width: "130px",
    },
    {
      name: <span className="text-wrap">WH</span>,
      selector: (row) => {
        const isValidDate = (dateString) => {
          const date = new Date(dateString);
          return !isNaN(date.getTime());
        };
        if (
          row.firstCallTime !== "N/A" &&
          row.lastCallTime !== "N/A" &&
          isValidDate(row.firstCallTime) &&
          isValidDate(row.lastCallTime)
        ) {
          return calculateTotalTime(row.firstCallTime, row.lastCallTime);
        } else {
          return "N/A";
        }
      },
      width: "60px",
    },
    {
      name: <span className="text-wrap">CHECKIN TIME</span>,
      selector: (row) => (
        <span className="text-wrap">
          {row.firstCallTime != "N/A"
            ? getTimeFormat(row.firstCallTime)
            : "N/A"}
        </span>
      ),

      width: "90px",
    },

    {
      name: (
        <span className="text-wrap">{`SUBMIT AREA LAST CALL (${
          isFMCG ? "OUTLET" : "CHEMIST"
        })`}</span>
      ),
      selector: (row) => (
        <span className="text-wrap">{row.submitAreaLastCall}</span>
      ),
      width: "200px",
      value: (row) => console.log(row),
    },
    {
      name: <span className="text-wrap">SUBMIT AREA</span>,
      selector: (row) => (
        <span className="text-wrap">{row.submitAreaLatLong}</span>
      ),
      width: "160px",
    },
    {
      name: <span className="text-wrap">EOD TIME</span>,
      selector: (row) => (
        <span className="text-wrap">
          {row.lastCallTime != "N/A" ? getTimeFormat(row.lastCallTime) : "N/A"}
        </span>
      ),
      width: "90px",
    },
    {
      name: <span className="text-wrap">Submit Date</span>,
      selector: (row) => <span className="text-wrap">{row.dcrDate}</span>,
      width: "100px",
    },
    {
      name: "GPS KM",
      selector: (row) => `${row.gpsKm?.toFixed(2) ?? 0} KM`,
      width: "90px",
      center: true,
    },
    {
      name: <span className="text-wrap">TOTAL CALL</span>,
      selector: (row) => (
        <span className="text-wrap">{`${row.totalCall}`}</span>
      ),
      width: "100px",
      center: true,
    },
    {
      name: <span className="text-wrap">COMPLETED CALL</span>,
      selector: (row) => <span className="text-wrap">{row.completedCall}</span>,
      width: "90px",
      center: true,
    },
    {
      name: <span className="text-wrap">MISSED CALLS</span>,
      selector: (row) => <span className="text-wrap">{row.missedCall}</span>,
      width: "90px",
      center: true,
    },
    {
      name: (
        <span className="text-wrap">
          TOTAL {isFMCG ? "Outlet" : "Chemist"} CALLS
        </span>
      ),
      selector: (row) => (
        <span className="text-wrap">{row.totalChemistCall}</span>
      ),
      width: "90px",
      center: true,
    },
    {
      name: (
        <span className="text-wrap">
          {" "}
          {isFMCG ? "Outlet" : "Chemist"} COMPLETED
        </span>
      ),
      selector: (row) => (
        <span className="text-wrap">{row.totalChemistCompletedCall}</span>
      ),
      width: "110px",
      center: true,
    },
    {
      name: (
        <span className="text-wrap">
          {" "}
          {isFMCG ? "Outlet" : "Chemist"} MISSED
        </span>
      ),
      selector: (row) => (
        <span className="text-wrap">{row.totalChemistMissedCall}</span>
      ),
      width: "90px",
      center: true,
    },
    {
      name: <span className="text-wrap">Total Stockist Call</span>,
      selector: (row) => `${row.totalStockistCall ?? 0}`,
      width: "100px",
      center: true,
    },
    {
      name: <span className="text-wrap">Total Stockist Completed Call</span>,
      selector: (row) => row.totalCompletedStockistCall ?? 0,
      width: "100px",
      center: true,
    },
    {
      name: <span className="text-wrap">Total Stockist Missed Call</span>,
      selector: (row) => row.totalMissedStockistCall ?? 0,
      width: "100px",
      center: true,
    },
  ];

  if (!isFMCG) {
    templateCol.push({
      name: <span className="text-wrap">TOTAL DR CALLS</span>,
      selector: (row) => <span className="text-wrap">{row.totalDrCall ?? 'N/A'}</span>,
      width: "110px",
      center: true,
    });
    templateCol.push({
      name: <span className="text-wrap">TOTAL DR COMPLETED</span>,
      selector: (row) => (
        <span className="text-wrap">{row.totalDrCompletedCall ?? 'N/A'}</span>
      ),
      width: "110px",
      center: true,
    });
    templateCol.push({
      name: <span className="text-wrap">TOTAL DR MISSED</span>,
      selector: (row) => (
        <span className="text-wrap">{row.totalDrMissCall ?? 'N/A'}</span>
      ),
      width: "110px",
      center: true,
    });
  }

  return templateCol;
}

export const colouredExportToExcel = (data, columns, sheetName, excelName) => {
  const formattedData = data.map((row) =>
    columns.reduce((acc, column) => {
      const columnName =
        typeof column.name === "object"
          ? column.name?.props?.children
          : column.name;
      acc[columnName] =
        typeof column.selector(row) === "object"
          ? column.selector(row)?.props?.children ?? ""
          : column.selector(row);
      return acc;
    }, {})
  );

  const ws = XLSX.utils.json_to_sheet(formattedData);

  const headerStyle = {
    font: { bold: true, color: { rgb: "FFFFFF" } },
    fill: { fgColor: { rgb: "4F81BD" } },
    alignment: { horizontal: "center", vertical: "center" },
  };

  const range = XLSX.utils.decode_range(ws["!ref"]);
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellRef = XLSX.utils.encode_cell({ r: range.s.r, c: col });
    if (!ws[cellRef]) ws[cellRef] = {};
    ws[cellRef].s = headerStyle;
  }

  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, sheetName);

  XLSX.writeFile(wb, excelName);
};
