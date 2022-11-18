import { makeAutoObservable } from "mobx";
import Appointment from "../api/appointment";

import alerts from "../util/alerts";
import history from "../util/history";
import { getErrors, tokenName } from "../util/utils";
import responses from "../util/responses";
import messages from "../util/messages";
import {
  IAppointmentForm,
  IAppointmentList,
  IExportForm,
  ISearchAppointment,
  ISolicitud,
  SearchAppointmentValues,
} from "../models/appointmen";
import Study from "../api/study";
import { IRequestPack, IRequestStudy } from "../models/request";
import { IPriceListInfoFilter } from "../models/priceList";
import { IProceedingList } from "../models/Proceeding";
import PriceList from "../api/priceList";
export default class AppoinmentStore {
  constructor() {
    makeAutoObservable(this);
  }
  sucursales!: IAppointmentList[];
  sucursal!: IAppointmentForm;
  search: ISearchAppointment = new SearchAppointmentValues();
  records: IProceedingList[] = [];
  studies: IRequestStudy[] = [];
  packs: IRequestPack[] = [];
  studyFilter: IPriceListInfoFilter = {};
  setSearch = (value: ISearchAppointment) => {
    this.search = value;
  };
  createsolictud = async (reagent: ISolicitud) => {
    try {
      const updatedReagent = await Appointment.createSolicitud(reagent);
      alerts.success(messages.updated);

      return updatedReagent;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  access = async () => {
    try {
      //  await User.access();
      if (Date.now() > 100) return;
      else throw new Error("Test");
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };
  setStudyFilter = (
    branchId?: string,
    doctorId?: string,
    companyId?: string
  ) => {
    this.studyFilter = {
      sucursalId: branchId,
      medicoId: doctorId,
      compañiaId: companyId,
    };
  };
  createLab = async (reagent: IAppointmentForm) => {
    try {
      console.log("here");
      await Appointment.createLab(reagent);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  createDom = async (reagent: IAppointmentForm) => {
    try {
      console.log("here");
      await Appointment.createLab(reagent);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  updateLab = async (user: IAppointmentForm) => {
    try {
      await Appointment.updateLab(user);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  updateDom = async (user: IAppointmentForm) => {
    try {
      await Appointment.updateDom(user);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  getAllLab = async (search: ISearchAppointment) => {
    console.log("use");
    try {
      console.log(search);
      const roles = await Appointment.getLab(search);
      console.log(roles);
      this.sucursales = roles;
      return roles;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.sucursales = [];
    }
  };
  getAllDom = async (search: ISearchAppointment) => {
    try {
      console.log(search);
      const roles = await Appointment.getDom(search);
      console.log(roles);
      this.sucursales = roles;
      return roles;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.sucursales = [];
    }
  };
  getParameter = async (id: number) => {
    try {
      const reagent = await Study.getById(id);
      return reagent;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
  getByIdLab = async (id: string) => {
    try {
      const rol = await Appointment.getByIdLab(id);
      rol.estudy?.map(async (x) => {
        var parametros = await this.getParameter(x.estudioId!);
        x.parametros = parametros!.parameters;
        x.nombre = parametros!.nombre;
        x.indicaciones = parametros?.indicaciones!;
        x.clave = parametros?.clave!;
      });
      console.log(rol);
      this.sucursal = rol;
      return rol;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        //history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
      //this.roles = [];
    }
  };

  getByIdDom = async (id: string) => {
    try {
      const rol = await Appointment.getByIdDom(id);
      console.log(rol);
      this.sucursal = rol;
      return rol;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        //history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
      //this.roles = [];
    }
  };
  exportList = async (search: ISearchAppointment) => {
    try {
      await Appointment.exportList(search);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  exportForm = async (data: IExportForm) => {
    try {
      await Appointment.exportForm(data);
      return true;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
  getPriceStudys = async (filter?: IPriceListInfoFilter, id?: number) => {
    filter!.estudioId = id;
    try {
      const price = await PriceList.getPriceStudy(filter);
      const study: IRequestStudy = {
        ...price,
        type: "study",
        estatusId: 0,
        aplicaCargo: false,
        aplicaCopago: false,
        aplicaDescuento: false,
        nuevo: true,
        asignado: true,
      };

      const repeated = this.studies.filter(function (itm) {
        return itm.parametros
          .map((x) => x.id)
          .filter((x) => study.parametros.map((y) => y.id).indexOf(x) !== -1);
      });

      if (repeated && repeated.length > 0) {
        alerts.confirm(
          "Coincidencias en estudios",
          "Se encuentran coincidencias en parámetros de solicitud, en estudios: " +
            repeated.map((x) => x.clave).join(", "),
          async () => {
            this.studies.unshift(study);
          }
        );
      } else {
        this.studies.unshift(study);
      }
      return study;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  sendTestEmail = async (typo: string, requestId: string, email: string) => {
    try {
      await Appointment.sendTestEmail(typo, requestId, email);
      alerts.info("El correo se está enviando");
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };

  sendTestWhatsapp = async (typo: string, requestId: string, phone: string) => {
    try {
      await Appointment.sendTestWhatsapp(typo, requestId, phone);
      alerts.info("El whatsapp se está enviando");
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };
  getPricePacks = async (filter?: IPriceListInfoFilter, id?: number) => {
    filter!.paqueteId = id;
    try {
      const price = await PriceList.getPricePack(filter);
      const pack: IRequestPack = {
        ...price,
        type: "pack",
        aplicaCargo: false,
        aplicaCopago: false,
        aplicaDescuento: false,
        nuevo: true,
        asignado: true,
        estudios: price.estudios.map((x) => ({
          ...x,
          type: "study",
          aplicaCargo: false,
          estatusId: 0,
          aplicaCopago: false,
          aplicaDescuento: false,
          nuevo: true,
          asignado: true,
        })),
      };
      console.log(pack);
      this.packs.unshift(pack);
      return pack;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  isPack(obj: IRequestStudy | IRequestPack): obj is IRequestPack {
    return obj.type === "pack";
  }

  isStudy(obj: IRequestStudy | IRequestPack): obj is IRequestStudy {
    return obj.type === "study";
  }
}
