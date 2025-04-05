import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { formatPriceINR } from "../../../../helper/exportFunction";

export const useOutletOrderReport = () => {
  const { state } = useLocation();
  const [loading, setLoading] = useState(true);
  const [allOutletOrderData, setAllOutletOrderData] = useState([]);
  const navigate = useNavigate();
  const [outletInfo, setOutletInfo] = useState({});

  function getCall() {
    setLoading(true);
    setAllOutletOrderData(state.products);
    setOutletInfo(state);
    setLoading(false);
  }

  useEffect(() => {
    if (!state || !state?.products) {
      navigate("/");
      return;
    }
    getCall();
  }, []);

  const columns = useMemo(() => {
    let template = [
      {
        name: "Image",
        selector: (row) => row?.productImage,
        cell: (row) => (
          <img
            src={row?.productImage}
            alt={row.name}
            style={{
              width: 25,
              height: 25,
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ),
        sortable: false,
        width: "150px",
      },
      {
        name: "Product Name",
        selector: (row) => row.productName,
        sortable: true,
        // maxWidth: "300px",
      },
      {
        name: "SKU",
        selector: (row) => row.sku,
        sortable: true,
      },
      {
        name: "Quantity",
        selector: (row) => row.quantity,
        sortable: true,
        width:"120px"
      },
      {
        name: "Bundle Type",
        selector: (row) => row.bundleType,
        // width: "150px",
      },
      {
        name: "Price",
        selector: (row) => {
          console.log(row);
          return formatPriceINR(row.pricePerUnit * row.unitQuantity);
        },
        // width: "150px",
      },
    ];

    return template;
  }, [allOutletOrderData]);

  return {
    allOutletOrderData,
    loading,
    outletInfo,
    columns,
  };
};
