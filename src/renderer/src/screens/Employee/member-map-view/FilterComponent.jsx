import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { getAllState } from "../../../api/member/member-api";
import Swal from "sweetalert2";
import { getCity } from "../../../api/clients/clients-api";
function FilterComponent({ loading, onSubmit }) {
  const Cred = useSelector((state) => state.Cred);
  const [selectedCity, setSelectedCity] = useState();
  const [selectedState, setSelectedState] = useState();
  const [allState, setAllState] = useState([]);
  const [allCity, setAllCity] = useState([]);

  async function getState() {
    try {
      const resp = await getAllState(Cred.token);
      setAllState(resp);
    } catch (error) {
      Swal.fire({
        title: "Something Went Wrong, Can't Fetch State",
        text: error?.response?.data?.message ?? "Please Try Again",
        icon: "warning",
      });
    }
  }

  useEffect(() => {
    getState();
  }, []);

  async function getCityByState(stateId) {
    try {
      const resp = await getCity(Cred.token,stateId);
      setAllCity(resp);
    } catch (error) {
      Swal.fire({
        title: "Something Went Wrong, Can't Fetch City",
        text: error?.response?.data?.message ?? "Please Try Again",
        icon: "warning",
      });
    }
  }

  return (
    <div className="mb-3 ml-10 d-flex gap-3 align-items-center">
      <Select
        options={allState?.map((e) => ({
          label: e.stateName,
          value: e.id,
        }))}
        placeholder="Select State"
        onChange={(e) => {
          setSelectedState(e);
          setAllCity([])
          getCityByState(e.value);
        }}
        value={selectedState}
        noOptionsMessage={() => "Not found"}
        name=""
      />
      <Select
        options={allCity?.map((e) => ({
          label: e.cityName,
          value: e.id,
        }))}
        placeholder="Select City"
        onChange={(e) => setSelectedCity(e)}
        value={selectedCity}
        noOptionsMessage={() => "Not found"}
        name=""
      />
      <Button
        onClick={() => {
          if (loading || !selectedCity) return;
          onSubmit?.(selectedCity);
        }}
        className="d-flex gap-2 align-items-center"
        disabled={loading}
      >
        Apply
        {loading && <Spinner size="sm" color="white" />}
      </Button>
    </div>
  );
}

export default FilterComponent;
