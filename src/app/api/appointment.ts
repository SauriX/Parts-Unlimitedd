import {
  IAppointmentForm,
  IAppointmentList,
  IConvertToRequest,
  IExportForm,
  ISearchAppointment,
  ISolicitud,
} from "../models/appointmen";
import requests from "./agent";

const Appointment = {
  access: (): Promise<void> => requests.get("/user/scopes"),
  getLab: (search: ISearchAppointment): Promise<IAppointmentList[]> =>
    requests.post(`Appointment/getLab`, search),
  getDom: (search: ISearchAppointment): Promise<IAppointmentList[]> =>
    requests.post(`Appointment/getDom`, search),
  getByIdLab: (id: string): Promise<IAppointmentForm> =>
    requests.get(`Appointment/getLabById/${id}`),
  getByIdDom: (id: string): Promise<IAppointmentForm> =>
    requests.get(`Appointment/getDomById/${id}`),
  createLab: (branch: IAppointmentForm): Promise<boolean> =>
    requests.post("/Appointment/Lab", branch),
  updateLab: (branch: IAppointmentForm): Promise<boolean> =>
    requests.put("/Appointment/Lab", branch),
  createDom: (branch: IAppointmentForm): Promise<boolean> =>
    requests.post("/Appointment/Dom", branch),
  updateDom: (branch: IAppointmentForm): Promise<boolean> =>
    requests.put("/Appointment/Dom", branch),
  createSolicitud: (promotion: ISolicitud): Promise<string> =>
    requests.post("/PriceQuote/solicitud", promotion),
  convertirASolicitud: (convert: IConvertToRequest): Promise<boolean> =>
    requests.post("/request/convertir", convert),
  exportList: (search: ISearchAppointment): Promise<void> =>
    requests.download(`Appointment/export/list`, search),
  exportForm: (data: IExportForm): Promise<void> =>
    requests.download(`Appointment/export/form`, data),
  sendTestEmail: (
    typo: string,
    requestId: string,
    email: string
  ): Promise<void> =>
    requests.get(`Appointment/email/${requestId}/${email}/${typo}`),
  sendTestWhatsapp: (
    typo: string,
    requestId: string,
    phone: string
  ): Promise<void> =>
    requests.get(`Appointment/whatsapp/${requestId}/${phone}/${typo}`),
};

export default Appointment;
