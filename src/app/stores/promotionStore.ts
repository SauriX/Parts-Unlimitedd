import { makeAutoObservable } from "mobx";
import moment from "moment";
import Promotion from "../api/promotion";
import { IPriceListEstudioList, ISucMedComList } from "../models/priceList";
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
  promotions: IPromotionList[] = [];
  sucMedCom: ISucMedComList[] = [];
  studies: IPriceListEstudioList[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearPriceList = () => {
    this.promotions = [];
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

  getAll = async (search: string) => {
    try {
      const promotions = await Promotion.getAll(search);
      this.promotions = promotions;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.promotions = [];
    }
  };

  getById = async (id: number) => {
    try {
      const priceList = await Promotion.getById(id);
      priceList.fechaDescuento = [
        moment(priceList.fechaInicial),
        moment(priceList.fechaFinal),
      ];
      return priceList;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  getStudies = async (promo: IPromotionForm, initial: boolean) => {
    try {
      const studies = await Promotion.getStudies(promo, initial);
      return studies;
    } catch (error: any) {
      return [];
    }
  };

  create = async (promotion: IPromotionForm) => {
    try {
      const newPromotion = await Promotion.create(promotion);
      alerts.success(messages.created);
      this.promotions.push(newPromotion);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (priceList: IPromotionForm) => {
    try {
      const updatedPromotion = await Promotion.update(priceList);
      alerts.success(messages.updated);
      const id = this.promotions.findIndex((x) => x.id === priceList.id);
      if (id !== -1) {
        this.promotions[id] = updatedPromotion;
      }
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  exportList = async (search: string) => {
    try {
      await Promotion.exportList(search);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportForm = async (id: number) => {
    try {
      await Promotion.exportForm(id);
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
}
