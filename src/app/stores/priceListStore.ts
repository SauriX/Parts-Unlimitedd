import { InputNumber } from "antd";
import { makeAutoObservable } from "mobx";
import Pack from "../api/pack";
import PriceList from "../api/priceList";
import Study from "../api/study";
import {
  IPriceListEstudioList,
  IPriceListForm,
  IPriceListInfoFilter,
  IPriceListList,
  ISucMedComList,
} from "../models/priceList";
import { IDias, IPromotionEstudioList } from "../models/promotion";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class PriceListStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  priceLists: IPriceListList[] = [];
  sucMedCom: ISucMedComList[] = [];
  studies: IPriceListEstudioList[] = [];
  packs: IPriceListEstudioList[] = [];
  clearScopes = () => {
    this.scopes = undefined;
  };

  clearPriceList = () => {
    this.priceLists = [];
  };

  access = async () => {
    try {
      const scopes = await PriceList.access();
      this.scopes = scopes;
      return scopes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };
  getAllStudy = async () => {
    try {
      const studies = await Study.getAllPrice("all");

      return studies;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.studies = [];
    }
  };

  getAllPack = async () => {
    try {
      const roles = await Pack.getAll("all");

      console.log(roles);
      var studies = roles.map((x) => {
        let data: IPriceListEstudioList = {
          id: x.id,
          estudioId: x.id,
          clave: x.clave,
          nombre: x.nombre,
          area: x.area,
          departamento: x.departamento,
          activo: false,
          precio: 0,
          paqute: true,
          pack: x.pack,
        };
        return data;
      });

      this.packs = studies;
      return studies;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.studies = [];
    }
  };

  getAll = async (search: string) => {
    try {
      const priceLists = await PriceList.getAll(search);
      this.priceLists = priceLists;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.priceLists = [];
    }
  };

  getById = async (id: string) => {
    try {
      const priceList = await PriceList.getById(id);
      console.log("se obtuvo la lista de precios");
      return priceList;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  take: number = 50;
  skip: number = 0;
  getSkip = () => {
    return this.skip * this.take;
  };

  addSkip = () => {
    this.skip = this.skip + 1;
  };

  resetSkip = () => {
    this.skip = 0;
  };

  getStudiesById = async (filter: any) => {
    try {
      const priceList: IPromotionEstudioList[] = await PriceList.getStudiesById(
        filter
      );
      var estudios = priceList.map((x) => {
        var dia: IDias[] = [];
        if (x.lunes) {
          dia.push({ id: 1, dia: "L" });
        }
        if (x.martes) {
          dia.push({ id: 2, dia: "M" });
        }
        if (x.miercoles) {
          dia.push({ id: 3, dia: "M" });
        }
        if (x.jueves) {
          dia.push({ id: 4, dia: "J" });
        }
        if (x.viernes) {
          dia.push({ id: 5, dia: "V" });
        }
        if (x.sabado) {
          dia.push({ id: 6, dia: "S" });
        }
        if (x.domingo) {
          dia.push({ id: 7, dia: "D" });
        }
        x.selectedTags = dia;
        return x;
      });
      console.log("se obtuvo la lista de estudios");
      return estudios;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  getPriceStudy = async (filter?: IPriceListInfoFilter) => {
    try {
      const price = await PriceList.getPriceStudy(filter);
      return price;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  getPricePack = async (filter?: IPriceListInfoFilter) => {
    try {
      const price = await PriceList.getPricePack(filter);
      return price;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  create = async (priceList: IPriceListForm) => {
    try {
      const newPriceList = await PriceList.create(priceList);
      alerts.success(messages.created);
      this.priceLists.push(newPriceList);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (priceList: IPriceListForm) => {
    try {
      const updatedPriceList = await PriceList.update(priceList);
      alerts.success(messages.updated);
      const id = this.priceLists.findIndex((x) => x.id === priceList.id);
      if (id !== -1) {
        this.priceLists[id] = updatedPriceList;
      }
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  exportList = async (search: string) => {
    try {
      await PriceList.exportList(search);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportForm = async (id: string) => {
    try {
      await PriceList.exportForm(id);
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  getAllBranch = async () => {
    try {
      var sucursales = await PriceList.getAllBranch();
      return sucursales.map((x) => {
        x.sucursal = true;
        return x;
      });
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return [];
    }
  };

  getAllMedics = async () => {
    try {
      var medicos = await PriceList.getAllMedics();
      return medicos.map((x) => {
        x.medico = true;
        return x;
      });
    } catch (error) {
      alerts.warning(getErrors(error));
      return [];
    }
  };
  getAllCompany = async () => {
    try {
      var compañias = await PriceList.getAllCompany();
      console.log(compañias, "getall, compañi");
      return compañias.map((x) => {
        x.compañia = true;
        return x;
      });
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return [];
    }
  };
}
