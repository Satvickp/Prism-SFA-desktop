import React, { useCallback, useEffect, useState, useRef } from "react";
import {
  getTenantMember,
  loginClientFMCG,
  loginMember,
} from "../../api/login/login-api";
import { Modal, Button, Form } from "react-bootstrap";

import {
  setCredentials,
} from "../../redux/features/credentialSlice";

import Swal from "sweetalert2";
import { useDispatch } from "react-redux";
import { constants } from "../../constants/constants";
import { Spinner } from "react-bootstrap";
import { jwtDecode } from "jwt-decode";
import { debounce } from "lodash";
import { Link } from "react-router-dom";
import { setBASE_URL } from "../../constants/api-url";
import {
  sendOtp,
  verifyMemberEmailOtp,
  resetMemberPassword,
  verifyClientFmcgEmailOtp,
  resetClientFmcgPassword,
  clientsendOtp,
} from "../../api/forgetpassword/forgetcontroller";
function SignIn() {
  const [userId, setUserId] = useState("");
  const [tenantId, setTenantId] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [passText, setPassText] = useState("password");
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verifying, setVerifying] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showResetModal, setShowResetModal] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [timer, setTimer] = useState(120);

  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const memberIdRef = useRef(null);
  const [code, setcode] = useState("");
  const dispatch = useDispatch();

  async function handleSubmit() {
    if (userId && password && tenantId) {
      setLoading(true);
      if (isNaN(Number(userId))) {
        // client login
        try {
          const resp = await loginClientFMCG(userId, password);
          const decode = await jwtDecode(resp.token);
          await window.localStorage.setItem(constants.token_store, resp.token);
          await window.localStorage.setItem("isMember", false);
          dispatch(setCredentials({ token: resp.token, ...decode }));
          window.location.reload();
        } catch (error) {
          const errCode = error.response ? error.response.status : undefined;
          if (errCode === 404) {
            Swal.fire({
              title: "Invalid Credentials",
              text: "Invalid UserId or Password. Please Enter  Correct Credentials",
              icon: "error",
              confirmButtonText: "ok",
            });
          } else {
            Swal.fire({
              title: "Can't SignIn!",
              text: "Something went wrong. Make Sure you have entered correct values to the respective field or Try Again After later",
              icon: "error",
              confirmButtonText: "ok",
            });
          }
        }
      } else {
        // member login
        // if (tenantId == "") {
        //   Swal.fire({
        //     title: "Tenant Id unavailable",
        //     text: Tenant Id not present. Please Enter Tenant Id to proceed,
        //     icon: "error",
        //     confirmButtonText: "ok",
        //   });
        //   setLoading(false);
        //   return;
        // }
        try {
          const resp = await loginMember(userId, password);
          const decode = await jwtDecode(resp.token);
          await window.localStorage.setItem(constants.token_store, resp.token);
          await window.localStorage.setItem("isMember", true);
          dispatch(
            setCredentials({ token: resp.token, ...decode, isMember: true })
          );
          window.location.reload();
        } catch (error) {
          const errCode = error.response ? error.response.status : undefined;
          if (errCode === 404) {
            Swal.fire({
              title: "Invalid Credentials",
              text: "Invalid UserId or Password. Please Enter  Correct Credentials",
              icon: "error",
              confirmButtonText: "ok",
            });
          } else {
            Swal.fire({
              title: "Can't SignIn!",
              text: "Something went wrong. Make Sure you have entered correct values to the respective field or Try Again After later",
              icon: "error",
              confirmButtonText: "ok",
            });
          }
        }
      }

      setLoading(false);
    } else {
      Swal.fire({
        title: "Incomplete!",
        text: "Please fill the required details",
        icon: "error",
        confirmButtonText: "ok",
      });
    }
  }


  const handleGetTenantData = useCallback(
    debounce(async (tenantId) => {
      if (tenantId) {
        try {
          const tenant = await getTenantMember(tenantId);
          await window.localStorage.setItem(
            constants.base_url,
            tenant.data.domain
          );
          window.localStorage.setItem(
            constants.clientType,
            tenant.data.clientType
          );
          setBASE_URL();
        } catch (error) {
          console.error("Error fetching tenant data:", error);
        }
      }
    }, 1000),
    []
  );

  useEffect(() => {
    handleGetTenantData(tenantId);
  }, [tenantId, handleGetTenantData]);



  const handleForgotPassword = () => {
    // Reset all states related to forgot password flow
    setEmail("");
    setOtp("");
    setOtpSent(false);
    setVerifying(false);
    setTimer(120);
    setcode("");
    setNewPassword("");
    setConfirmPassword("");

    if (!userId.trim()) {
      Swal.fire({
        title: "User ID Missing",
        text: "Please enter your Member ID or Client ID to proceed.",
        icon: "warning",
        confirmButtonText: "OK",
      });
      return;
    }

    setShowForgotPassword(true);
  };




  const handleSendOtp = async () => {
    setSendingOtp(true);
    try {
      if (isNaN(Number(userId))) {
        const Client = await clientsendOtp(userId);
        setcode(Client);
      } else {
        await sendOtp(email);
      }
      setOtpSent(true);
      setTimer(120);
    } catch (error) {
      alert("Failed to send OTP.");
    } finally {
      setSendingOtp(false);
    }
  };



  useEffect(() => {
    let countdown;
    if (otpSent && timer > 0) {
      countdown = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else if (timer === 0) {
      clearInterval(countdown);
    }
    return () => clearInterval(countdown);
  }, [otpSent, timer]);



  const handleVerifyOtp = async () => {
    try {
      setVerifying(true);
      if (isNaN(Number(userId))) {
        memberIdRef.current = await verifyClientFmcgEmailOtp(code, otp);
      } else {
        memberIdRef.current = await verifyMemberEmailOtp(email, otp);
      }
      setShowForgotPassword(false);
      setShowResetModal(true);
    } catch (error) {
      alert("Invalid OTP. Please try again.");
    } finally {
      setVerifying(false);
    }
  };



  const handleResetPassword = async () => {
    if (!newPassword || !confirmPassword) {
      alert("please enter password")
      return;
    }
    if (newPassword !== confirmPassword) {
      Swal.fire("Error", "Passwords do not match. Please try again.", "error");
      return;
    }

    try {
      if (isNaN(Number(userId))) {
        await resetClientFmcgPassword(memberIdRef.current, newPassword);
      } else {
        await resetMemberPassword(memberIdRef.current, newPassword);
      }

      Swal.fire({
        title: "Success",
        text: "Password reset successful. Please log in with your new password.",
        icon: "success",
        timer: 1000, 
        showConfirmButton: false, 
      });
      setShowResetModal(false);
    } catch (error) {
      Swal.fire(
        "Error",
        "Failed to reset password. Please try again.",
        "error"
      );
    }
  };




  return (
    <div className="col-lg-6 d-flex justify-content-center align-items-center border-0 rounded-lg auth-h100">
      <div
        className="w-100 p-3 p-md-5 card border-0 bg-dark text-light"
        style={{ maxWidth: "32rem" }}
      >
        <form className="row g-1 p-3 p-md-4">
          <div className="col-12 text-center mb-1 mb-lg-5">
            <h1>Sign in</h1>
            <span>Access to Your dashboard.</span>
          </div>
          <div className="col-12">
            <div className="col-12">
              <div className="mb-2">
                <label htmlFor="tenantId" className="form-label">
                  Tenant Id
                </label>
                <input
                  // maxLength={10}
                  id="tenantId"
                  type="email"
                  value={tenantId}
                  onChange={(e) => setTenantId(e.target.value)}
                  className="form-control form-control-lg"
                  placeholder="Enter Tenant Id"
                />
              </div>
            </div>
            <div className="mb-2">
              <label htmlFor="userId" className="form-label">
                User Id
              </label>
              <input
                maxLength={10}
                id="userId"
                type="email"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                className="form-control form-control-lg"
                placeholder="Enter UserId or ClientId"
              />
            </div>
          </div>
          <div className="col-12">
            <div className="mb-2">
              <div className="form-label">
                <span
                  htmlFor="passwordInput"
                  className="d-flex justify-content-between align-items-center"
                >
                  Password
                  <Link
                    onClick={handleForgotPassword}
                    className="text-secondary float-end "
                  >
                    Forgot Password?
                  </Link>
                </span>
              </div>

              <div className="d-flex justify-content-between align-items-center form-control form-control-lg">
                <input
                  value={password}
                  id="passwordInput"
                  onChange={(e) => setPassword(e.target.value)}
                  type={passText}
                  className="form-control"
                  style={{ borderStyle: "none", boxShadow: "none" }}
                  placeholder="***************"
                  maxLength={240}
                />
                <div
                  className="fs-4 "
                  onClick={() =>
                    setPassText((prev) =>
                      prev === "password" ? "text" : "password"
                    )
                  }
                >
                  {passText === "password" ? (
                    <i className="icofont-eye-blocked"></i>
                  ) : (
                    <i className="icofont-eye"></i>
                  )}
                </div>
              </div>
            </div>
          </div>
          {!loading && (
            <div onClick={handleSubmit} className="col-12 text-center mt-4">
              <p
                className="btn btn-lg btn-block btn-light lift text-uppercase"
                atl="signin"
              >
                SIGN IN
              </p>
            </div>
          )}
          {loading && (
            <div className="col-12 text-center mt-4">
              <Spinner
                className="sigin-in-loader"
                animation="border"
                color="black"
                size="sm"
              />
            </div>
          )}
        </form>
      </div>

      <Modal
        show={showForgotPassword}
        onHide={() => setShowForgotPassword(false)}
      >
        <Modal.Header closeButton>
          <Modal.Title>Forget Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {!otpSent ? (
            <>
              {isNaN(Number(userId)) ? (
                <>
                  <Form.Label>Client ID</Form.Label>
                  <Form.Control
                    type="text"
                    value={code}
                    onChange={(e) => setcode(e.target.value)}
                    placeholder="Your Client ID"
                  />
                  <Button
                    onClick={handleSendOtp}
                    className="mt-3"
                    disabled={sendingOtp}
                  >
                    {sendingOtp ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </>
              ) : (
                <>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                  />
                  <Button
                    onClick={handleSendOtp}
                    className="mt-3"
                    disabled={sendingOtp}
                  >
                    {sendingOtp ? (
                      <Spinner animation="border" size="sm" />
                    ) : (
                      "Send OTP"
                    )}
                  </Button>
                </>
              )}
            </>
          ) : (
            <>
              <Form.Label>Enter OTP</Form.Label>
              <Form.Control
                type="text"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="Enter OTP"
              />
              <Button
                onClick={handleVerifyOtp}
                className="mt-3"
                disabled={verifying}
              >
                {verifying ? "Verifying..." : "Verify OTP"}
              </Button>

              {/* Timer and Resend OTP Logic */}
              <div className="mt-3">
                {timer > 0 ? (
                  <span>
                    Resend OTP in <strong>{timer}</strong> seconds.
                  </span>
                ) : (
                  <Button
                    variant="link"
                    onClick={handleSendOtp}
                    disabled={sendingOtp}
                  >
                    Resend OTP
                  </Button>
                )}
              </div>
            </>
          )}
        </Modal.Body>

      </Modal>

      {/* Reset Password Modal */}
      <Modal show={showResetModal} onHide={() => setShowResetModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Reset Password</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {/* New Password Field */}
            <Form.Group controlId="newPassword">
              <Form.Label>New Password</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={passText === "password" ? "password" : "text"}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="*********"
                />
                <div
                  className="fs-4 position-absolute"
                  style={{ top: "50%", right: "10px", transform: "translateY(-50%)", cursor: "pointer" }}
                  onClick={() => setPassText((prev) => (prev === "password" ? "text" : "password"))}
                >
                  {passText === "password" ? (
                    <i className="icofont-eye-blocked"></i>
                  ) : (
                    <i className="icofont-eye"></i>
                  )}
                </div>
              </div>
            </Form.Group>

            {/* Confirm Password Field */}
            <Form.Group controlId="confirmPassword" className="mt-3">
              <Form.Label>Confirm Password</Form.Label>
              <div className="position-relative">
                <Form.Control
                  type={passText === "password" ? "password" : "text"}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="*******"
                />
                <div
                  className="fs-4 position-absolute"
                  style={{ top: "50%", right: "10px", transform: "translateY(-50%)", cursor: "pointer" }}
                  onClick={() => setPassText((prev) => (prev === "password" ? "text" : "password"))}
                >
                  {/* {passText === "password" ? (
                    <i className="icofont-eye-blocked"></i>
                  ) : (
                    <i className="icofont-eye"></i>
                  )} */}
                </div>
              </div>
            </Form.Group>

            {/* Reset Password Button */}
            <Button onClick={handleResetPassword} className="mt-3">
              Reset Password
            </Button>
          </Form>
        </Modal.Body>
      </Modal>


      <Modal show={showErrorModal} onHide={() => setShowErrorModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Error</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowErrorModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
export default SignIn;
