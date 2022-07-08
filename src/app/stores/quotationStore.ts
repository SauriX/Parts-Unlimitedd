import { makeAutoObservable } from "mobx";
import moment from "moment";
import PriceList from "../api/priceList";
import quotation from "../api/quotation";
import Study from "../api/study";
import { IProceedingList } from "../models/Proceeding";
import { IQuotationExpedienteSearch, IQuotationForm, IQuotationList, ISearchQuotation, ISolicitud, SearchQuotationValues } from "../models/quotation";
import { IRequestGeneral } from "../models/request";

import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class QuotationStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  search: ISearchQuotation=new SearchQuotationValues();
  quotatios: IQuotationList[] =[];
  records: IProceedingList[]=[];
  setSearch= (value:ISearchQuotation)=>{
    this.search=value;
};
  clearScopes = () => {
    this.scopes = undefined;
  };

  clearsearch = () => {
    this.search =new SearchQuotationValues();
  };

/*   access = async () => {
    try {
     // const scopes = await Reagent.access();
      this.scopes = scopes;
      return scopes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  }; */


  getAll = async (search: ISearchQuotation) => {
    try {
       const reagents = await quotation.getNow(search);
      this.quotatios = reagents; 
    } catch (error: any) {
      alerts.warning(getErrors(error));
       this.quotatios = []; 
    }
  };
  getExpediente = async (search: IQuotationExpedienteSearch) => {
    try {
       const reagents = await quotation.getRecord(search);
      this.records = reagents; 
    } catch (error: any) {
      alerts.warning(getErrors(error));
       this.records = []; 
    }
  };
  create = async (reagent: IQuotationForm) => {
    try {
      const newReagent = await quotation.create(reagent);
      alerts.success(messages.created);
      // this.reagents.push(newReagent);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  }; 
  printTicket = async () => {
    try {
      await quotation.printTicket();
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  getParameter=async(id:number)=>{
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
  getById = async (id: string) => {
    console.log("getbyid");
     try {
      const reagent = await quotation.getById(id);
      reagent.fechaNacimiento = moment(reagent.fechaNacimiento);
      reagent.estudy?.map(async (x)=>{ 
        var parametros = await this.getParameter(x.estudioId!) ;
        x.parametros= parametros!.parameters;
        x.nombre= parametros!.nombre
        x.indicaciones = parametros?.indicaciones!;
        x.clave= parametros?.clave!;
      });
      console.log(reagent,"cotizacion");
      return reagent;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    } 
  };



  update = async (reagent: IQuotationForm) => {
    try {
      const updatedReagent = await quotation.update(reagent);
      alerts.success(messages.updated);
      
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  createsolictud = async (reagent: ISolicitud) => {
    try {
      const updatedReagent = await quotation.createSolicitud(reagent);
      alerts.success(messages.updated);
      
      return updatedReagent;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
getstudy = async (id:number) =>{
  try {
  const updatedReagent = await PriceList.getPriceStudy(id);
  console.log(updatedReagent,"hola");
  return updatedReagent;
} catch (error: any) {
  alerts.warning(getErrors(error));
  return false;
}
  
};
getPack = async (id:number) =>{
  try {
  const updatedReagent = await PriceList.getPricePack(id);
  console.log(updatedReagent,"hola");
  return updatedReagent;
} catch (error: any) {
  alerts.warning(getErrors(error));
  return false;
}
  
};
 
  exportList = async (search: ISearchQuotation) => {
    try {
      await quotation.exportList(search);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  }; 

   exportForm = async (id: string) => {
    try {
      await quotation.exportForm(id);
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  }; 
}
