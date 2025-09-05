import { Request, Response } from "express";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { PaymentServices } from "./payment.service";
import { envVariables } from "../../config/env";
import { SSLServices } from "../sslCommerz/sslCommerz.service";

const initPayment = catchAsync(async (req: Request, res: Response) => {
  const { orderId } = req.params;
  const result = await PaymentServices.initPayment(orderId);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Payment session created successfully",
    data: result,
  });
});

const successPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentServices.successPayment(
    query as Record<string, string>
  );

  if (result.success) {
    res.redirect(
      `${envVariables.SSL.SSL_SUCCESS_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
    );
  }
});

const failPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentServices.failPayment(
    query as Record<string, string>
  );

  res.redirect(
    `${envVariables.SSL.SSL_FAIL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
  );
});

const cancelPayment = catchAsync(async (req: Request, res: Response) => {
  const query = req.query;
  const result = await PaymentServices.cancelPayment(
    query as Record<string, string>
  );

  res.redirect(
    `${envVariables.SSL.SSL_CANCEL_FRONTEND_URL}?transactionId=${query.transactionId}&message=${result.message}&amount=${query.amount}&status=${query.status}`
  );
});

const validatePayment = catchAsync(async (req: Request, res: Response) => {
  await SSLServices.validatePayment(req.body);
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Payment Validated Successfully",
    data: null,
  });
});

export const PaymentController = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
  validatePayment,
};
