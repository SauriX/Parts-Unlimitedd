import { makeAutoObservable } from "mobx";
import Pack from "../api/pack";
import PriceList from "../api/priceList";
import Study from "../api/study";
import { IPriceListEstudioList, IPriceListForm, IPriceListList, ISucMedComList } from "../models/priceList";
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
      const roles = await Study.getAll("all");
      console.log(roles);
      const activos = roles.filter((x) => x.activo);
      console.log(roles);
      var studies = activos.map((x) => {
        let data: IPriceListEstudioList = {
          id: x.id,
          estudioId: x.id,
          clave: x.clave,
          nombre: x.nombre,
          area: x.area,
          departamento: x.departamento,
          activo: false,
          precio: 0,
        };
        return data;
      });
      this.studies = studies;
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

  getPriceStudy = async (id: number) => {
    try {
      const price = await PriceList.getPriceStudy(id);
      return price;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  getPricePack = async (id: number) => {
    try {
      const price = await PriceList.getPricePack(id);
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
