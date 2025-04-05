import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Swal from "sweetalert2";
import {
  getAllOrderByFMCGClientAndSales,
  getAllOrderByReportingManager,
} from "../../../api/order/order-api";
import {
  dispatchPrimarySalePaginatedOrder,
  dispatchPrimarySaleSetOrder,
} from "../../../redux/features/order/primary-sale";
import {
  dispatchSecondarySalePaginatedOrder,
  dispatchSecondarySaleSetOrder,
} from "../../../redux/features/order/secondary-sale";
import { getDateFormat } from "../../../helper/date-functions";
import { useIsClient } from "../../../helper/isManager";
import { useNavigate } from "react-router-dom";
import { getOrderStatusStyle } from "../order-status-color";
import { useMemberHook } from "../../../hooks/memberHook";

export const useSalesHook = (isPrimary) => {
  const [loading, setLoading] = useState(-1);
  const dispatch = useDispatch();
  const Sales = useSelector(
    (state) => state[isPrimary ? "PrimarySales" : "SecondarySales"]
  );
  const Cred = useSelector((state) => state.Cred);
  const isClient = useIsClient();
  const navigate = useNavigate();
  async function helperFunctionSales(page) {
    // if (Sales.content.length > 0 && page == 0) return;
    setLoading(page == 0 ? 1 : 0);
    try {
      const resp = await (isClient
        ? getAllOrderByFMCGClientAndSales(
            page,
            10,
            Cred.id,
            isPrimary ? "WAREHOUSE" : "STOCKIST",
            Cred.token
          )
        : getAllOrderByReportingManager(
            page,
            10,
            Cred.sub,
            isPrimary ? "WAREHOUSE" : "STOCKIST",
            Cred.token,
            true
          ));

      if (isPrimary) {
        dispatch(
          page === 0
            ? dispatchPrimarySaleSetOrder(resp)
            : dispatchPrimarySalePaginatedOrder(resp)
        );
      } else {
        dispatch(
          page === 0
            ? dispatchSecondarySaleSetOrder(resp)
            : dispatchSecondarySalePaginatedOrder(resp)
        );
      }
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Orders. Please try After Some Time",
        icon: "error",
      });
    }
    setLoading(-1);
  }

  const { get } = useMemberHook();
  useEffect(() => {
    if (!isClient) {
      get();
    }
  }, [isClient]);

  useEffect(() => {
    helperFunctionSales(0);
  }, []);

  const handleFilterChange = () => {
    // Swal.fire('Filter Applied','Waiting For Stuff Do','info')
  };

  const uniqueSaleRecords = useMemo(() => {
    return Sales.content;
  }, [Sales]);

  const sales_col = useMemo(() => {
    const common_cols = [
      {
        name: "Member",
        selector: (row) =>
          row?.orderResponseList?.[0]?.memberName || "No details",
        sortable: true,
      },
      {
        name: "Date",
        selector: (row) =>
          row?.orderResponseList?.[0]?.orderCreatedDate
            ? getDateFormat(row?.orderResponseList?.[0]?.orderCreatedDate)
            : "No details",
        sortable: true,
      },
      {
        name: "No of Products",
        selector: (row) => (
          <span className={"text-wrap"}>
            {row?.orderResponseList?.length || "No details"}{" "}
          </span>
        ),

        // selector: (row) => row?.orderResponseList?.length || "No details",
        sortable: true,
      },
    ];

    if (!isPrimary) {
      common_cols.splice(0, 0, {
        name: "Status",
        selector: (row) => (
          <strong
            style={getOrderStatusStyle(row?.orderResponseList?.[0]?.status)}
          >
            {formatStatus(row?.orderResponseList?.[0]?.status) || "No details"}
          </strong>
        ),
        sortable: true,
      });
    }

    if (!isClient) {
      common_cols.splice(0, 0, {
        name: "Client",
        selector: (row) =>
          row?.orderResponseList?.[0]?.clientName || "No details",
        sortable: true,
      });
    }
    common_cols.splice(0, 0, {
      name: "Invoice",
      selector: (row) => (
        <strong
          onClick={() =>
            navigate("/sale-detail", {
              state: {
                invoiceNumber: row.invoiceNumber,
                isPrimary: isPrimary,
              },
            })
          }
          className="text-primary"
          style={{
            textDecorationLine: "underline",
            cursor: "pointer",
          }}
        >
          {row.invoiceNumber || "No details"}
        </strong>
      ),
      sortable: true,
    });

    return common_cols;
  }, uniqueSaleRecords);

  return {
    uniqueSaleRecords,
    helperFunctionSales,
    loading,
    sales_col,
    handleFilterChange,
    Sales,
    isClient,
  };
};

export function formatStatus(status) {
  if (!status) return "";
  return status
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
}
