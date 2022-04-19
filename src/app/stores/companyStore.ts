import { IScopes } from "../models/shared";
import { makeAutoObservable } from "mobx";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";
import { ICompanyForm, ICompanyList } from "../models/company";
import Company from "../api/company";

export default class CompanyStore {
    constructor() {
      makeAutoObservable(this);
    }
  
    scopes?: IScopes;
    company: ICompanyList[] = [];
  
    clearScopes = () => {
      this.scopes = undefined;
    };
  
    clearCompany = () => {
      this.company = [];
    };
  
    access = async () => {
      try {
        const scopes = await Company.access();
        this.scopes = scopes;
      } catch (error) {
        alerts.warning(getErrors(error));
        history.push("/forbidden");
      }
    };
  
    getAll = async (search: string) => {
      try {
        const company = await Company.getAll(search);
        this.company = company;
      } catch (error) {
        alerts.warning(getErrors(error));
        this.company = [];
      }
    };
  
    getById = async (id: number) => {
      try {
        const company = await Company.getById(id);
        return company;
      } catch (error) {
        console.log(error);
        alerts.warning(getErrors(error));
      }
    };
  
    create = async (company: ICompanyForm) => {
      try {
        await Company.create(company);
        alerts.success(messages.created);
        return true;
      } catch (error) {
        alerts.warning(getErrors(error));
        return false;
      }
    };
  
    update = async (company: ICompanyForm) => {
      try {
        await Company.update(company);
        alerts.success(messages.updated);
        return true;
      } catch (error: any) {
        alerts.warning(getErrors(error));
        return false;
      }
    };
  
    exportList = async (search: string) => {
      try {
        await Company.exportList(search);
      } catch (error: any) {
        alerts.warning(getErrors(error));
      }
    };
  
    exportForm = async (id: number) => {
      try {
        await Company.exportForm(id, "Formulario");
      } catch (error: any) {
        if (error.status === responses.notFound) {
          history.push("/notFound");
        } else {
          alerts.warning(getErrors(error));
        }
      }
    };
  }