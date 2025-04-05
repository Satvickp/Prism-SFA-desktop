import { useEffect, useMemo, useState } from "react";
import {
  getSalesReportApi,
  getSalesReportByClientFMCGIdApi,
} from "../../../api/reports";
import { SalesLevelOptions } from "./FilterComponent";
import axios from "axios";
import { API_URL } from "../../../constants/api-url";
import { useSelector } from "react-redux";
import { useIsSuperAdmin } from "../../../helper/isManager";

const useClientWiseReportHook = () => {
  const [allData, setAllData] = useState([]);
  const Cred = useSelector((state) => state.Cred);
  const [selectedState, setSelectedState] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const [loading, setLoading] = useState(false);
  const [clientData, setClientData] = useState([]);
  const isSuperAdmin = useIsSuperAdmin();
  const currentDate = new Date();
  const endDate = new Date(currentDate);
  const startDate = new Date(currentDate);
  startDate.setMonth(currentDate.getMonth() - 1);
  // endDate.setMonth(currentDate.getMonth() + 1);
  const [filterDateRange, setFilteredDateRange] = useState({
    startDate: startDate,
    endDate: currentDate,
    key: "selection",
  });
  const [salesLevel, setSalesLevel] = useState(SalesLevelOptions[0]);

  async function getAllFMCGClientByCityId() {
    setLoading(true);
    try {
      const url = isSuperAdmin
        ? API_URL.backend_url +
          "client-fmcg/getAllClientFmcgByCityId/" +
          selectedCity?.value
        :  API_URL.backend_url +
        "client-fmcg/getAllClientFmcgByCityIdAndMemberId/" +
        selectedCity?.value +
        "/" +
        Cred.sub;

      const resp = await axios.get(url, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + Cred.token,
        },
      });
      setClientData(resp.data);
    } catch (error) {
      console.log("Error fetching Client :", error);
    }
    setLoading(false);
  }

  useEffect(() => {
    if (selectedCity?.value || false) {
      getAllFMCGClientByCityId();
    }
  }, [selectedCity]);

  async function getSalesData(params) {
    setLoading(true);
    try {
      const resp = await getSalesReportByClientFMCGIdApi(params);
      const orderData = groupOrdersByInvoice(resp);
      setAllData(orderData);
    } catch (error) {
      console.log("Error fetching client sales data::", error);
    }
    setLoading(false);
  }

  const columns = useMemo(() => {
    let def = [
      {
        name: "INVOICE NUMBER",
        selector: (row) => row.invoiceNumber,
        sortable: true,
      },
      {
        name: "ORDER DATE",
        selector: (row) => row.orderCreatedDate,
        sortable: true,
        // format: (row) => row.orderCreatedDate,
      },
      {
        name: "TOTAL QUANTITY",
        selector: (row) => row.quantity,
        sortable: true,
      },
      {
        name: "TOTAL PRICE",
        selector: (row) => "₹ " + row.totalPrice,
        sortable: true,
      },
      {
        name: "TOTAL PRICE (GST)",
        selector: (row) => "₹ " + row.totalPriceWithGst,
        sortable: true,
      },
    ];

    return def;
  }, [allData]);

  function groupOrdersByInvoice(orders) {
    const invoiceMap = new Map();

    orders.forEach((order) => {
      const {
        invoiceNumber,
        totalPrice,
        totalPriceWithGst,
        productRes,
        quantity,
        orderCreatedDate,
      } = order;

      if (!invoiceMap.has(invoiceNumber)) {
        invoiceMap.set(invoiceNumber, {
          invoiceNumber,
          totalPrice: 0,
          totalPriceWithGst: 0,
          quantity: 0,
          orderCreatedDate,
          orders: [],
          productList: [],
        });
      }

      const invoiceData = invoiceMap.get(invoiceNumber);
      invoiceData.totalPrice += totalPrice || 0;
      invoiceData.totalPriceWithGst += totalPriceWithGst || 0;
      invoiceData.quantity += quantity || 0; // Add quantity safely
      invoiceData.orders.push(order);
      invoiceData.productList.push(productRes);
    });

    return Array.from(invoiceMap.values());
  }

  return {
    getSalesData,
    loading,
    filterDateRange,
    setFilteredDateRange,
    salesLevel,
    setSalesLevel,
    endDate,
    startDate,
    allData,
    columns,
    selectedState,
    setSelectedCity,
    selectedCity,
    setSelectedState,
    setClientData,
    clientData,
    getAllFMCGClientByCityId,
  };
};

export default useClientWiseReportHook;
