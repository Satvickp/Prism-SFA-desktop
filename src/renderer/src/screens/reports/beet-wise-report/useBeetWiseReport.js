import { useSelector } from "react-redux";
import { useIsFMCG } from "../../../helper/isManager";
import { useIsSuperAdmin } from "../../../helper/isManager";
import { useEffect, useMemo, useState } from "react";
import { apiGetAllOrderBySalesLevelAndStartAndEndDate } from "../../../api/order/order-api";
import Swal from "sweetalert2";
import { getDateFormat } from "../../../helper/date-functions";
import { formatPriceINR } from "../../../helper/exportFunction";
import { exportToExcel } from "../beet-report/hook";
import { useNavigate } from "react-router-dom";
import { apiGetAllOrderBySalesLevelAndStartByMemberId } from "../../../api/order/order-api";

const fn_refine_beetWise = (data = []) => {
  let beetWiseMap = new Map();

  data.forEach(
    ({
      outletRespForOrderDto,
      beetRespForOrderDto,
      productRes,
      totalPrice,
      totalPriceWithGst,
      productId,
      bundleType,
      quantity,
    }) => {
      const beetData = beetRespForOrderDto;
      const outletData = outletRespForOrderDto;
      const productData = productRes;

      if (beetData && outletData && productData) {
        const { id, beet, address, city, state, postalCode } = beetData;
        const { id: outletId, outletName, outletType, ownerName } = outletData;
        const {
          name: productName,
          sku,
          imageUrl,
          productPriceRes: { stockListPrice },
          bundleSize,
        } = productData;

        const quantityAdjusted =
          bundleType == "Cases"
            ? (quantity ?? 0) / (bundleSize ?? 1)
            : quantity;
        if (!beetWiseMap.has(id)) {
          beetWiseMap.set(id, {
            beetName: beet,
            beetAddress: address,
            beetCity: city,
            beetState: state,
            beetPostalCode: postalCode,
            totalOrders: 1,
            totalOrderValueWithoutGst: totalPrice ?? 0,
            totalOrderValueWithGst: totalPriceWithGst ?? 0,
            outletWiseList: [
              {
                outletId,
                outletName,
                outletType,
                ownerName,
                totalPrice: totalPrice ?? 0,
                totalOrderValueWithGst: totalPriceWithGst ?? 0,
                product: {
                  productId,
                  productName,
                  sku,
                  quantity: quantityAdjusted,
                  productImage: imageUrl,
                  bundleType,
                  pricePerUnit: stockListPrice ?? 0,
                  unitQuantity:
                    bundleType == "Cases"
                      ? quantityAdjusted * bundleSize ?? 0
                      : quantity,
                },
              },
            ],
          });
        } else {
          let mapBeet = beetWiseMap.get(id);
          beetWiseMap.set(id, {
            ...mapBeet,
            totalOrderValueWithoutGst:
              (totalPrice ?? 0) + mapBeet.totalOrderValueWithoutGst,
            totalOrderValueWithGst:
              (totalPriceWithGst ?? 0) + mapBeet.totalOrderValueWithGst,
            totalOrders: mapBeet.totalOrders + 1,
            outletWiseList: [
              ...mapBeet.outletWiseList,
              {
                outletId,
                outletName,
                outletType,
                ownerName,
                totalPrice: totalPrice ?? 0,
                totalOrderValueWithGst: totalPriceWithGst ?? 0,
                product: {
                  productId,
                  productName,
                  sku,
                  quantity: quantityAdjusted,
                  productImage: imageUrl,
                  bundleType,
                  pricePerUnit: stockListPrice ?? 0,
                  unitQuantity:
                    bundleType == "Cases"
                      ? quantityAdjusted * bundleSize ?? 0
                      : quantity,
                },
              },
            ],
          });
        }
      }
    }
  );

  return Array.from(beetWiseMap.entries()).map(([id, val]) => ({ ...val, id }));
};

const fn_extract_unique_state = (data = []) => {
  let uniqueState = new Map();
  data.forEach((beet) => {
    if (!uniqueState.has(beet.beetState)) {
      uniqueState.set(beet.beetState, "--");
    }
  });

  let returnArray = [];
  uniqueState.forEach((val, key) => {
    returnArray.push({
      label: key,
      value: key,
    });
  });
  return returnArray;
};

