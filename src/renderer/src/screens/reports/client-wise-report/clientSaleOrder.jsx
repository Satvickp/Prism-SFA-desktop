import React, { useEffect, useState } from "react";
import PageHeader from "../../../components/common/PageHeader";
import FilterComponent from "./FilterComponent";
import DataTable from "react-data-table-component";
import * as XLSX from "xlsx";
import useClientWiseReportHook from "./useClientWiseReportHook";
import { IoChevronBackCircle } from "react-icons/io5";
import { useNavigate, useParams } from "react-router-dom";
import Swal from "sweetalert2";
import ProductDetailsModal from "./ProductOrderDetails";
import { CLIENT_TYPE } from "../../../components/Data/ClientFMCGMemberMenu";
import { customStyles } from "../../../constants/customStyles";
import { getDateFormat } from "../../../helper/date-functions";
function ClientSaleOrder() {
  const {
    filterDateRange,
    loading,
    allData,
    salesLevel,
    setFilteredDateRange,
    setSalesLevel,
    selectedClient,
    getSalesData,
    startDate,
    endDate,
    columns,
  } = useClientWiseReportHook();
  const navigate = useNavigate();
  const { userId } = useParams();

  const [modalShow, setModalShow] = useState(false);
  const [rowData, setRowData] = useState([]);

  const exportToExcel = () => {
    if (allData.length <= 0) {
      Swal.fire({
        title: "Warning",
        text: "No Data available to export",
        icon: "warning",
        timer: 2000,
      });
      return;
    }
    const wsData = [
      ["Invoice Number", "Order Date", "Quantity", "Price", "GST Amount"], // Header Row
      ...allData?.map((row) => [
        row.invoiceNumber,
        row.orderCreatedDate,
        row.quantity,
        row.totalPrice,
        row.totalPriceWithGst,
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
    XLSX.utils.book_append_sheet(wb, ws, `${allData[0].clientName} Sales Data`);
    XLSX.writeFile(wb, "sales_data_formatted.xlsx");
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

  return (
    <div className="container-xxl" style={{ position: "relative", zIndex: 40 }}>
      <PageHeader
        headerTitle={`${CLIENT_TYPE === "FMCG" ? "Client" : "Stockist"} Sales ( ${getDateFormat(startDate)} - ${getDateFormat(endDate)} )`}
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
            <FilterComponent
              exportToExcel={exportToExcel}
              selectedSalesLevel={salesLevel}
              setSelectedSalesLevel={setSalesLevel}
              dateRange={filterDateRange}
              setDateRange={setFilteredDateRange}
            />
          );
        }}
      />

      <DataTable
        title="Sales Data"
        columns={columns}
        data={allData}
        responsive
        pagination
        progressPending={loading}
        onRowClicked={(data) => {
          // setModalShow(true);
          setRowData(data);
          console.log(data)
          navigate(`/product-order-details/${userId}/${data.invoiceNumber}`);
        }}
        highlightOnHover
        customStyles={{
          ...customStyles,
          rows: {
            style: {
              cursor: "pointer",
            },
          },
        }}
      />

      {/* <ProductDetailsModal
        orderData={allData}
        data={rowData}
        show={modalShow}
        onHide={() => setModalShow(false)}
      /> */}
    </div>
  );
}

export default ClientSaleOrder;
