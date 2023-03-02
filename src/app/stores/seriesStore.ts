import { makeAutoObservable } from "mobx";
import Series from "../api/series";
import {
  ISeries,
  ISeriesFilter,
  ISeriesList,
  ISeriesNewForm,
  ITicketSerie,
  SeriesFilterValues,
  SeriesValues,
} from "../models/series";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import { getErrors } from "../util/utils";

export default class SeriesStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  series: ISeries = new SeriesValues();
  seriesList: ISeriesList[] = [];
  formValues: ISeriesFilter = new SeriesFilterValues();
  loading: boolean = false;
  seriesType: number = 0;

  clearScopes = () => {
    this.scopes = undefined;
  };

  setFormValues = (newFormValues: ISeriesFilter) => {
    this.formValues = newFormValues;
  };

  setSeriesType = (type: number) => {
    this.seriesType = type;
  };

  access = async () => {
    try {
      const scopes = await Series.access();
      this.scopes = scopes;
      return scopes;
    } catch (error) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  getByFilter = async (filter: ISeriesFilter) => {
    try {
      this.loading = true;
      const series = await Series.getByFilter(filter);
      this.seriesList = series;
      return series;
    } catch (error) {
      alerts.warning(getErrors(error));
      this.seriesList = [];
    } finally {
      this.loading = false;
    }
  };

  getNewForm = async (newForm: ISeriesNewForm) => {
    try {
      this.loading = true;
      const serie = await Series.getNewForm(newForm);
      return serie;
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loading = false;
    }
  };

  getById = async (id: number, tipoSerie: number) => {
    try {
      this.loading = true;
      const serie = await Series.getById(id, tipoSerie);
      return serie;
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loading = false;
    }
  };

  getBranch = async (branchId: string) => {
    try {
      this.loading = true;
      const serie = await Series.getBranch(branchId);
      return serie;
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loading = false;
    }
  };

  getSeries = async(branchId: string) => {
    try {
      this.loading = true;
      const serie = await Series.getSeries(branchId);
      return serie;
    } catch (error) {
      alerts.warning(getErrors(error));
    } finally {
      this.loading = false;
    }
  };

  createInvoice = async (serie: FormData) => {
    try {
      await Series.createInvoice(serie);
      alerts.success(messages.created);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  updateInvoice = async (serie: FormData) => {
    try {
      await Series.updateInvoice(serie);
      alerts.success(messages.updated);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  createTicket = async (ticket: ITicketSerie) => {
    try {
      await Series.createTicket(ticket);
      alerts.success(messages.created);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  updateTicket = async (ticket: ITicketSerie) => {
    try {
      await Series.updateTicket(ticket);
      alerts.success(messages.updated);
      return true;
    } catch (error) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  exportList = async (filter: ISeriesFilter) => {
    try {
      await Series.exportList(filter);
    } catch (error) {
      alerts.warning(getErrors(error));
    }
  };
}
