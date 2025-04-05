import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { apiGetAllBeetLogByVisitDateAndMemberId } from "../../../../api/beet-journey/beet-journey-logs";
import Swal from "sweetalert2";
import {
  getTimeFormat,
  formatDistance,
  convertSecondsToTimeFormat,
} from "../../../../helper/date-functions";
import { getStatusStyles } from "../../BeetJourneyReports";
import { exportToExcel } from "../hook";
import { useIsFMCG } from "../../../../helper/isManager";
import { apiGetTodayPatchJourney } from "../../../../api/patch-journey";

export const useBeetLogDetail = () => {
  const [loading, setLoading] = useState(false);
  const { state } = useLocation();
  const [allLogs, setAllLogs] = useState([]);
  const [allDocLogs, setAllDocLogs] = useState([]);
  const [allClientLogs, setAllClientLogs] = useState([]);
  const isFMCG = useIsFMCG();
  const navigate = useNavigate();
  const refineData = (data) =>
    data?.map((item) => ({
      beetName: item?.beet?.beet || "NA",
      address: item?.beet?.address || "NA",
      postalCode: item?.beet?.postalCode || "NA",
      outletName: item?.outletGetDto?.outletName || "NA",
      visitDate: item?.visitDate || "NA",
      orderRemark: item?.orderRemark
        ? item.orderRemark.split("_").join(" ")
        : "NA",
      workingType: item?.workingWith ?? "N/A",
      workWith: item?.workingWithMemberDtoList
        ? item?.workingWithMemberDtoList
            ?.map((e) => `${e.memberName},`)
            ?.join(" ")
        : "N/A",
      checkIn: item?.checkIn || null,
      checkOut: item?.checkOut || null,
      totalTime: item?.totalTime || 0,
      totalDistance: item?.totalDistance || 0,
      beetJourneyPlanStatus: isFMCG
        ? item?.beetJourneyPlanStatus || item?.clientFmcgJourneyPlanStatus
        : item?.beetJourneyPlanStatus ||
          item?.doctorJourneyPlanStatus ||
          item?.clientFmcgJourneyPlanStatus ||
          "NA",
      doctorName: item?.doctorRes?.name,
      clientName:
        item?.clientFMCGResponse?.clientFirstName +
        " " +
        item?.clientFMCGResponse?.clientLastName,
    }));

  async function helperCall() {
    if (!state || !state?.memberName || !state.date) {
      window.location.href = "/";
      return;
    }
    setLoading(true);
    try {
      const apiResp = await apiGetTodayPatchJourney(state.memberId, state.date);
      const refinedData = refineData(apiResp.bjpReportResponseList);
      setAllLogs(refinedData);
      if (!isFMCG) {
        const docRefineData = refineData(apiResp.doctorReportResponseList);
        setAllDocLogs(docRefineData);
      }
      const clientRefineData = refineData(apiResp.cjpReportResponseList);
      setAllClientLogs(clientRefineData ?? []);
    } catch (error) {
      console.log(error);
      Swal.fire(
        "Something went wrong",
        error?.response?.data?.message ?? "Can't Fetch Necessary data"
      );
    }
    setLoading(false);
  }

  let templateCol = [
    {
      name: isFMCG ? "Beet Name" : "PATCH",
      selector: (row) => <span className="text-wrap">{row.beetName}</span>,
      sortable: true,
      width: "100px",
    },
    {
      name: "ADDRESS",
      selector: (row) => <span className="text-wrap">{row.address}</span>,
      sortable: true,
      width: "120px",
    },
    {
      name: <span className="text-wrap">POSTAL CODE</span>,
      selector: (row) => <span className="text-wrap">{row.postalCode}</span>,
      sortable: true,
      width: "100px",
    },
    {
      name: "VISIT DATE",
      selector: (row) => <span className="text-wrap">{row.visitDate}</span>,
      sortable: true,
      width: "120px",
    },
    {
      name: <span className="text-wrap">ORDER REMARK</span>,
      selector: (row) => <span className="text-wrap">{row.orderRemark}</span>,
      sortable: true,
      width: "100px",
    },
    {
      name: <span>WORKING TYPE</span>,
      selector: (row) => <span className="text-wrap">{row.workingType}</span>,
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="text-wrap">WORKING WITH</span>,
      selector: (row) => <span className="text-wrap">{row.workWith}</span>,
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="text-wrap">CHECKED IN</span>,
      selector: (row) => (
        <span className="text-wrap">
          {row.checkIn ? getTimeFormat(row.checkIn) : "NA"}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="text-wrap">CHECKED OUT</span>,
      selector: (row) => (
        <span className="text-wrap">
          {row.checkOut ? getTimeFormat(row.checkOut) : "NA"}
        </span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="text-wrap">TOTAL TIME</span>,
      selector: (row) => convertSecondsToTimeFormat(row.totalTime),
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="text-wrap">TOTAL DISTANCE</span>,
      selector: (row) => (
        <span className="text-wrap">{formatDistance(row.totalDistance)}</span>
      ),
      sortable: true,
      width: "100px",
    },
    {
      name: <span className="text-wrap">JOURNEY STATUS</span>,
      selector: (row) => (
        <span className="text-wrap">{row.beetJourneyPlanStatus}</span>
      ),
      sortable: true,
      width: "100px",
      cell: (row) => (
        <p
          style={{
            marginTop: "1em",
            ...getStatusStyles(row.beetJourneyPlanStatus),
            fontSize: 13,
            borderTopLeftRadius: 10,
            borderBottomRightRadius: 10,
          }}
        >
          {row.beetJourneyPlanStatus}
        </p>
      ),
    },
  ];

  let chemistCol = [...templateCol];
  chemistCol.splice(3, 0, {
    name: isFMCG ? "OUTLET" : "CHEMIST",
    selector: (row) => <span className="text-wrap">{row.outletName}</span>,
    sortable: true,
    width: "120px",
  });

  let docCol = [...templateCol];
  docCol.splice(3, 0, {
    name: <span className="text-wrap">DOC NAME</span>,
    selector: (row) => <span className="text-wrap">{row.doctorName}</span>,
    sortable: true,
    width: "120px",
  });

  let stockistCol = [...templateCol];
  stockistCol.splice(3, 0, {
    name: <span className="text-wrap">STOCKIST NAME</span>,
    selector: (row) => <span className="text-wrap">{row.clientName}</span>,
    sortable: true,
    width: "120px",
  });

  useEffect(() => {
    helperCall();
  }, []);

  return {
    loading,
    employeeName: state?.memberName ?? "",
    exportToExcel: (isDoc) =>
      exportToExcel(
        isDoc ? allDocLogs : allLogs,
        isDoc ? docCol : chemistCol,
        `${isDoc ? "DOC-" : "CHEMIST_"}${state?.date}-report`,
        `${state?.memberName}-${isDoc ? "DOC-" : "CHEMIST_"}${
          state?.date
        }-report.xlsx`
      ),
    columns: chemistCol,
    docColumns: docCol,
    allLogs,
    allDocLogs,
    isFMCG,
    navigate,
    stockistCall: stockistCol,
    allClientLogs,
    exportToExcelStock: () => exportToExcel(
      allClientLogs,
      stockistCol,
      `STOCKIST_${state?.date}-report`,
      `${state?.memberName}-STOCKIST${
        state?.date
      }-report.xlsx`
    ),
  };
};
