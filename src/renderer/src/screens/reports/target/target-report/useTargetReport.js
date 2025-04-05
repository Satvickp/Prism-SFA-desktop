import { useEffect, useMemo, useState } from "react";
import { useLocation } from "react-router-dom";
import { showError } from "../../../../helper/exportFunction";
import { apiGetAllTargetByCityAndDate } from "../../../../api/target";
import { convertToDateTarget } from "./add-form/useAddTarget";

export const handleNAValue = (value) => value ?? "N/A";
export const useTargetReport = () => {
  const [allTarget, setAllTarget] = useState([]);
  const [loading, setLoading] = useState(false);
  const { state: paramState } = useLocation();

  async function helperCall(startDate, endDate) {
    setLoading(true);
    try {
      const resp = await apiGetAllTargetByCityAndDate(
        startDate,
        endDate,
        paramState.cityId
      );
      setAllTarget(resp);
    } catch (error) {
      showError(error);
    }
    setLoading(false);
  }

  const cols = useMemo(() => {
    let cols = [
      {
        name: "City",
        selector: (row) => handleNAValue(row.cityName),
      },
      {
        name: "Product",
        selector: (row) => handleNAValue(row.productName),
      },
      {
        name: "SKU",
        selector: (row) => handleNAValue(row.productSku),
      },
      {
        name: "Target Product Quantity",
        selector: (row) => handleNAValue(row.productTargetQuantity),
      },
      {
        name: "Target Amount",
        selector: (row) => handleNAValue(row.targetAmount),
      },
    ];
    return cols;
  }, [allTarget]);

  useEffect(() => {
    let currentDate = new Date();
    const dateObj = convertToDateTarget(
      currentDate.getMonth() + 1,
      currentDate.getFullYear()
    );
    helperCall(dateObj.startDate, dateObj.endDate);
  }, []);

  return {
    cols,
    helperCall,
  };
};
