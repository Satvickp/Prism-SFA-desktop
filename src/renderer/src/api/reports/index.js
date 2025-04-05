import { API_URL } from "../../constants/api-url";
import { getDateFormat } from "../../helper/date-functions";
import { fetchAPI } from "../api-utils";

export const getSalesReportApi = async ({ startDate, endDate, salesLevel }) => {
  const resp = await fetchAPI({
    url: `${
      API_URL.backend_url
    }order-service/reports/sales?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&salesLevel=${salesLevel}`,
  });

  return resp;
};

export const getSalesReportByClientFMCGIdApi = async ({
  startDate,
  endDate,
  salesLevel,
  clientId,
}) => {
  const resp = await fetchAPI({
    url: `${
      API_URL.backend_url
    }order-service/reports/overall-sales/byDateAndSalesLevelAndClientFmcgId/${clientId}?startDate=${getDateFormat(startDate)}&endDate=${getDateFormat(endDate)}&salesLevel=${salesLevel}`,
  });
  return resp;
};

export const getOutletOrderReportApi = async ({
  startDate,
  endDate,
  beetId,
}) => {
  const resp = await fetchAPI({
    url: `${
      API_URL.backend_url
    }order-service/reports/getOutletOrderReportByBeetIdWithDateFilter/${beetId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&page=0&pageSize=1000`,
  });
  return resp;
};

export const getBeetOrderReportByReportingManagerApi = async ({
  startDate,
  endDate,
  reportingManagerId,
}) => {
  const resp = await fetchAPI({
    url: `${
      API_URL.backend_url
    }order-service/reports/getBeetOrderReportByReportingManagerIdWithDateFilter/${reportingManagerId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&page=0&pageSize=1000`,
  });

  return resp;
};

export const getBeetOrderReportByMemberIdApi = async ({
  startDate,
  endDate,
  memberId,
}) => {
  const resp = await fetchAPI({
    url: `${
      API_URL.backend_url
    }order-service/reports/getBeetOrderReportByMemberIdWithDateFilter/${memberId}?startDate=${startDate.toISOString()}&endDate=${endDate.toISOString()}&page=0&pageSize=1000`,
  });

  return resp;
};

// outlet

export const getAllOrderByEachOutletByMemberIdByProductiveStatusApi = async (
  memberId,
  callStatus
) => {
  const resp = await fetchAPI({
    url: `${API_URL.backend_url}order-service/reports/getAllOrderByEachOutletByMemberIdByProductiveStatus/${memberId}?orderCallStatus=${callStatus}&page=0&pageSize=1000`,
  });

  return resp;
};

export const getAllOrderByEachOutletByMemberIdByOrderMediumApi = async (
  memberId,
  orderMedium
) => {
  const resp = await fetchAPI({
    url: `${API_URL.backend_url}order-service/reports/getAllOrderByEachOutletByMemberIdByOrderMedium/${memberId}?orderMedium=${orderMedium}&page=0&pageSize=1000`,
  });

  return resp;
};
export const getAllOrderByEachOutletByClientFMCGIdByProductiveStatusApi =
  async (clientFmcgId, callStatus) => {
    const resp = await fetchAPI({
      url: `${API_URL.backend_url}order-service/reports/getAllOrderByEachOutletByClientFmcgIdByProductiveStatus/${clientFmcgId}?orderCallStatus=${callStatus}&page=0&pageSize=1000`,
    });

    return resp;
  };

export const getAllOrderByEachOutletByClientFMCGIdByOrderMediumApi = async (
  clientFmcgId,
  orderMedium
) => {
  const resp = await fetchAPI({
    url: `${API_URL.backend_url}order-service/reports/getAllOrderByEachOutletByClientFmcgIdByOrderMedium/${clientFmcgId}?orderMedium=${orderMedium}&page=0&pageSize=1000`,
  });

  return resp;
};

// beet
export const getAllOrderByEachBeetByMemberIdByProductiveStatusApi = async (
  memberId,
  callStatus
) => {
  const resp = await fetchAPI({
    url: `${API_URL.backend_url}order-service/reports/getAllOrderByEachBeetByMemberIdByProductiveStatus/${memberId}?orderCallStatus=${callStatus}&page=0&pageSize=1000`,
  });

  return resp;
};

export const getAllOrderByEachBeetByMemberIdByOrderMediumApi = async (
  memberId,
  orderMedium
) => {
  const resp = await fetchAPI({
    url: `${API_URL.backend_url}order-service/reports/getAllOrderByEachBeetByMemberIdByOrderMedium/${memberId}?orderMedium=${orderMedium}&page=0&pageSize=1000`,
  });

  return resp;
};
export const getAllOrderByEachBeetByClientFMCGIdByProductiveStatusApi = async (
  clientFmcgId,
  callStatus
) => {
  const resp = await fetchAPI({
    url: `${API_URL.backend_url}order-service/reports/getAllOrderByEachBeetByClientFmcgIdByProductiveStatus/${clientFmcgId}?orderCallStatus=${callStatus}&page=0&pageSize=1000`,
  });

  return resp;
};

export const getAllOrderByEachBeetByClientFMCGIdByOrderMediumApi = async (
  clientFmcgId,
  orderMedium
) => {
  const resp = await fetchAPI({
    url: `${API_URL.backend_url}order-service/reports/getAllOrderByEachBeetByClientFmcgIdByOrderMedium/${clientFmcgId}?orderMedium=${orderMedium}&page=0&pageSize=1000`,
  });

  return resp;
};

// beet journey plan

export const getMemberBeetJourneyPlanByMemberIdApi = async (memberId) => {
  const resp = await fetchAPI({
    url: `${API_URL.backend_url}beet-logs/beetJourneyPlanReportByMemberId/${memberId}`,
  });

  return resp;
};
