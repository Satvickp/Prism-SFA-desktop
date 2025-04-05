import { useEffect, useMemo, useState } from "react";
import Swal from "sweetalert2";
import { apiGetAllBeetLogByVisitDate } from "../../../api/beet-journey/beet-journey-logs";
import {
  calculateTotalTime,
  convertSecondsToTimeFormat,
  getDateFormat,
  getTimeFormat,
} from "../../../helper/date-functions";
import { utils, writeFile } from "xlsx";
import { useNavigate } from "react-router-dom";
import { useIsFMCG } from "../../../helper/isManager";
import {
  apiGetAllPatchLogByVisitDate,
  apiGetAllPatchNotCreatedByVisitDate,
} from "../../../api/patch-journey";
import { colouredExportToExcel, getDCRCols } from "./cols";

function fn_refinedBeetLogByMember(data, isFMCG) {
  let memberLogMap = new Map();
  data.forEach((log) => {
    const memberInfo = log.memberGetDto;
    const beetInfo = log.beet;
    const outletInfo = log.outletGetDto;

    if (!memberLogMap.has(memberInfo.id)) {
      memberLogMap.set(memberInfo.id, {
        dcrDate: log.visitDate,
        employeeName: memberInfo.firstName + " " + memberInfo.lastName,
        employeeCode: memberInfo?.employeeId,
        reportingManager: memberInfo?.reportingManager,
        state: beetInfo?.state ?? "N/A",
        headQtr: beetInfo?.address,
        designation: memberInfo?.designationName ?? "N/A",
        divisionName:
          memberInfo?.divisions?.map((e) => e.divisionName)?.join(" ") ?? "N/A",
        dayPlanDate: log.visitDate,
        checkinTime: log?.checkIn ?? "N/A",
        routeAddress: beetInfo?.address,
        workingType: log?.workingWith,
        workWith: log?.workingWithMemberDtoList
          ? log?.workingWithMemberDtoList
              .map((e) => `${e.memberName},`)
              .join(" ")
          : "N/A",
        plannedRoute: "N/A",
        workingArea: "N/A",
        firstCallTime: log?.checkIn ?? "N/A",
        lastCallTime: log?.checkOut ?? "N/A",
        wh: 0,
        submitAreaLastCall: outletInfo?.outletName,
        submitAreaLatLong: log?.checkoutAddress ?? "N/A",
        leaveTime: "N/A",
        submitDate: log.visitDate,
        gpsKm: (log?.totalDistance ?? 0) / 1000,
        totalCall: 0,
        completedCall: 0,
        missedCall: 0,
        totalChemistCall: 0,
        totalChemistCompletedCall: 0,
        totalChemistMissedCall: 0,
        cityType: beetInfo.cityType,
        daType: beetInfo.cityType?.split("_").join(" "),
        totalStockistCall: 0,
        totalMissedStockistCall: 0,
        totalCompletedStockistCall: 0,
        totalDrCall: 0,
        totalDrCompletedCall: 0,
        totalDrMissCall: 0,
      });
    }

    let memberLog = memberLogMap.get(memberInfo.id);

    if (
      log.checkIn &&
      (memberLog.firstCallTime === "N/A" ||
        log.checkIn < memberLog.firstCallTime)
    ) {
      memberLog.firstCallTime = log.checkIn;
    }
    if (
      log.checkOut &&
      (memberLog.lastCallTime === "N/A" ||
        log.checkOut > memberLog.lastCallTime)
    ) {
      memberLog.lastCallTime = log.checkOut;
    }

    if (memberLog.firstCallTime !== "N/A" && memberLog.lastCallTime !== "N/A") {
      let firstCheckInTime = new Date(memberLog.firstCallTime).getTime();
      let lastCheckOutTime = new Date(memberLog.lastCallTime).getTime();

      if (firstCheckInTime && lastCheckOutTime) {
        let calculatedWH = (lastCheckOutTime - firstCheckInTime) / (1000 * 60);
        memberLog.wh = calculatedWH;
      }
    }

    if (isFMCG && log.isDoctor) {
    } else {
      memberLog.totalCall += 1;
      if (log.isOutlet) {
        memberLog.totalChemistCall += 1;
        if (log.beetJourneyPlanStatus === "Completed") {
          memberLog.completedCall += 1;
          memberLog.totalChemistCompletedCall += 1;
        } else {
          memberLog.missedCall += 1;
          memberLog.totalChemistMissedCall += 1;
        }
      } else if (log.isDoctor) {
          memberLog.totalDrCall += 1;
        if (
          log.doctorJourneyPlanStatus === "Completed"
        ) {
          memberLog.completedCall += 1;
          memberLog[
            log.isDoctor ? "totalDrCompletedCall" : "totalChemistCompletedCall"
          ] += 1;
        } else {
          memberLog.missedCall += 1;
          memberLog[
            log.isDoctor ? "totalDrMissCall" : "totalChemistMissedCall"
          ] += 1;
        }
      } else if (log.isClient) {
        memberLog.totalStockistCall += 1;
        if (log.clientFmcgJourneyPlanStatus === "Completed") {
          memberLog.totalCompletedStockistCall += 1;
          memberLog.completedCall += 1;
        } else {
          memberLog.totalMissedStockistCall += 1;
          memberLog.missedCall += 1;
        }
      }
    }

    memberLog.wh += log?.totalTime ?? 0;
    memberLog.gpsKm += (log?.totalDistance ?? 0) / 1000;
  });

  let returnArray = [];
  memberLogMap.forEach((val, key) => {
    returnArray.push({
      ...val,
      id: key,
    });
  });
  return returnArray;
}

