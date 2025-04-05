import { useEffect, useMemo, useState } from "react";
import {
  getAllOrderByEachOutletByClientFMCGIdByOrderMediumApi,
  getAllOrderByEachOutletByClientFMCGIdByProductiveStatusApi,
  getAllOrderByEachOutletByMemberIdByOrderMediumApi,
  getAllOrderByEachOutletByMemberIdByProductiveStatusApi,
  getAllOrderByEachBeetByClientFMCGIdByOrderMediumApi,
  getAllOrderByEachBeetByClientFMCGIdByProductiveStatusApi,
  getAllOrderByEachBeetByMemberIdByOrderMediumApi,
  getAllOrderByEachBeetByMemberIdByProductiveStatusApi,
} from "../../../api/reports";
import { useDispatch, useSelector } from "react-redux";
import { setReportData } from "../../../redux/features/reportSlice";
import {
  orderCallStatus,
  orderMedium,
  ReportCallType,
  ReportIdType,
  ReportType,
} from "./FilterComponent";

const useAllOrdersReportHook = () => {
  const allData = useSelector((state) => state.Reports.content);
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);

  const [selectedReportTypeLevel, setSelectedReportTypeLevel] = useState(
    ReportType[1]
  );
  const [selectedReportIdLevel, setSelectedReportIdLevel] = useState(
    ReportIdType[0]
  );
  const [selectedReportCallLevel, setSelectedReportCallLevel] = useState(
    ReportCallType[0]
  );
  const [selectedOrderStatus, setSelectedOrderStatus] = useState(
    orderCallStatus[0]
  );
  const [selectedOrderMedium, setSelectedOrderMedium] = useState(
    orderMedium[0]
  );

  // State to track when the API fetch updates
  const [reportFetchTrigger, setReportFetchTrigger] = useState(false);

  const getReportData = async (params) => {
    setLoading(true);
    try {
      const reportType = params?.reportType?.value;
      const reportId = params?.reportId?.value;
      const reportCall = params?.reportCall?.value;
      const orderStatus = params?.orderStatus?.value;
      const orderMedium = params?.orderMedium?.value;
      const memberClientId = params?.memberClientId?.value;

      if (reportType === "beet") {
        if (reportId === "member") {
          if (reportCall === "productive") {
            const resp =
              await getAllOrderByEachBeetByMemberIdByProductiveStatusApi(
                memberClientId,
                orderStatus
              );
            dispatch(setReportData(resp));
          } else if (reportCall === "order") {
            const resp = await getAllOrderByEachBeetByMemberIdByOrderMediumApi(
              memberClientId,
              orderMedium
            );
            dispatch(setReportData(resp));
          }
        } else if (reportId === "client") {
          if (reportCall === "productive") {
            const resp =
              await getAllOrderByEachBeetByClientFMCGIdByProductiveStatusApi(
                memberClientId,
                orderStatus
              );
            dispatch(setReportData(resp));
          } else if (reportCall === "order") {
            const resp =
              await getAllOrderByEachBeetByClientFMCGIdByOrderMediumApi(
                memberClientId,
                orderMedium
              );
            dispatch(setReportData(resp));
          }
        }
      } else if (reportType === "outlet") {
        if (reportId === "member") {
          if (reportCall === "productive") {
            const resp =
              await getAllOrderByEachOutletByMemberIdByProductiveStatusApi(
                memberClientId,
                orderStatus
              );
            dispatch(setReportData(resp));
          } else if (reportCall === "order") {
            const resp =
              await getAllOrderByEachOutletByMemberIdByOrderMediumApi(
                memberClientId,
                orderMedium
              );
            dispatch(setReportData(resp));
          }
        } else if (reportId === "client") {
          if (reportCall === "productive") {
            const resp =
              await getAllOrderByEachOutletByClientFMCGIdByProductiveStatusApi(
                memberClientId,
                orderStatus
              );
            dispatch(setReportData(resp));
          } else if (reportCall === "order") {
            const resp =
              await getAllOrderByEachOutletByClientFMCGIdByOrderMediumApi(
                memberClientId,
                orderMedium
              );
            dispatch(setReportData(resp));
          }
        }
      }

      // Trigger column update after data fetch
      setReportFetchTrigger((prev) => !prev);
    } catch (error) {
      console.error("Failed to fetch report data", error);
    }
    setLoading(false);
  };

  const columns = useMemo(() => {
    if (selectedReportTypeLevel?.value === "beet") {
      return [
        {
          name: "Beet",
          selector: (row) => row?.beetRespForOrderDto?.beet,
          sortable: true,
        },
        {
          name: "Address",
          selector: (row) => row?.beetRespForOrderDto?.address,
          sortable: true,
        },
        {
          name: "Postal Code",
          selector: (row) => row?.beetRespForOrderDto?.postalCode,
          sortable: true,
        },
        {
          name: "Total Sales",
          selector: (row) =>
            row?.totalSales ? `₹ ${Math.round(row.totalSales)}` : "NA",
          sortable: true,
        },
        {
          name: "Total Orders",
          selector: (row) => row?.totalOrder,
          sortable: true,
        },
      ];
    }

    return [
      {
        name: "Outlet Name",
        selector: (row) => row?.outletRespForOrderDto?.outletName,
        sortable: true,
      },
      {
        name: "Outlet Type",
        selector: (row) => row?.outletRespForOrderDto?.outletType,
        sortable: true,
      },
      {
        name: "Owner Name",
        selector: (row) => row?.outletRespForOrderDto?.ownerName,
        sortable: true,
      },
      {
        name: "Total Sales",
        selector: (row) =>
          row?.totalSales ? `₹ ${Math.round(row.totalSales)}` : "NA",
        sortable: true,
      },
      {
        name: "Total Orders",
        selector: (row) => row?.totalOrder,
        sortable: true,
      },
    ];
  }, [reportFetchTrigger]);

  return {
    selectedReportTypeLevel,
    selectedReportIdLevel,
    selectedReportCallLevel,
    selectedOrderStatus,
    selectedOrderMedium,
    setSelectedReportTypeLevel,
    setSelectedReportIdLevel,
    setSelectedReportCallLevel,
    setSelectedOrderStatus,
    setSelectedOrderMedium,
    getReportData,
    loading,
    columns,
  };
};

export default useAllOrdersReportHook;
