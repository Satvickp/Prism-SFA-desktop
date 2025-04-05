
import axios from "axios";
import { API_URL } from "../../constants/api-url";


const baseUrl = `${API_URL.SERVICE_URL}forgetPassword`;
// console.log('rrr',baseUrl);

export const sendOtp = async (email) => {
    try {
      const response = await axios.post(
        `${baseUrl}/sendOtp`,
        '', 
        {
          params: {
            email: email, 
          },
          headers: {
            'accept': '*/*', 
          },
        }
      );
      return response.data; 
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error; 
    }
  };

  export const clientsendOtp = async (clientCode) => {
    try {
      const response = await axios.post(
        `${baseUrl}/clientFmcg/sendOtp`,
        '', 
        {
          params: {
            clientCode:clientCode, 
          },
          headers: {
            'accept': '*/*', 
          },
        }
      );
      console.log('lully',response.data);
      return response.data; 
    } catch (error) {
      console.error('Error sending OTP:', error);
      throw error; 
    }
  };


  // export const verifyMemberEmailOtp = async (email, otp) => {
  //   try {
  //     const response = await axios.post(
  //       `${baseUrl}/member/verifyMemberEmailOtp`, 
  //       '', 
  //       {
  //         params: {
  //           email: email,  
  //           otp: otp,    
  //         },
  //         headers: {
  //           'accept': '*/*',  
  //         },
  //       }
  //     );
  //     console.log('ll',response.data)
  //     return response.data; 
  //   } catch (error) {
  //     console.error('Error verifying OTP:', error);
  //     throw error; 
  //   }
  // };


  export async function verifyMemberEmailOtp(email, otp) {
    try {
      const url = API_URL.SERVICE_URL + `forgetPassword/member/verifyMemberEmailOtp?email=${email}&otp=${otp}`;
  
      var header = {
        "Content-Type": "application/json",
      };
      const response = await axios({
        headers: header,
        url: url,
        method: "POST",
  
        // timeout: 30000,
        // timeoutErrorMessage: "Time Out. Please Try With Some Better Network",
      });
      console.log('pepe',response.data )
      return response.data;
      //return { token: response.data, statusCode: response.status };
    } catch (error) {
      console.error("Error in verifyMemberEmailOtp:", error.response || error.message);
      throw error; // Re-throw to handle upstream
    }
  }


  export async function verifyClientFmcgEmailOtp(email, otp) {
    try {
      const url = API_URL.SERVICE_URL + `forgetPassword/clientFmcg/verifyClientFmcgEmailOtp?email=${email}&otp=${otp}`;
  
      var header = {
        "Content-Type": "application/json",
      };
      const response = await axios({
        headers: header,
        url: url,
        method: "POST",
  
        // timeout: 30000,
        // timeoutErrorMessage: "Time Out. Please Try With Some Better Network",
      });
      return response.data;
    } catch (error) {
      console.error("Error in verifyClientFmcgEmailOtp:", error.response || error.message);
      throw error; // Re-throw to handle upstream
    }
  }
  

  export const resetMemberPassword = async (userId, newPassword) => {
    try {
      const response = await axios.post(
        `${baseUrl}/member/resetMemberPassword`,
        '',
        {
          params: {
            userId: userId,
            newPassword: newPassword,
          },
          headers: {
            'accept': '*/*',
          },
        }
      );
      console.log('rrrrr',response);
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };


 



  export const resetClientFmcgPassword= async (userId, newPassword) => {
    try {
      const response = await axios.post(
        `${baseUrl}/clientFmcg/resetClientFmcgPassword`,
        '',
        {
          params: {
            userId: userId,
            newPassword: newPassword,
          },
          headers: {
            'accept': '*/*',
          },
        }
      );
      console.log('rrrrr',response);
      return response.data;
    } catch (error) {
      console.error('Error resetting password:', error);
      throw error;
    }
  };