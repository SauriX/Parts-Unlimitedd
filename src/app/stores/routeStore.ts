import { makeAutoObservable } from "mobx";
import Route from "../api/route";
import Study from "../api/study";
import { IRouteEstudioList, IRouteForm, IRouteList } from "../models/route";
import { IScopes } from "../models/shared";
import alerts from "../util/alerts";
import history from "../util/history";
import messages from "../util/messages";
import responses from "../util/responses";
import { getErrors } from "../util/utils";

export default class RouteStore {
  constructor() {
    makeAutoObservable(this);
  }

  scopes?: IScopes;
  routes: IRouteList[] = [];
  foundRoutes: IRouteForm[] = [];
  studies: IRouteEstudioList[] = [];
  loadingRoutes: boolean = false

  clearScopes = () => {
    this.scopes = undefined;
  };

  clearRoute = () => {
    this.routes = [];
  };

  access = async () => {
    try {
      const scopes = await Route.access();
      this.scopes = scopes;
      return scopes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      history.push("/forbidden");
    }
  };

  find = async (route: IRouteForm) => {
    try {
      const foundRoutes = await Route.find(route);
      this.foundRoutes = foundRoutes;
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  getAll = async (search: string) => {
    try {
      this.loadingRoutes = true
      const routes = await Route.getAll(search);
      this.routes = routes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.routes = [];
    } finally {
      this.loadingRoutes = false
    }
  };

  getAllStudy = async () => {
    try {
      const roles = await Study.getAll("all");
      const activos = roles.filter((x) => x.activo);
      var studies = activos.map((x) => {
        let data: IRouteEstudioList = {
          id: x.id,
          clave: x.clave,
          nombre: x.nombre,
          area: x.area,
          departamento: x.departamento,
          activo: false,
        };
        return data;
      });
      this.studies = studies;
      return studies;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.routes = [];
    }
  };

  getById = async (id: string) => {
    try {
      const route = await Route.getById(id);
      return route;
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };

  getByOriginDestination = async (destination: string, origin: string) => {
    try {
      this.loadingRoutes = true
      const foundRoutes = await Route.getByOriginDestination(
        destination,
        origin
      );
      this.foundRoutes = foundRoutes;
      return foundRoutes;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      this.foundRoutes = [];
    } finally {
      this.loadingRoutes = false
    }
  };

  create = async (route: IRouteForm) => {
    try {
      const newRoute = await Route.create(route);
      alerts.success(messages.created);
      this.routes.push(newRoute);
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  update = async (route: IRouteForm) => {
    try {
      const updatedRoute = await Route.update(route);
      alerts.success(messages.updated);
      const id = this.routes.findIndex((x) => x.id === route.id);
      if (id !== -1) {
        this.routes[id] = updatedRoute;
      }
      return true;
    } catch (error: any) {
      alerts.warning(getErrors(error));
      return false;
    }
  };

  exportList = async (search: string) => {
    try {
      await Route.exportList(search);
    } catch (error: any) {
      alerts.warning(getErrors(error));
    }
  };

  exportForm = async (id: string) => {
    try {
      await Route.exportForm(id);
    } catch (error: any) {
      if (error.status === responses.notFound) {
        history.push("/notFound");
      } else {
        alerts.warning(getErrors(error));
      }
    }
  };
}
