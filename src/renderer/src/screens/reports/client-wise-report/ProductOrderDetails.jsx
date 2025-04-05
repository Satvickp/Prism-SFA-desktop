import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/common/PageHeader";
import FilterComponent from "./FilterComponent";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import useClientWiseReportHook from "./useClientWiseReportHook";
import { IoChevronBackCircle } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import { getDateFormat } from "../../../helper/date-functions";
import { Button } from "react-bootstrap";
function ProductOrderDetails() {
  const {
    filterDateRange,
    allData,
    salesLevel,
    getSalesData,
    startDate,
    endDate,
  } = useClientWiseReportHook();
  const navigate = useNavigate();
  const { userId, dataId } = useParams();
  const [rowData, setRowData] = useState([]);

  const exportToExcel = () => {

    const ProductData = allData?.find((e) => e.invoiceNumber === dataId)?.orders || []

    console.log("Product Data :",ProductData)
    if (ProductData.length <= 0) {
      Swal.fire({
        title: "Warning",
        text: "No Data available to export",
        icon: "warning",
        timer: 2000,
      });
      return;
    }
    const wsData = [
      ["Invoice Number", "Product Name", "Product SKU", "Bundle Size", "Quantity", "Price", "Price (GST Amount)"], // Header Row
      ...ProductData?.map((row) => [
        row?.productRes?.name || "NA",
        row?.productRes?.sku || "NA",
        row?.productRes?.bundleSize || "NA",
        row?.quantity || "NA",
        row?.totalPrice || "NA",
        row?.totalPriceWithGst || "NA",
      ]),
    ];

    const ws = XLSX.utils.aoa_to_sheet(wsData);

    ws["!cols"] = [
      { width: 15 },
      { width: 30 },
      { width: 18 },
      { width: 18, numFmt: '"$"#,##0.00' },
      { width: 18, numFmt: '"$"#,##0.00' },
    ];

    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, `${ProductData[0]?.clientName || ""}'s order ${dataId}`);
    XLSX.writeFile(wb, "order_product.xlsx");
  };

  useEffect(() => {
    if (
      filterDateRange.endDate &&
      filterDateRange.endDate &&
      salesLevel.value
    ) {
      getSalesData({
        startDate: filterDateRange.startDate,
        endDate: filterDateRange.endDate,
        salesLevel: salesLevel.value,
        clientId: userId,
      });
    }
  }, [filterDateRange, salesLevel]);

  const productDetailsColumns = [
    {
      name: "PRODUCT",
      cell: (row) => (
        <img
          src={row?.productRes?.imageUrl}
          alt="product-image"
          height="50"
          width="50"
          style={{ objectFit: "contain" }}
        />
      ),
      sortable: false,
    },
    {
      name: "NAME",
      selector: (row) => row?.productRes?.name,
      sortable: true,
    },
    {
      name: "PRODUCT SKU",
      selector: (row) => row?.productRes?.sku,
      sortable: true,
    },
    {
      name: "BUNDLE SIZE",
      selector: (row) => row?.productRes?.bundleSize,
      sortable: true,
    },
    {
      name: "QUANTITY",
      selector: (row) => row?.quantity,
      sortable: true,
    },
    {
      name: "PRICE",
      selector: (row) => `₹ ${row.totalPrice}`,
      sortable: true,
    },
    {
      name: "PRICE (GST)",
      selector: (row) => `₹ ${row.totalPriceWithGst}`,
      sortable: true,
    },
  ];

  return (
    <div className="container-xxl" style={{ position: "relative", zIndex: 40 }}>
      <PageHeader
        headerTitle={`Order Product Details - ${dataId}`}
        renderLeft={() => (
          <IoChevronBackCircle
            size={28}
            color="#484c7f"
            style={{ marginBottom: "-10px" }}
            onClick={() => navigate(-1)}
          />
        )}
        renderRight={() => {
          return (
            <Button onClick={exportToExcel} className="me-2">Export To Excel</Button>
          );
        }}
      />

      <DataTable
        title="Sale Product Details"
        columns={productDetailsColumns}
        data={allData?.find((e) => e.invoiceNumber === dataId)?.orders || []}
        responsive
        pagination
      />
    </div>
  );
}

export default ProductOrderDetails;
