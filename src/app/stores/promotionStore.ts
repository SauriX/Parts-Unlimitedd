import { makeAutoObservable } from "mobx";
import PriceList from "../api/priceList";
import Promotion from "../api/promotion";
import Study from "../api/study";
import { IPriceListEstudioList, IPriceListForm, IPriceListList, ISucMedComList } from "../models/priceList";
import { IDias, IPromotionForm, IPromotionList } from "../models/promotion";
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
      console.log(scopes);
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
     var estudios= priceList.estudio.map((x)=>{
        var dia: IDias[]=[];
        if(x.lunes){
          dia.push({id:1,dia:"L"});
        }
        if(x.martes){
          dia.push({id:2,dia:"M"});
        }
        if(x.miercoles){
          dia.push({id:3,dia:"M"});
        }
        if(x.jueves){
          dia.push({id:4,dia:"J"});
        }
        if(x.viernes){
          dia.push({id:5,dia:"V"});
        }
        if(x.sabado){
          dia.push({id:6,dia:"S"});
        }
        if(x.domingo){
          dia.push({id:7,dia:"D"});
        }
        x.selectedTags = dia;
        return x;
      }); 
      console.log("estudios");
      console.log(estudios);
      priceList.estudio=estudios;
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
     var estudios = priceList.estudio.map(x=>{
        x.selectedTags.map(t=>{
          if(t.id==1){
            x.lunes= true;
          }
        });
        x.selectedTags.map(t=>{
          if(t.id==2){
            x.martes= true;
          }
        });
        x.selectedTags.map(t=>{
          if(t.id==3){
            x.miercoles= true;
          }
        });
        x.selectedTags.map(t=>{
          if(t.id==4){
            x.jueves= true;
          }
        });
        x.selectedTags.map(t=>{
          if(t.id==5){
            x.viernes= true;
          }
        });
        x.selectedTags.map(t=>{
          if(t.id==6){
            x.sabado= true;
          }
        });
        x.selectedTags.map(t=>{
          if(t.id== 7){
            x.domingo= true;
          }
        });

        return x;
      });

      priceList.estudio = estudios;
      console.log(priceList);
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
      var estudios = priceList.estudio.map(x=>{
        x.selectedTags.map(t=>{
          if(t.id==1){
            x.lunes= true;
          }
        });
        x.selectedTags.map(t=>{
          if(t.id==2){
            x.martes= true;
          }
        });
        x.selectedTags.map(t=>{
          if(t.id==3){
            x.miercoles= true;
          }
        });
        x.selectedTags.map(t=>{
          if(t.id==4){
            x.jueves= true;
          }
        });
        x.selectedTags.map(t=>{
          if(t.id==5){
            x.viernes= true;
          }
        });
        x.selectedTags.map(t=>{
          if(t.id==6){
            x.sabado= true;
          }
        });
        x.selectedTags.map(t=>{
          if(t.id== 7){
            x.domingo= true;
          }
        });

        return x;
      });
      priceList.estudio = estudios;
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
      await Promotion.exportList(search);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportForm = async (id: string) => {
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
