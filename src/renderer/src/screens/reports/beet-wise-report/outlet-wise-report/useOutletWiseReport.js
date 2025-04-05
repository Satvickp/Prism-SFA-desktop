import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { formatPriceINR } from "../../../../helper/exportFunction";
import { useIsFMCG } from "../../../../helper/isManager";

function fn_refine_outletData(data = []) {
  let outletWiseMap = new Map();

  data.forEach((ord) => {
    if (!outletWiseMap.has(ord.outletId)) {
      let cpy = { ...ord };
      delete cpy["product"];
      outletWiseMap.set(ord.outletId, {
        ...ord,
        totalOrders: 1,
        totalOrderValueWithoutGst: ord?.totalPrice ?? 0,
        totalOrderValueWithGst: ord?.totalOrderValueWithGst ?? 0,
        products: [ord.product],
      });
    } else {
      let outletMapData = outletWiseMap.get(ord.outletId);
      outletMapData = {
        ...outletMapData,
        totalOrderValueWithoutGst:
          (ord.totalPrice ?? 0) + outletMapData.totalOrderValueWithoutGst,
        totalOrders: outletMapData.totalOrders + 1,
        products: [...outletMapData.products, ord.product],
        totalOrderValueWithGst:
          ord.totalOrderValueWithGst + outletMapData.totalOrderValueWithGst,
      };
      outletWiseMap.set(ord.outletId, outletMapData);
    }
  });

  let returnArray = [];
  outletWiseMap.forEach((val, key) => {
    returnArray.push({
      ...val,
      id: key,
    });
  });

  return returnArray;
}

export const useOutletWiseReport = () => {
  const [loading, setLoading] = useState(false);
  const [allOutletWiseReport, setAllOutletWiseReport] = useState([]);
  const isFMCG = useIsFMCG();
  const { state } = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!state || !state?.outletWiseList) {
      navigate("/");
      return;
    }
    getCall();
  }, []);

  function getCall() {
    setLoading(true);
    try {
      let refineData = fn_refine_outletData(state.outletWiseList);
      setAllOutletWiseReport(refineData);
    } catch (error) {
      Swal.fire(
        "Something went wrong",
        error?.response?.data?.message ?? "Can't Fetch Necessary data"
      );
    }
    setLoading(false);
  }

  const columns = useMemo(() => {
    let template = [
      {
        name: (
          <span className="text-wrap">{`${
            isFMCG ? "Outlet" : "Chemist"
          } Name`}</span>
        ),
        selector: (row) => row.outletName,
      },
      {
        name: (
          <span className="text-wrap">{`${
            isFMCG ? "Outlet" : "Chemist"
          } Type`}</span>
        ),
        selector: (row) => row.outletType,
      },
      {
        name: "Owner Name",
        selector: (row) => row.ownerName,
      },

      {
        name: "Total Orders",
        selector: (row) => row.totalOrders,
      },
      {
        name: "Excl. GST",
        selector: (row) =>
          formatPriceINR(row.totalOrderValueWithoutGst?.toFixed(2) ?? 0),
      },
      {
        name: "Incl. GST",
        selector: (row) =>
          formatPriceINR(row.totalOrderValueWithGst?.toFixed(2) ?? 0),
      },
    ];

    return template;
  }, [allOutletWiseReport]);

  return {
    loading,
    allOutletWiseReport,
    columns,
    isFMCG,
    onRowClicked: (row) =>
      navigate("/outlet-order-report", {
        state: row,
      }),
  };
};
