/* eslint-disable @typescript-eslint/no-explicit-any */
import AppError from "../../errorHelpers/AppError";
import httpStatus from "http-status-codes";
import { Order } from "./order.model";
import { Course } from "../course/course.model";
import { Payment } from "../payment/payment.model";
import { PAYMENT_STATUS } from "../payment/payment.interface";
import { SSLServices } from "../sslCommerz/sslCommerz.service";
import { ISSLCommerz } from "../sslCommerz/sslCommerz.interface";
import { getTransactionId } from "../../utils/getTransactionId";

const enrollCourse = async (courseId: string, userId: string) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError(httpStatus.NOT_FOUND, "Course not found");

  const transactionId = getTransactionId();
  const amount = course.price;

  // Create order
  const order = await Order.create({
    course: course._id,
    student: userId,
    status: "PENDING",
  });

  // Create payment
  const payment = await Payment.create({
    order: order._id,
    transactionId,
    amount,
    status: PAYMENT_STATUS.UNPAID,
  });

  //   Populate student details
  const populatedOrder = await Order.findById(order._id).populate({
    path: "student",
    select: "name email phone address",
  });

  if (!populatedOrder || !populatedOrder.student) {
    throw new AppError(404, "Student not found");
  }

  const user = populatedOrder.student as any;

  //   const user = await User.findById(userId);

  if (!user) {
    throw new AppError(404, "Student not found");
  }

  const sslPayload: ISSLCommerz = {
    address: user.address || "Dhaka",
    email: user.email,
    phoneNumber: user.phone || "01700000000",
    name: user.name,
    amount,
    transactionId,
  };

  const sslPayment = await SSLServices.sslPaymentInit(sslPayload);

  return {
    paymentUrl: sslPayment.GatewayPageURL,
    order,
    payment,
  };
};

export const OrderServices = {
  enrollCourse,
};