function fn_refinedPatchNotCreated(data, visitDate) {
  return data.map((log) => {
    return {
      memberName: `${log?.firstName} ${log.lastName}`,
      memberId: log.employeeId,
      reportingManager: log.reportingManager,
      email: log.email,
      isLeaveToday: log.leaveToday,
      visitDate,
      id: Math.random() + Date.now(),
    };
  });
}

export const exportToExcel = (data, columns, sheetName, excelName) => {
  const formattedData = data.map((row) =>
    columns.reduce((acc, column) => {
      acc[
        typeof column.name == "object"
          ? column.name?.props?.children
          : column.name
      ] =
        typeof column.selector(row) === "object"
          ? column.selector(row)?.props?.children ?? ""
          : column.selector(row);
      return acc;
    }, {})
  );
  const ws = utils.json_to_sheet(formattedData);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, sheetName);
  writeFile(wb, excelName);
};

export const useBeetReport = () => {
  const [loading, setLoading] = useState(false);
  const [allMemberBeetLogReport, setAllMemberBeetLogReport] = useState([]);
  const [allMemberWithoutPlan, setAllMemberWithoutPlan] = useState([]);
  const [filterMemberId, setFilterMemberId] = useState([]);
  const [activeTabReport, setActiveReportTab] = useState("plan-created");
  const [noPlanFilterMemberId, setNoPlanFilterMemberId] = useState([]);
  const isFMCG = useIsFMCG();
  const navigate = useNavigate();
  async function helperGetCall(visitDate) {
    setLoading(true);
    try {
      const apiResp = await apiGetAllPatchLogByVisitDate(visitDate);
      let data = [
        ...apiResp.bjpReportResponseList.map((e)=>({...e, isOutlet:true})),
        ...apiResp.doctorReportResponseList.map((e) => ({
          ...e,
          isDoctor: true,
        })),
        ...apiResp.cjpReportResponseList.map((e) => ({ ...e, isClient: true })),
      ];
      const refinedBeetLogByMember = fn_refinedBeetLogByMember(data, isFMCG);
      setAllMemberBeetLogReport(refinedBeetLogByMember);

      const not_createdResp = await apiGetAllPatchNotCreatedByVisitDate(
        visitDate
      );

      setAllMemberWithoutPlan(
        fn_refinedPatchNotCreated(not_createdResp ?? [], visitDate)
      );
    } catch (error) {
      console.log(error);
      Swal.fire(
        "Something went wrong",
        error?.response?.data?.message ?? "Can't Fetch Necessary data"
      );
    }
    setLoading(false);
  }

  useEffect(() => {
    helperGetCall(getDateFormat(new Date()));
  }, []);

  const filterDataMemberBeetLog = useMemo(() => {
    if (!filterMemberId || filterMemberId.length === 0)
      return allMemberBeetLogReport;

    return allMemberBeetLogReport.filter((log) =>
      filterMemberId.includes(log.id)
    );
  }, [filterMemberId, allMemberBeetLogReport]);

  const noPlanFilterMemberBeetLog = useMemo(() => {
    if (!noPlanFilterMemberId || noPlanFilterMemberId.length === 0)
      return allMemberWithoutPlan;

    return allMemberWithoutPlan.filter((log) =>
      noPlanFilterMemberId.includes(log.id)
    );
  }, [noPlanFilterMemberId, allMemberWithoutPlan]);

  const plan_not_created_col = useMemo(() => {
    return [
      {
        name: <span className="text-wrap">DCR DATE</span>,
        selector: (row) => <span className="text-wrap">{row.visitDate}</span>,
        sortable: true,
        width: "110px",
      },
      {
        name: <span className="text-wrap">MEMBER NAME</span>,
        selector: (row) => <span className="text-wrap">{row.memberName}</span>,
        sortable: true,
        // width: "140px",
      },
      {
        name: <span className="text-wrap">MEMBER ID</span>,
        selector: (row) => <span className="text-wrap">{row.memberId}</span>,
        sortable: true,
        width: "120px",
      },
      {
        name: <span className="text-wrap">ON LEAVE</span>,
        selector: (row) => (
          <span className="text-wrap">{row.isLeaveToday ? "Yes" : "No"}</span>
        ),
        sortable: true,
        width: "110px",
      },
      {
        name: <span className="text-wrap">EMAIL</span>,
        selector: (row) => <span className="text-wrap">{row.email}</span>,
        sortable: true,
      },
    ];
  }, [allMemberWithoutPlan]);

  const planNotCreatedConditionalRowStyles = [
    {
      when: (row) => row.isLeaveToday,
      style: {
        backgroundColor: "#d4edda",
      },
    },
  ];
  const columns = getDCRCols(isFMCG);

  return {
    columns,
    plan_not_created_col,
    loading,
    allMemberBeetLogReport,
    planNotCreatedConditionalRowStyles,
    allMemberWithoutPlan,
    helperGetCall,
    filterMemberId,
    setFilterMemberId,
    filterDataMemberBeetLog,
    onRowClicked: (row) =>
      navigate("/beet-report-member-detail", {
        state: row,
      }),
    isFMCG,
    exportToExcel: () =>
      colouredExportToExcel(
        allMemberBeetLogReport,
        columns,
        "Journey Report",
        "Journey_Report.xlsx"
      ),
    exportToExcelPlanNotCreated: () =>
      exportToExcel(
        allMemberWithoutPlan,
        plan_not_created_col,
        "Journey Not Cred Report",
        "Journey_not_created_Report.xlsx"
      ),
    activeTabReport,
    setActiveReportTab,
    noPlanFilterMemberId,
    setNoPlanFilterMemberId,
    noPlanFilterMemberBeetLog,
  };
};
