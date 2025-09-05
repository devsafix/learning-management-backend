/* eslint-disable @typescript-eslint/no-explicit-any */
import httpStatus from "http-status-codes";
import AppError from "../../errorHelpers/AppError";
import { ISSLCommerz } from "./sslCommerz.interface";
import { envVariables } from "../../config/env";
import axios from "axios";
import { Payment } from "../payment/payment.model";

const sslPaymentInit = async (payload: ISSLCommerz) => {
  try {
    const data = {
      store_id: envVariables.SSL.STORE_ID,
      store_passwd: envVariables.SSL.STORE_PASS,
      total_amount: payload.amount,
      currency: "BDT",
      success_url: `${envVariables.SSL.SSL_SUCCESS_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=success`,
      fail_url: `${envVariables.SSL.SSL_FAIL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=fail`,
      cancel_url: `${envVariables.SSL.SSL_CANCEL_BACKEND_URL}?transactionId=${payload.transactionId}&amount=${payload.amount}&status=cancel`,
      tran_id: payload.transactionId,
      shipping_method: "N/A",
      product_name: "Course",
      product_category: "E-Learning",
      product_profile: "general",
      cus_name: payload.name,
      cus_email: payload.email,
      cus_add1: payload.address,
      cus_city: "Dhaka",
      cus_country: "Bangladesh",
      cus_phone: payload.phoneNumber,
    };

    const response = await axios({
      method: "POST",
      url: envVariables.SSL.SSL_PAYMENT_API,
      data: data,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    return response.data;
  } catch (error: any) {
    throw new AppError(httpStatus.BAD_REQUEST, error.message);
  }
};

const validatePayment = async (payload: any) => {
  try {
    const response = await axios({
      method: "GET",
      url: `${envVariables.SSL.SSL_VALIDATION_API}?val_id=${payload.val_id}&store_id=${envVariables.SSL.STORE_ID}&store_passwd=${envVariables.SSL.STORE_PASS}`,
    });

    await Payment.updateOne(
      { transactionId: payload.tran_id },
      { paymentGatewayData: response.data },
      { runValidators: true }
    );
  } catch (error: any) {
    throw new AppError(401, `Payment Validation Error, ${error.message}`);
  }
};

export const SSLServices = {
  sslPaymentInit,
  validatePayment,
};
