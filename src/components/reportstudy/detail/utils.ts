import { FormInstance } from "antd";
import { IRequestGeneral } from "../../../app/models/request";
import alerts from "../../../app/util/alerts";

export const submitGeneral = async (
  formGeneral: FormInstance<IRequestGeneral>,
  autoSave: boolean
) => {
  try {
    await formGeneral.validateFields();
    formGeneral.setFieldValue("guardadoAutomatico", autoSave);
    formGeneral.submit();
    return true;
  } catch (error: any) {
    if (error && error.hasOwnProperty("errorFields")) {
      console.log(error);
      alerts.warning("Por favor complete los campos correctamente");
      error.errorFields.forEach((err: any) => {
        alerts.warning(err.errors.join(", "));
      });
    } else {
      alerts.warning(error.message);
    }
    return false;
  }
};

export const onSubmitGeneral = (
  general: IRequestGeneral,
  showLoader: boolean,
  updateGeneral: (
    request: IRequestGeneral,
    showResult: boolean
  ) => Promise<boolean>
) => {
  return updateGeneral(general, showLoader);
};
