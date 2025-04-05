import { useEffect, useMemo, useState } from "react";
import { showError } from "../../../../../helper/exportFunction";
import { apiGetAllState } from "../../../../../api/state-controller";
import { useNavigate } from "react-router-dom";

export const useStateList = () => {
  const [stateList, setStateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    getState();
  }, []);

  async function getState() {
    if (stateList.length > 0) return;
    setLoading(true);
    try {
      const resp = await apiGetAllState();
      setStateList(resp.content);
    } catch (error) {
      showError(error);
    }
    setLoading(false);
  }

  const columns = useMemo(() => {
    let col = [
      {
        name: "State Name",
        selector: (row) => row.stateName || "NA",
        sortable: true,
        cell: (row) => <span>{row.stateName || "NA"}</span>,
      },
      {
        name: "Region Name",
        selector: (row) => row?.regionEntity?.regionName || "NA",
        sortable: true,
        cell: (row) => <span>{row?.regionEntity?.regionName || "NA"}</span>,
      },
    ];
    return col;
  }, [stateList]);

  return {
    loading,
    stateList,
    columns,
    navigate
  };
};
