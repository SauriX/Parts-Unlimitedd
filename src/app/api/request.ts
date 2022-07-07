import requests from "./agent";

const Request = {
  printTicket: (): Promise<void> => requests.print(`request/ticket`),
};

export default Request;
