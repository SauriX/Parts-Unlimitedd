import { makeAutoObservable } from "mobx";
import PriceList from "../api/priceList";
import Promotion from "../api/promotion";
import Study from "../api/study";
import { IPriceListEstudioList, IPriceListForm, IPriceListList, ISucMedComList } from "../models/priceList";
import { IPromotionForm, IPromotionList } from "../models/promotion";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class PromotionStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  promotionLists: IPromotionList[] = [];
  sucMedCom: ISucMedComList[] = [];
  studies:IPriceListEstudioList[]=[];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearPriceList = () => {
    this.promotionLists = [];
  };

  access = async () => {
    try {
      const scopes = await Promotion.access();
      this.scopes = scopes;
      return scopes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };
  getAllStudy = async () =>{
    try {
        
        const roles= await Study.getAll("all");
        console.log(roles);
        console.log(roles);
        var studies= roles.map((x) => {
            let data:IPriceListEstudioList = {
                id: x.id,
                clave: x.clave,
                estudioId: x.id,
                nombre: x.nombre,
                area:x.area,
                departamento:x.departamento,
                activo: false,
                precio: 0
            }
            return data;});
            this.studies=studies;
            return studies
            console.log("estudios");
            console.log(this.studies);
      } catch (error: any) {
        alerts.warning(getErrors(error));
        this.studies = [];
      }
  };

  getAll = async (search: string) => {
    try {
      const priceLists = await Promotion.getAll(search);
      this.promotionLists = priceLists;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.promotionLists = [];
    }
  };

  getById = async (id: number) => {
    try {
      const priceList = await Promotion.getById(id);
      return priceList;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  getPriceById = async (id: string) => {
    try {
      const priceList = await PriceList.getById(id);
      return priceList;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  create = async (priceList: IPromotionForm) => {
    try {
      const newPriceList = await Promotion.create(priceList);
      alerts.success(messages.created);
      this.promotionLists.push(newPriceList);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (priceList: IPromotionForm) => {
    try {
      const updatedPriceList = await Promotion.update(priceList);
      alerts.success(messages.updated);
      const id = this.promotionLists.findIndex((x) => x.id === priceList.id);
      if (id !== -1) {
        this.promotionLists[id] = updatedPriceList;
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


}
