import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { apiGetAllBeetLogByDateRangeAndMemberId } from "../../../../api/beet-journey/beet-journey-logs";
import { useLocation, useNavigate } from "react-router-dom";
import {
  calculateTotalTime,
  convertSecondsToTimeFormat,
  getDateFormat,
  getTimeFormat,
} from "../../../../helper/date-functions";
import { exportToExcel } from "../hook";
import { useIsFMCG } from "../../../../helper/isManager";
import { apiGetAllPatchLogByDateRangeAndMemberId } from "../../../../api/patch-journey";

function fn_refinedBeetLogByDate(data, isFMCG) {
  let logMap = new Map();
  data.forEach((log) => {
    const beetInfo = log.beet;
    const outletInfo = log.outletGetDto;
    // const clientInfo = log.clientFMCGResponse; // no use for now

    if (!logMap.has(log.visitDate)) {
      logMap.set(log.visitDate, {
        dcrDate: log.visitDate,
        state: beetInfo?.state ?? "N/A",
        headQtr: beetInfo?.address,
        routeAddress: beetInfo?.address,
        workingType: log?.workingWith ?? "N/A",
        workWith: log?.workingWithMemberDtoList
          ? log?.workingWithMemberDtoList
              ?.map((e) => `${e.memberName},`)
              ?.join(" ")
          : "N/A",
        plannedRoute: "N/A",
        workingArea: "N/A",
        firstCallTime: log?.checkIn ?? "N/A",
        lastCallTime: log?.checkOut ?? "N/A",
        wh: log?.totalTime ?? 0,
        submitAreaLastCall: outletInfo?.outletName,
        submitAreaLatLong: log?.checkoutAddress ?? "N/A",
        leaveTime: "N/A",
        submitDate: log.visitDate,
        gpsKm: (log?.totalDistance ?? 0) / 1000,
        totalCall: 0,
        completedCall: 0,
        missedCall: 0,
        totalDrCall: 0,
        totalDrCompletedCall: 0,
        totalDrMissCall: 0,
        totalChemistCall: 0,
        totalChemistCompletedCall: 0,
        totalChemistMissedCall: 0,
        totalStockistCall: 0,
        totalMissedStockistCall: 0,
        totalCompletedStockistCall: 0,
      });
    }

    let logDetails = logMap.get(log.visitDate);
    if (
      log.checkIn &&
      (logDetails.firstCallTime === "N/A" ||
        log.checkIn < logDetails.firstCallTime)
    ) {
      logDetails.firstCallTime = log.checkIn;
    }
    if (
      log.checkOut &&
      (logDetails.lastCallTime === "N/A" ||
        log.checkOut > logDetails.lastCallTime)
    ) {
      logDetails.lastCallTime = log.checkOut;
    }
    if (isFMCG && log.isDoctor) {
    } else {
      logDetails.totalCall += 1;
      if (log.isOutlet) {
        logDetails.totalChemistCall += 1;
        if (log.beetJourneyPlanStatus === "Completed") {
          logDetails.completedCall += 1;
          logDetails.totalChemistCompletedCall += 1;
        } else {
          logDetails.missedCall += 1;
          logDetails.totalChemistMissedCall += 1;
        }
      } else if (log.isDoctor) {
          logDetails.totalDrCall += 1;
        if (
          log.doctorJourneyPlanStatus === "Completed"
        ) {
          logDetails.completedCall += 1;
          logDetails[
            log.isDoctor ? "totalDrCompletedCall" : "totalChemistCompletedCall"
          ] += 1;
        } else {
          logDetails.missedCall += 1;
          logDetails[
            log.isDoctor ? "totalDrMissCall" : "totalChemistMissedCall"
          ] += 1;
        }
      } else if (log.isClient) {
        logDetails.totalStockistCall += 1;
        if (log.clientFmcgJourneyPlanStatus === "Completed") {
          logDetails.totalCompletedStockistCall += 1;
          logDetails.completedCall += 1;
        } else {
          logDetails.totalMissedStockistCall += 1;
          logDetails.missedCall += 1;
        }
      }
    }
    logDetails.wh += log?.totalTime ?? 0;
    logDetails.gpsKm += (log?.totalDistance ?? 0) / 1000;
  });
  let returnArray = [];
  logMap.forEach((val, key) => {
    returnArray.push({
      ...val,
      visitDate: key,
    });
  });
  return returnArray;
}

