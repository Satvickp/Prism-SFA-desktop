import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/common/PageHeader";
import { useSelector } from "react-redux";
import * as XLSX from "xlsx";
import Swal from "sweetalert2";
import Loading from "../../../components/UI/Loading";
import DataTable, { defaultThemes } from "react-data-table-component";
import AsyncSelect from "react-select/async";
import { Button } from "react-bootstrap";
import { useMemberHook } from "../../../hooks/memberHook";
import { getMemberBeetJourneyPlanByMemberIdApi } from "../../../api/reports";
import { formatDistance, getTimeFormat } from "../../../helper/date-functions";

export const getStatusStyles = (status) => {
  if (status === "Completed") {
    return { backgroundColor: "green", color: "white", padding: 7 };
  } else if (status === "Pending") {
    return { backgroundColor: "orange", color: "white", padding: 7 };
  } else {
    return { backgroundColor: "blue", color: "white", padding: 7 };
  }
};

function BeetJourneyReport() {
  const Member = useSelector((state) => state.Member.allMembers);
  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const { get } = useMemberHook();
  const [memberOptions, setMemberOptions] = useState([]);
  const CLIENT_TYPE = window.localStorage.getItem("CLIENT_TYPE");

  const filterMember = (inputValue) => {
    return Member.filter(
      (i) =>
        i.firstName.toLowerCase().includes(inputValue.toLowerCase()) ||
        i.lastName.toLowerCase().includes(inputValue.toLowerCase())
    );
  };

  const promiseOptions = async (inputValue) => {
    const value = await new Promise((resolve) => {
      console.log("kkkk", value);
      setTimeout(() => {
        resolve(inputValue ? filterMember(inputValue) : Member);
      }, 1000);
    });
    return value.map((item) => ({
      label: `${item.firstName} ${item.lastName} (${item.employeeId})`,
      value: {
        firstName: item.firstName,
        lastName: item.lastName,
        employeeId: item.id,
      },
    }));
  };

  function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours} hour${hours > 1 ? "s" : ""} ${minutes} min${
        minutes > 1 ? "s" : ""
      } ${secs} sec${secs > 1 ? "s" : ""}`;
    } else if (minutes > 0) {
      return `${minutes} min${minutes > 1 ? "s" : ""} ${secs} sec${
        secs > 1 ? "s" : ""
      }`;
    } else {
      return `${secs} sec${secs > 1 ? "s" : ""}`;
    }
  }
  useEffect(() => {
    get();
  }, []);

  useEffect(() => {
    if (Member?.length > 0) {
      const options = Member?.map((item) => ({
        label: `${item.firstName} ${item.lastName} (${item.employeeId})`,
        value: {
          firstName: item.firstName,
          lastName: item.lastName,
          employeeId: item.id,
        },
      }));
      console.log("hkhk", options);
      setMemberOptions(options);
    }
  }, [Member]);

  const getBeetJourneyPlan = async (value = selectedMember?.value) => {
    try {
      if (value) {
        const memberId = value.employeeId;
        const resp = await getMemberBeetJourneyPlanByMemberIdApi(memberId);
        console.log("ppppp", resp);
        setReportData(resp);
      }
    } catch (error) {
      console.log("Error fetching journey plan:", error);
      Swal.fire(
        "No Journey Plan Found",
        "Please Select Another Member",
        "info"
      );
    }
  };

  useEffect(() => {
    getBeetJourneyPlan();
  }, [selectedMember]);

  const columns = [
    {
      name: (
        <span className="text-wrap">{getPageType().toUpperCase()} NAME</span>
      ),
      // selector: (row) => row?.beet?.beet || "NA",
      selector: (row) => (
        <span className={"text-wrap"}>{row?.beet?.beet || "NA"} </span>
      ),
      sortable: true,
    },
    {
      name: <span className="text-wrap">ADDRESS</span>,
      selector: (row) => (
        <span className={"text-wrap"}>{row?.beet?.address || "NA"} </span>
      ),
      sortable: true,
    },
    {
      name: <span className="text-wrap">POSTAL CODE</span>,
      selector: (row) => (
        <span className={"text-wrap"}>{row?.beet?.postalCode || "NA"} </span>
      ),
      sortable: true,
    },
    {
      name: <span className="text-wrap">OUTLET NAME</span>,
      selector: (row) => (
        <span className={"text-wrap"}>
          {row?.outletGetDto?.outletName || "NA"}{" "}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="text-wrap">VISIT DATE</span>,
      selector: (row) => (
        <span className={"text-wrap"}>{row?.visitDate || "NA"} </span>
      ),
      sortable: true,
    },
    {
      name: <span className="text-wrap">ORDER REMARK</span>,
      selector: (row) => (
        <span className={"text-wrap"}>{row?.orderRemark || "NA"} </span>
      ),
      sortable: true,
    },
    {
      name: <span className="text-wrap">WORKING WITH</span>,
      selector: (row) => (
        <span className={"text-wrap"}>{row?.workingWith || "NA"} </span>
      ),
      sortable: true,
    },
    {
      name: <span className="text-wrap">CHECKED IN</span>,
      selector: (row) => (
        <span className={"text-wrap"}>
          {row.checkIn ? getTimeFormat(row.checkIn) : "NA"}{" "}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="text-wrap">CHECKED OUT</span>,
      selector: (row) => (
        <span className={"text-wrap"}>
          {row.checkOut ? getTimeFormat(row.checkOut) : "NA"}{" "}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="text-wrap">TOTAL TIME</span>,
      selector: (row) => (
        <span className={"text-wrap"}>
          {row.totalTime ? formatTime(row.totalTime) : 0}{" "}
        </span>
      ),
      sortable: true,
    },
    {
      name: <span className="text-wrap">TOTAL DISTANCE</span>,
      selector: (row) => (
        <span className={"text-wrap"}>
          {formatDistance(row?.totalDistance)}
        </span>
      ),
      sortable: true,
    },
    {
      name: (
        <span className="text-wrap">
          {getPageType().toUpperCase()} JOURNEY STATUS
        </span>
      ),
      selector: (row) => (
        <span className={"text-wrap"}>
          {row?.beetJourneyPlanStatus || "NA"}{" "}
        </span>
      ),
      sortable: true,
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

  const exportToExcel = () => {
    if (reportData.length <= 0) {
      Swal.fire(
        "Unable to export",
        "There is no data available to export",
        "info"
      );
      return;
    }

    const headers = [
      "Beet",
      "Address",
      "Postal Code",
      "Visit Date",
      "Order Remark",
      "Working With",
      "Checked In",
      "Checked Out",
      "Total Time",
      "Total Distance",
      "Beet Journey Plan Status",
    ];

    const rows = reportData?.map((row) => [
      row?.beet?.beet || "NA",
      row?.beet?.address || "NA",
      row?.beet?.postalCode || "NA",
      row?.visitDate || "NA",
      row?.orderRemark || "NA",
      row?.workingWith || "NA",
      row.checkIn ? getTimeFormat(row.checkIn) : "NA",
      row.checkOut ? getTimeFormat(row.checkOut) : "NA",
      row?.totalTime ? formatTime(row.totalTime) : "NA",
      row?.totalDistance || 0,
      row?.beetJourneyPlanStatus || "NA",
    ]);

    const wsData = [headers, ...rows];
    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws["!cols"] = headers.map(() => ({ width: 20 }));
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Beet Journey Plan");
    XLSX.writeFile(wb, `_beet_journey_plan.xlsx`);
  };

  const customStyles = {
    headRow: {
      style: { borderTop: "1px solid #ccc" },
    },
    cells: {
      style: {
        "&:not(:last-of-type)": { borderRight: "1px solid #ccc" },
      },
    },
  };

  function getPageType() {
    return CLIENT_TYPE === "CLIENT_FMCG" ? "Beat" : "Route";
  }

  return (
    <>
      {loading ? (
        <Loading animation={"border"} color={"black"} />
      ) : (
        <div className="container-xxl">
          <PageHeader
            headerTitle={`${getPageType()} Journey Report - ${new Date().toLocaleDateString()}`}
            renderRight={() => (
              <div className="d-flex gap-3">
                <AsyncSelect
                  placeholder={"Select a member"}
                  cacheOptions
                  defaultOptions={memberOptions}
                  loadOptions={promiseOptions}
                  value={selectedMember}
                  onChange={(e) => setSelectedMember(e)}
                  styles={{
                    control: (base) => ({ ...base, width: "250px" }),
                  }}
                />
                <Button onClick={exportToExcel}>
                  <i className="icofont-download-alt"></i>
                </Button>
              </div>
            )}
          />
          <div className="row clearfix g-3">
            {reportData?.length > 0 ? (
              <DataTable
                columns={columns}
                customStyles={customStyles}
                data={reportData}
                pagination
                highlightOnHover
              />
            ) : (
              <h4>
                {selectedMember?.value
                  ? "No Journey Plan Available"
                  : "No Member Selected"}
              </h4>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default BeetJourneyReport;
