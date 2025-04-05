import axios from "axios";
import AppStore from "../redux/store";

export async function fetchAPI({ method, url, data = {} }) {
  const token = AppStore.getState()?.Cred?.token;

  const headers = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  const resp = await axios.request({
    method,
    url,
    data,
    headers,
  });

  return resp.data;
}
