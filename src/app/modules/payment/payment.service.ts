import { Payment } from "./payment.model";
import { PAYMENT_STATUS } from "./payment.interface";
import AppError from "../../errorHelpers/AppError";
import { Order } from "../order/order.model";
import { SSLServices } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { User } from "../user/user.model";
import { Course } from "../course/course.model";

/**
 * Initialize Payment
 */
const initPayment = async (orderId: string) => {
  const order = await Order.findById(orderId);

  if (!order) {
    throw new AppError(404, "Order not found");
  }

  // Check if a payment already exists for this order
  const payment = await Payment.findOne({ order: orderId });

  if (!payment) {
    throw new AppError(404, "Payment record not found for this order");
  }

  // student instead of user
  // const student = order.student as any;

  const student = await User.findById(order.student);
  if (!student) throw new AppError(404, "Student not found");

  const sslPayload: ISSLCommerz = {
    address: student.address,
    email: student.email,
    phoneNumber: student.phone,
    name: student.name,
    amount: payment.amount,
    transactionId: payment.transactionId,
  };

  const sslPayment = await SSLServices.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
  };
};

/**
 * Success Payment
 */
const successPayment = async (query: Record<string, string>) => {
  // Find the payment and mark it as PAID
  const payment = await Payment.findOneAndUpdate(
    { transactionId: query.transactionId },
    { status: PAYMENT_STATUS.PAID },
    { new: true, runValidators: true }
  );

  if (!payment) throw new AppError(404, "Payment not found");

  // Update the order to ENROLLED
  const order = await Order.findByIdAndUpdate(
    payment.order,
    { status: "ENROLLED" },
    { new: true }
  );

  if (!order) throw new AppError(404, "Order not found");

  // Increment enrolledCount in the related course
  await Course.findByIdAndUpdate(order.course, {
    $inc: { enrolledCount: 1 },
  });

  return { success: true, message: "Payment successful, course enrolled" };
};

/**
 * Fail Payment
 */
const failPayment = async (query: Record<string, string>) => {
  const payment = await Payment.findOneAndUpdate(
    { transactionId: query.transactionId },
    { status: PAYMENT_STATUS.FAILED },
    { new: true, runValidators: true }
  );

  if (!payment) throw new AppError(404, "Payment not found");

  await Order.findByIdAndUpdate(payment.order, { status: "PAYMENT_FAILED" });

  return { success: false, message: "Payment failed" };
};

/**
 * Cancel Payment
 */
const cancelPayment = async (query: Record<string, string>) => {
  const payment = await Payment.findOneAndUpdate(
    { transactionId: query.transactionId },
    { status: PAYMENT_STATUS.CANCELLED },
    { new: true, runValidators: true }
  );

  if (!payment) throw new AppError(404, "Payment not found");

  await Order.findByIdAndUpdate(payment.order, { status: "CANCELLED" });

  return { success: false, message: "Payment cancelled" };
};

export const PaymentServices = {
  initPayment,
  successPayment,
  failPayment,
  cancelPayment,
};