export const useBeetRangeHook = () => {
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const [allLogs, setAllLogs] = useState([]);
  const isFMCG = useIsFMCG();
  const navigate = useNavigate();
  async function helperCall(startDate, endDate) {
    if (!state && !state?.employeeName) {
      window.location.href = "/";
      return;
    }
    setLoading(true);
    try {
      const apiResp = await apiGetAllPatchLogByDateRangeAndMemberId(
        startDate,
        endDate,
        state.id
      );
      let data = [
        ...apiResp.bjpReportResponseList.map((e)=>({...e, isOutlet:true})),
        ...apiResp.doctorReportResponseList.map((e) => ({
          ...e,
          isDoctor: true,
        })),
        ...apiResp.cjpReportResponseList.map((e) => ({ ...e, isClient: true })),
      ];
      const refinedBeetLogByMember = fn_refinedBeetLogByDate(data, isFMCG);
      setAllLogs(refinedBeetLogByMember);
    } catch (error) {
      Swal.fire(
        "Something went wrong",
        error?.response?.data?.message ?? "Can't Fetch Necessary data"
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    let startDate = new Date();
    startDate.setDate(1);
    let endDate = new Date(
      startDate.getFullYear(),
      startDate.getMonth() + 1,
      0
    );
    helperCall(getDateFormat(startDate), getDateFormat(endDate));
  }, []);

  const columns = useMemo(() => {
    let templateCol = [
      {
        name: "DCR DATE",
        selector: (row) => (
          <p
            className="text-cyan text-decoration-underline"
            style={{
              cursor: "pointer",
              margin: 0,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "100%",
            }}
          >
            {row.dcrDate}
          </p>
        ),
        sortable: true,
        width: "120px",
      },
      {
        name: <span className="text-wrap">State</span>,
        selector: (row) => <span className="text-wrap">{row.state}</span>,
        sortable: true,
        width: "110px",
      },
      {
        name: <span className="text-wrap">Head Quater</span>,
        selector: (row) => <span className="text-wrap">{row.headQtr}</span>,
        width: "150px",
      },
      {
        name: "Checkin Time",
        selector: (row) =>
          row.firstCallTime != "N/A" ? getTimeFormat(row.firstCallTime) : "N/A",

        width: "120px",
      },
      {
        name: <span className="text-wrap">Route Address</span>,
        selector: (row) => (
          <span className="text-wrap">{row.routeAddress}</span>
        ),
        wrap: true,
        width: "135px",
      },
      {
        name: <span className="text-wrap">Working Type</span>,
        selector: (row) => <span className="text-wrap">{row.workingType}</span>,
        width: "100px",
      },
      {
        name: "Work With",
        selector: (row) => <span className="text-wrap">{row.workWith}</span>,
        width: "100px",
      },
      {
        name: <span className="text-wrap">Planned Route</span>,
        selector: (row) => (
          <span className="text-wrap">{row.plannedRoute}</span>
        ),
        width: "130px",
      },
      {
        name: <span className="text-wrap">First Call Time</span>,
        selector: (row) => (
          <span className="text-wrap">
            {row.firstCallTime != "N/A"
              ? getTimeFormat(row.firstCallTime)
              : "N/A"}
          </span>
        ),
        width: "120px",
      },
      {
        name: <span>Last Call Time</span>,
        selector: (row) => (
          <span className="text-wrap">
            {row.lastCallTime != "N/A"
              ? getTimeFormat(row.lastCallTime)
              : "N/A"}
          </span>
        ),
        width: "120px",
      },

      //   selector: (row) => convertSecondsToTimeFormat(row.wh || 0),
      {
        name: "WH",
        // selector: (row) => convertSecondsToTimeFormat(row.wh || 0),
        selector: (row) => {
          // Check if firstCallTime and lastCallTime are not "N/A" and are valid date strings
          const isValidDate = (dateString) => {
            const date = new Date(dateString);
            return !isNaN(date.getTime()); // Returns true if date is valid
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
        name: <span className="text-wrap">Submit Area Last Call (Outlet)</span>,
        selector: (row) => row.submitAreaLastCall,
        width: "170px",
      },
      {
        name: "Submit Area Lat Long",
        selector: (row) => (
          <span className="text-wrap">{row.submitAreaLatLong}</span>
        ),
        width: "180px",
      },
      {
        name: <span className="text-wrap">Leave Time</span>,
        selector: (row) => row.leaveTime,
        width: "110px",
      },
      {
        name: "Total Call",
        selector: (row) => `${row.totalCall}`,
        width: "100px",
        center: true,
      },
      {
        name: <span className="text-wrap">Completed Call</span>,
        selector: (row) => row.completedCall,
        width: "100px",
        center: true,
      },
      {
        name: "Missed Call",
        selector: (row) => row.missedCall,
        width: "100px",
        center: true,
      },
      {
        name: <span className="text-wrap">Total Stockist Call</span>,
        selector: (row) => `${row.totalStockistCall}`,
        width: "100px",
        center: true,
      },
      {
        name: <span className="text-wrap">Total Stockist Completed Call</span>,
        selector: (row) => row.totalCompletedStockistCall,
        width: "100px",
        center: true,
      },
      {
        name: <span className="text-wrap">Total Stockist Missed Call</span>,
        selector: (row) => row.totalMissedStockistCall,
        width: "100px",
        center: true,
      },
      {
        name: <span className="text-wrap">{`Total ${isFMCG ? 'Outlet' :'Chemist'} Call`}</span>,
        selector: (row) => row.totalChemistCall,
        width: "120px",
        center: true,
      },
      {
        name: <span className="text-wrap">{`${isFMCG ? 'Outlet' :'Chemist'} Completed`}</span>,
        selector: (row) => row.totalChemistCompletedCall,
        width: "100px",
        center: true,
      },
      {
        name: <span className="text-wrap">{`${isFMCG ? 'Outlet' :'Chemist'} Missed`}</span>,
        selector: (row) => row.totalChemistMissedCall,
        width: "100px",
        center: true,
      },
      {
        name: "GPS KM",
        selector: (row) => `${row.gpsKm?.toFixed(2) ?? 0} KM`,
        width: "100px",
        center: true,
      },
    ];
    if (!isFMCG) {
      templateCol.splice(
        templateCol.length - 1,
        0,
        {
          name: <span className="text-wrap">Total Dr Call</span>,
          selector: (row) => row.totalDrCall,
          width: "100px",
          center: true,
        },
        {
          name: <span className="text-wrap">Total Dr Completed</span>,
          selector: (row) => row.totalDrCompletedCall,
          width: "100px",
          center: true,
        },
        {
          name: <span className="text-wrap">Total Dr Missed</span>,
          selector: (row) => row.totalDrMissCall,
          width: "100px",
          center: true,
        },
      );
    }

    return templateCol;
  }, [allLogs]);
  return {
    loading,
    allLogs,
    columns,
    employeeName: state?.employeeName,
    onRowClicked: (row) =>
      navigate("/beet-report-detail", {
        state: {
          memberId: state?.id,
          date: row.dcrDate,
          memberName: state?.employeeName,
        },
      }),
    isFMCG,
    navigate,
    helperCall,
    exportToExcel: () =>
      exportToExcel(
        allLogs,
        columns,
        `${state?.employeeName} beet log report`,
        `${state?.employeeName} beet log report.xlsx`
      ),
  };
};
