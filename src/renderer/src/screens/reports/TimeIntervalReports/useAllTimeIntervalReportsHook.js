import { useEffect, useState } from "react";
import {
  getBeetOrderReportByMemberIdApi,
  getBeetOrderReportByReportingManagerApi,
  getOutletOrderReportApi,
} from "../../../api/reports";
import { useDispatch, useSelector } from "react-redux";
import { setReportData } from "../../../redux/features/reportSlice";

const useAllTimeIntervalReportsHook = () => {
  const dispatch = useDispatch();
  const allData = useSelector((state) => state.Reports?.content);
  const [loading, setLoading] = useState(false);

  const [selectedReportTypeLevel, setSelectedReportTypeLevel] = useState(null);
  const [selectedReportIdLevel, setSelectedReportIdLevel] = useState("member");
  const [selectedMemberClientId, setSelectedMemberClientId] = useState(null);
  const [columns, setColumns] = useState([]); // Maintain columns in state

  const currentDate = new Date();
  const endDate = new Date(currentDate);
  endDate.setMonth(currentDate.getMonth() + 1);
  const [filterDateRange, setFilteredDateRange] = useState({
    startDate: currentDate,
    endDate: endDate,
    key: "selection",
  });

  const getReportData = async (params) => {
    setLoading(true);
    try {
      const reportType = params?.reportType?.value;
      const memberClientId = params?.memberClientId?.value;

      let response;

      if (reportType === "beet") {
        response = await getBeetOrderReportByMemberIdApi({
          startDate: filterDateRange.startDate,
          endDate: filterDateRange.endDate,
          memberId: memberClientId,
        });
        setColumns([
          {
            name: "Beet",
            selector: (row) => row.beetRespForOrderDto?.beet || "N/A",
            sortable: true,
          },
          {
            name: "Address",
            selector: (row) => row.beetRespForOrderDto?.address || "N/A",
            sortable: true,
          },
          {
            name: "Postal Code",
            selector: (row) => row.beetRespForOrderDto?.postalCode || "N/A",
            sortable: true,
          },
          {
            name: "Total Sales",
            selector: (row) =>
              row.totalSales ? Math.round(row.totalSales) : "NA",
            sortable: true,
          },
          {
            name: "Total Orders",
            selector: (row) => row.totalOrder || 0,
            sortable: true,
          },
        ]);
      } else if (reportType === "outlet") {
        response = await getOutletOrderReportApi({
          startDate: filterDateRange.startDate,
          endDate: filterDateRange.endDate,
          beetId: memberClientId,
        });
        setColumns([
          {
            name: "Outlet Name",
            selector: (row) =>
              row.outletRespForOrderDto?.outletName || "N/A",
            sortable: true,
          },
          {
            name: "Outlet Type",
            selector: (row) =>
              row.outletRespForOrderDto?.outletType || "N/A",
            sortable: true,
          },
          {
            name: "Owner Name",
            selector: (row) =>
              row.outletRespForOrderDto?.ownerName || "N/A",
            sortable: true,
          },
          {
            name: "Total Sales",
            selector: (row) =>
              row.totalSales ? Math.round(row.totalSales) : "NA",
            sortable: true,
          },
          {
            name: "Total Orders",
            selector: (row) => row.totalOrder || 0,
            sortable: true,
          },
        ]);
      }

      if (response) {
        dispatch(
          setReportData({
            totalElements: response.totalElements || 0,
            totalPages: response.totalPages || 0,
            page: response.page || 0,
            content: response.content || [],
          })
        );
      }
    } catch (error) {
      console.error("Failed to fetch report data", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    selectedReportTypeLevel,
    selectedReportIdLevel,
    selectedMemberClientId,
    setSelectedReportTypeLevel,
    setSelectedReportIdLevel,
    setSelectedMemberClientId,
    getReportData,
    loading,
    allData,
    columns,
    filterDateRange,
    setFilteredDateRange,
  };
};

export default useAllTimeIntervalReportsHook;
