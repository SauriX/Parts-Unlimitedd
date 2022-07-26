
import { IAppointmentForm, IAppointmentList, IExportForm, ISearchAppointment } from "../models/appointmen";
import requests from "./agent";

const Appointment = {
  access: (): Promise<void> => requests.get("/user/scopes"),
  getLab: (search: ISearchAppointment): Promise<IAppointmentList[]> => requests.post(`Appointment/getLab`,search),
  getDom: (search: ISearchAppointment): Promise<IAppointmentList[]> => requests.post(`Appointment/getDom`,search),
  getByIdLab: (id: string): Promise<IAppointmentForm> => requests.get(`Appointment/getLabById/${id}`),
  getByIdDom: (id: string): Promise<IAppointmentForm> => requests.get(`Appointment/getDomById/${id}`),
  createLab: (branch: IAppointmentForm): Promise<boolean> => requests.post("/Appointment/Lab", branch),
  updateLab: (branch:IAppointmentForm): Promise<boolean> => requests.put("/Appointment/Lab", branch),
  createDom: (branch: IAppointmentForm): Promise<boolean> => requests.post("/Appointment/Dom", branch),
  updateDom: (branch:IAppointmentForm): Promise<boolean> => requests.put("/Appointment/Dom", branch),
  exportList: (search: ISearchAppointment): Promise<void> =>
    requests.download(`Appointment/export/list`,search),
  exportForm: (data:IExportForm): Promise<void> => requests.download(`Appointment/export/form`,data),
};

export default Appointment;