const fn_extract_unique_city = (data = []) => {
  let uniqueState = new Map();
  data.forEach((beet) => {
    if (!uniqueState.has(beet.beetCity)) {
      uniqueState.set(beet.beetCity, beet.beetState);
    }
  });

  let returnArray = [];
  uniqueState.forEach((val, key) => {
    returnArray.push({
      label: key,
      value: key,
    });
  });
  return returnArray;
};
export const useBeetWiseReport = () => {
  const isFMCG = useIsFMCG();
  const superAdmin = useIsSuperAdmin();
  const Cred = useSelector((state) => state.Cred);
  const [allBeetWiseReport, setAllBeetWiseReport] = useState([]);
  const [fetchReportProgress, setFetchReportProgress] = useState(true);
  const navigate = useNavigate();
  const [allUniqueStateList, setAllUniqueStateList] = useState([]);
  const [allUniqueCityList, setAllUniqueCityList] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);
  const [selectedCities, setSelectedCities] = useState([]);
  async function helperCall(startDate, endDate) {
    setFetchReportProgress(true);
    try {
      let resp;
      if (superAdmin || isFMCG) {
        resp = await apiGetAllOrderBySalesLevelAndStartAndEndDate(
          "STOCKIST",
          startDate,
          endDate
        );
      } else {
        resp = await apiGetAllOrderBySalesLevelAndStartByMemberId(
          "STOCKIST",
          startDate,
          endDate,
          Cred.id
        );
      }

      if (resp.length > 0) {
        let refineBeetWiseData = fn_refine_beetWise(resp);
        let uniqueStateList = fn_extract_unique_state(refineBeetWiseData);
        let uniqueCityList = fn_extract_unique_city(refineBeetWiseData);

        setAllUniqueStateList(uniqueStateList);
        setAllUniqueCityList(uniqueCityList);
        setAllBeetWiseReport(refineBeetWiseData);
      }
    } catch (error) {
      console.log(error);
      Swal.fire(
        "Something went wrong",
        error?.response?.data?.message ?? "Can't Fetch Necessary data"
      );
    }
    setFetchReportProgress(false);
  }

  useEffect(() => {
    // if (!allBeetWiseReport.length > 0) {
      let startDate = new Date();
      startDate.setDate(1);
      let endDate = new Date();
      endDate.setDate(30);

      helperCall(
        getDateFormat(startDate).concat("T00:00:00.000Z"),
        getDateFormat(endDate).concat("T00:00:00.000Z")
      );
    // }
  }, [allBeetWiseReport]);

  const columns = useMemo(() => {
    let template = [
      {
        name: "State",
        selector: (row) => row.beetState,
        sortable: true, 
      },
      {
        name: "City",
        selector: (row) => row.beetCity,
        sortable: true,
      },
      {
        name: <span title="Postal Code">Postal Code</span>,
        selector: (row) => row.beetPostalCode,
        sortable: true,
      },
      {
        name: (
          <span title={`${isFMCG ? "Beet" : "Route"} Name`}>
            {isFMCG ? "Beet" : "Route"} Name
          </span>
        ),
        selector: (row) => row.beetName,
        sortable: true,
      },
      {
        name: "Total Orders",
        selector: (row) => row.totalOrders,
        sortable: true,
        width:"130px"
      },
      {
        name: "Excl. GST",
        selector: (row) =>
          formatPriceINR(row.totalOrderValueWithoutGst?.toFixed(2) ?? 0),
        sortable: true,
      },
      {
        name: "Incl. GST",
        selector: (row) =>
          formatPriceINR(row.totalOrderValueWithGst?.toFixed(2) ?? 0),
        sortable: true,
      },
      {
        name: (
          <span title={`${isFMCG ? "Beet" : "Route"} Address`}>
            {isFMCG ? "Beet" : "Route"} Address
          </span>
        ),
        selector: (row) => row.beetAddress,
      },
    ];

    return template;
  }, [allBeetWiseReport]);

  const filterBeetWiseReport = useMemo(() => {
    if (selectedCities.length > 0) {
      return allBeetWiseReport.filter((beet) =>
        selectedCities.includes(beet.beetCity)
      );
    } else if (selectedStates.length > 0) {
      return allBeetWiseReport.filter((beet) =>
        selectedStates.includes(beet.beetState)
      );
    } else {
      return allBeetWiseReport;
    }
  }, [allBeetWiseReport, selectedCities, selectedStates]);

  return {
    isFMCG,
    fetchReportProgress,
    filterBeetWiseReport,
    columns,
    helperCall,
    exportToExcelFn: () =>
      exportToExcel(
        allBeetWiseReport,
        columns,
        `${isFMCG ? "Beet" : "Route"} wise report`,
        `${isFMCG ? "Beet" : "Route"}_wise_Report.xlsx`
      ),
    allUniqueCityList,
    allUniqueStateList,
    selectedStates,
    selectedCities,
    setSelectedStates,
    setSelectedCities,
    onRowClicked: (row) =>
      navigate("/outlet-wise-report", {
        state: row,
      }),
  };
};
