import Search from "antd/lib/transfer/search";
import { makeAutoObservable } from "mobx";
import { getParsedCommandLineOfConfigFile } from "typescript";
import Equipment from "../api/equipment";
import Equipmentmantain from "../api/equipmentmantain";
import { IEquipmentForm, IEquipmentList } from "../models/equipment";
import { ImantainForm, IMantainList, ISearchMantain } from "../models/equipmentMantain";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class EquipmentMantainStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  equipment: IMantainList[] = [];

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearEquipments = () => {
    this.equipment = [];
  };

  access = async () => {
    try {
      const scopes = await Equipment.access();
      this.scopes = scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getAll = async (search: ISearchMantain) => {
    try {
      const equipments = await Equipmentmantain.getAll(search);
      this.equipment = equipments;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.equipment = [];
    }
  };

  getById = async (id: string) => {
    try {
      const equipments = await Equipmentmantain.getById(id);
      return equipments;
    } catch (error) {
      console.log(error);
      alerts.warning(getErrors(error));
    }
  };

  create = async (equipments: ImantainForm) => {
    try {
      await Equipmentmantain.create(equipments);
      alerts.success(messages.created);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (equipments: ImantainForm) => {
    try {
      await Equipmentmantain.update(equipments);
      alerts.success(messages.updated);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  exportList = async (search: string) => {
    try {
      await Equipment.exportList(search);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  saveImage = async (request: FormData) => {
    try {
      await Equipmentmantain.saveImage(request);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };
  exportForm = async (id: number) => {
    try {
      await Equipment.exportForm(id);
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

}
