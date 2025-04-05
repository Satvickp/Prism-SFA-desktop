import { useMemo, useState } from "react";
import { useProductList } from "../useProductList";
import { showError } from "../../../../../helper/exportFunction";
import { apiCreateTarget } from "../../../../../api/target";
import Swal from "sweetalert2";

export const MONTH_LIST = [
  { label: "January", value: 1 },
  { label: "February", value: 2 },
  { label: "March", value: 3 },
  { label: "April", value: 4 },
  { label: "May", value: 5 },
  { label: "June", value: 6 },
  { label: "July", value: 7 },
  { label: "August", value: 8 },
  { label: "September", value: 9 },
  { label: "October", value: 10 },
  { label: "November", value: 11 },
  { label: "December", value: 12} ,
];

export const convertToDateTarget = (month, year) => {
  let startDate = `${year}-${month.toString().padStart(2, '0')}-01T00:00:00.000Z`;
  let date = new Date(year, month, 0);
  let endDate = `${year}-${month.toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}T23:59:59.000Z`;
  return {
    startDate,
    endDate
  };
};


export const useAddTarget = (setVisible) => {
  const { loading: productLoader, productList } = useProductList();
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [productTargetQuantity, setProductTargetQuantity] = useState("");
  const [selectedYear, setSelectedYear] = useState(new Date());
  const [targetAmount, setTargetAmount] = useState("");
  const [addLoader, setAddLoader] = useState(false);
  const [selectedCity, setSelectedCity] = useState(null);


  const isButtonDisable = useMemo(() => {
    if (selectedCity === null) return true;
    if (selectedProduct === null) return true;
    if (selectedMonth === null) return true;
    if (isNaN(productTargetQuantity) || parseInt(productTargetQuantity) < 1)
      return true;
    if (isNaN(targetAmount) || parseInt(targetAmount) < 1) return true;
    return false;
  }, [selectedProduct, selectedMonth, productTargetQuantity, targetAmount]);

  async function handleAddTarget() {
    setAddLoader(true);
    try {
      console.log(selectedProduct);
      let targetDate = convertToDateTarget(selectedMonth.value, selectedYear.getFullYear());
      let payload = {
        startDate: targetDate.startDate,
        endDate: targetDate.endDate,
        targetAmount: parseInt(targetAmount),
        productId: selectedProduct.id,
        productTargetQuantity: parseInt(productTargetQuantity),
        cityId: selectedCity.value,
        productId: selectedProduct.value
      };
      await apiCreateTarget(payload);
      setVisible(false);
      Swal.fire({
        title: "Target Created",
        text: "Target is created successfully",
        icon: "success",
      });
    } catch (error) {
      setVisible(false)
      showError(error,()=>setVisible(true))
    }
    setAddLoader(false);
  }

  return {
    productList,
    productLoader,
    MONTH_LIST,
    selectedMonth,
    setSelectedMonth,
    setSelectedProduct,
    selectedProduct,
    productTargetQuantity,
    setProductTargetQuantity,
    targetAmount,
    setTargetAmount,
    selectedYear,
    setSelectedYear,
    isButtonDisable,
    handleAddTarget,
    selectedCity,
    setSelectedCity,
    addLoader
  };
};
