import { useEffect, useMemo, useState } from "react";
import { getDateFormat } from "../../../helper/date-functions";
import { formatStatus } from "../PrimarySales/sales-hook";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { getAllOrderByInvoiceNumber } from "../../../api/order/order-api";
import useSalesDetailInvoice from "./useSalesDetailInvoice";
import { useIsClient } from "../../../helper/isManager";
import { getOrderStatusStyle } from "../order-status-color";

export const useSaleDetails = () => {
  const [allSales, setAllSales] = useState([]);
  const [editOrderData, setEditOrderData] = useState(null);
  const isClient = useIsClient();
  const Cred = useSelector((state) => state.Cred);
  const [loading, setLoading] = useState(-1);
  const { state } = useLocation();
  const navigate = useNavigate();
  const [viewData, setViewData] = useState({
    loading: false,
    data: null,
    visible: false,
  });
  async function getCall() {
    setLoading(0);
    try {
      const resp = await getAllOrderByInvoiceNumber(
        state.invoiceNumber,
        Cred.token
      );
      setAllSales(resp);
    } catch (error) {
      Swal.fire({
        title: "Something went wrong!",
        text: "Can't Fetch Orders. Please try After Some Time",
        icon: "error",
      });
    }
    setLoading(-1);
  }

  const sales_col = useMemo(() => {
    const common_col = [
      {
        name: "Product",
        // selector: (row) =>
        //   `${row?.productRes?.name} (${row?.productRes?.sku})` || "No details",
        selector: (row) => (
          <span className={"text-wrap "}>
            {`${row?.productRes?.name} (${row?.productRes?.sku})` ||
              "No details"}
          </span>
        ),
        sortable: true,
        width: "200px",
      },
      {
        name: "Pre-GSt",
        selector: (row) => row.totalPrice?.toFixed(2) || 0,
        sortable: true,
      },
      {
        name: "GST",
        selector: (row) => (row.gstAmount || 0) + " %",
        sortable: true,
      },
      {
        name: "Post-GST",
        selector: (row) => row.totalPriceWithGst?.toFixed(2) || 0,
        sortable: true,
      },
      {
        name: "Bundle",
        selector: (row) => row.bundleType || "No details",
        sortable: true,
      },
      {
        name: "Quantity",
        selector: (row) =>
          row.bundleType === "Cases"
            ? row.quantity / (row.productRes.bundleSize ?? 0)
            : row.quantity,
        sortable: true,
      },
      {
        name: "Action",
        cell: (row) => {
          return (
            <div className="btn-group">
              {state?.isPrimary && (
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  disabled={row.status === "DELIVERED"}
                  onClick={() =>
                    row.status !== "DELIVERED" && setEditOrderData(row)
                  }
                >
                  <i className="icofont-edit text-success"></i>
                </button>
              )}
              <button
                type="button"
                onClick={() =>
                  setViewData({
                    data: row,
                    loading: true,
                    visible: true,
                  })
                }
                className="btn btn-outline-secondary"
              >
                <i className="icofont-eye text-primary size-1"></i>
              </button>
            </div>
          );
        },
        ignoreRowClick: true,
        allowOverflow: true,
        button: true,
      },
    ];

    if (state?.isPrimary) {
      common_col.splice(common_col.length - 1, 0, {
        name: "Status",
        selector: (row) => (
          <p
            onClick={() =>
              row.status === "PENDING" &&
              Swal.fire({
                icon: "info",
                title: "Remark",
                text: row.remarks ?? "N/A",
                confirmButtonText: "Ok",
                confirmButtonColor: "#3085d6",
              })
            }
            style={{
              ...getOrderStatusStyle(row.status),
              fontSize: 11,
              textDecorationLine: row.status === "PENDING" && "underline",
              cursor: row.status === "PENDING" ? "pointer" : "default",
              textAlign: "center",
              alignItems: "center",
              display: "flex",
              justifyContent: "center",
              margin: "0",
            }}
          >
            {row.status || "No details"}
          </p>
        ),
        sortable: true,
      });
    }

    return common_col;
  }, [allSales]);

  useEffect(() => {
    if (state === null) {
      navigate(-1);
    }
    getCall();
  }, []);

  const generateInvoice = useSalesDetailInvoice(allSales, state?.invoiceNumber);
  return {
    loading,
    allSales,
    editOrderData,
    setEditOrderData,
    sales_col,
    setAllSales,
    setViewData,
    viewData,
    invoiceNumber: state?.invoiceNumber ?? "",
    generateInvoice,
  };
};
