import { IRequestPayment } from "../models/request";
import requests from "./agent";

const NetPay = {
  paymentCharge: (paymentInfo: IRequestPayment): Promise<string> =>
    requests.post("netpay/payment/charge", paymentInfo),
};

export default NetPay;
