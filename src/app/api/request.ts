import requests from "./agent";

const Request = {
  printTicket: (): Promise<void> => requests.print(`request/ticket`),
  getOrderPdfUrl: (): Promise<string> => requests.getFileUrl(`request/order`, "application/pdf"),
};

export default Request;
