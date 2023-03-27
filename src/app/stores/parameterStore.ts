import { makeAutoObservable } from "mobx";
import Parameter from "../api/parameter";
import {
  IParameterForm,
  IParameterList,
  Itipovalor,
  ItipoValorForm,
} from "../models/parameter";
import alerts from "../util/alerts";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";
import history from "../util/history";
import { IReagentList } from "../models/reagent";

export default class ParameterStore {
  constructor() {
    makeAutoObservable(this);
  }
  parameters: IParameterList[] = [];
  parameter?: IParameterForm;
  ValueTipe?: ItipoValorForm;
  ValuesTipe: ItipoValorForm[] = [];
  reagentsSelected: IReagentList[] = [];

  setReagentSelected = (reagentsSelected: IReagentList[]) => {
    this.reagentsSelected = reagentsSelected;
  };

  getReagentSelected = () => {
    return this.reagentsSelected;
  };

  getAll = async (search: string = "all") => {
    try {
      const parameters = await Parameter.getAll(search);
      this.parameters = parameters;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.parameters = [];
    }
  };
  getAllvalues = async (search: string, tipo = "") => {
    try {
      const parameters = await Parameter.getAllValues(search, tipo);
      return parameters;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.ValuesTipe = [];
    }
  };
  getById = async (id: string) => {
    try {
      const rol = await Parameter.getById(id);
      rol.tipoValor =
        rol.tipoValor == null ? "Sin valor" : parseInt(rol.tipoValor);
      this.parameter = rol;
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

  getvalue = async (id: string) => {
    try {
      const value = await Parameter.getValue(id);
      this.ValueTipe = value;
      return value;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        //history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
      //this.roles = [];
    }
  };

  create = async (parameter: IParameterForm) => {
    try {
      parameter.tipoValor = parameter.tipoValor?.toString();
      await Parameter.create(parameter);
      alerts.success(messages.created);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (parameter: IParameterForm) => {
    try {
      parameter.tipoValor = parameter.tipoValor?.toString();
      await Parameter.update(parameter);
      alerts.success(messages.updated);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  updatevalue = async (value: ItipoValorForm) => {
    try {
      await Parameter.updateValue(value);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  addValue = async (value: ItipoValorForm) => {
    try {
      await Parameter.addValue(value);

      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  addvalues = async (values: ItipoValorForm[], parametroId: string) => {
    try {
      var tipovalor: Itipovalor = {
        values: values,
        idParameter: parametroId,
      };
      var success = await Parameter.addValues(tipovalor);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  exportList = async (search: string) => {
    try {
      await Parameter.exportList(search);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };
  exportForm = async (id: string) => {
    try {
      await Parameter.exportForm(id);
      return true;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
}
