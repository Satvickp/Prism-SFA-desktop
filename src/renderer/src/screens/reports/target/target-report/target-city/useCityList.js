import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { showError } from "../../../../../helper/exportFunction";
import { apiGetAllCityByStateId } from "../../../../../api/city";

export const useCityList = () => {
  const [allCity, setAllCity] = useState();
  const [loading, setLoading] = useState(false);
  const { state: paramData } = useLocation();
  const [addTarget, setAddTarget] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getCityList();
  }, []);

  async function getCityList() {
    if (!paramData || !paramData?.stateId || !paramData?.stateName) {
      navigate(-1);
      return;
    }
    setLoading(true);
    try {
      const resp = await apiGetAllCityByStateId(paramData.stateId);
      setAllCity(resp.content.filter((city) => city.cityStatus === "ACTIVE"));
    } catch (error) {
      showError(error);
    }
    setLoading(false);
  }

  const columns = useMemo(() => {
    let col = [
      {
        name: "City Name",
        selector: (row) => row.cityName || "NA",
        sortable: true,
        cell: (row) => <span>{row.cityName || "NA"}</span>,
      },
      {
        name: "State Name",
        selector: (row) => row?.stateName || "NA",
        sortable: true,
        cell: (row) => <span>{row?.stateName || "NA"}</span>,
      },
    ];
    return col;
  }, [allCity]);

  return {
    allCity,
    loading,
    columns,
    addTarget,
    setAddTarget,
    navigate,
    paramData
  };
};
