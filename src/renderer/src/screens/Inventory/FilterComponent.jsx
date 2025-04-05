import React, { useEffect, useState } from "react";
import { Button, Spinner } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Select from "react-select";
import { getAllState } from "../../api/member/member-api";
import Swal from "sweetalert2";
import { getCity } from "../../api/clients/clients-api";
import {
  getAllClientFmcgByCityIdAndMemberId,
  getAllClientsByCityId,
  getAllClientsByMemberIdAndCityId,
} from "../../api/clients/clientfmcg-api";
import "./index.css";
import { useIsManager, useIsSuperAdmin } from "../../helper/isManager";
function FilterComponent({ loading, onSubmit }) {
  const Cred = useSelector((state) => state.Cred);
  const [selectedCity, setSelectedCity] = useState();
  const [selectedState, setSelectedState] = useState();
  const [selectedClient, setSelectedClient] = useState();
  const [allState, setAllState] = useState([]);
  const [allCity, setAllCity] = useState([]);
  const isSuperAdmin = useIsSuperAdmin();
  const [allClients, setAllClients] = useState([]);
  const isManager = useIsManager();
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
      const resp = await getCity(Cred.token, stateId);
      setAllCity(resp);
    } catch (error) {
      Swal.fire({
        title: "Something Went Wrong, Can't Fetch City",
        text: error?.response?.data?.message ?? "Please Try Again",
        icon: "warning",
      });
    }
  }

  async function getClientByCityId(cityId) {
    try {
      const resp = await ((isSuperAdmin || isManager)
      ? getAllClientsByCityId(Cred.token, 0, cityId)
      : getAllClientFmcgByCityIdAndMemberId(Cred.token, 0, cityId, Cred.sub));
      console.log(isManager,'ss')
      console.log(resp.content);
      setAllClients(resp.content);
    } catch (error) {
      Swal.fire({
        title: "Something Went Wrong, Can't Fetch Clients",
        text: error?.response?.data?.message ?? "Please Try Again",
        icon: "warning",
      });
    }
  }

  return (
    <div className="mb-3 ml-10 d-flex main-container">
      {isSuperAdmin && (
        <Select
          options={allState?.map((e) => ({
            label: e.stateName,
            value: e.id,
          }))}
          placeholder="Select State"
          onChange={(e) => {
            setSelectedState(e);
            setAllCity([]);
            getCityByState(e.value);
            setAllClients([]);
            setSelectedCity(null);
            setSelectedClient(null);
          }}
          value={selectedState}
          noOptionsMessage={() => "Not found"}
          name=""
          className="select-custom-css"
          menuPortalTarget={document.body} 
          styles={{
            menuPortal: (base) => ({
              ...base,
              zIndex: 9999, 
            }),
          }}
        />
      )}
      <Select
        options={
          isSuperAdmin
            ? allCity?.map((e) => ({
                label: e.cityName,
                value: e.id,
              }))
            : Cred.cities.map((e) => ({
                label: e.cityName,
                value: e.id,
              }))
        }
        placeholder="Select City"
        onChange={(e) => {
          setSelectedCity(e);
          setAllClients([]);
          setSelectedClient(null);
          getClientByCityId(e.value);
        }}
        value={selectedCity}
        noOptionsMessage={() => "Not found"}
        name=""
        className="select-custom-css"
      />
      <Select
        options={allClients?.map((e) => ({
          label: e.clientCode,
          value: e.id,
          ...e,
        }))}
        placeholder="Select Client"
        onChange={(e) => setSelectedClient(e)}
        value={selectedClient}
        noOptionsMessage={() => "Not found"}
        name=""
        className="select-custom-css"
      />
      <Button
        onClick={() => {
          if (
            loading ||
            !selectedClient ||
            (isSuperAdmin ? !selectedState : false) ||
            !selectedCity
          )
            return;
          onSubmit?.({
            ...selectedClient,
            stateName: selectedState?.label ?? "",
            cityName: selectedCity.label,
          });
        }}
        className="d-flex gap-2 align-items-center sbt-btn"
        disabled={loading}
      >
        Apply
        {loading && <Spinner size="sm" color="white" />}
      </Button>
      <Button
        onClick={() => {
          setSelectedCity(null);
          setSelectedState(null);
          setSelectedClient(null);
          onSubmit?.(null);
        }}
        className="d-flex gap-2 align-items-center sbt-btn"
        variant="secondary"
      >
        Remove
      </Button>
    </div>
  );
}

export default FilterComponent;
