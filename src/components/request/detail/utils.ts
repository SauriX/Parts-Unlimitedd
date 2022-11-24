import { FormInstance } from "antd";
import { IRequestGeneral } from "../../../app/models/request";
import alerts from "../../../app/util/alerts";

export const submitGeneral = async (
  formGeneral: FormInstance<IRequestGeneral>,
  showResult: boolean
) => {
  try {
    await formGeneral.validateFields();
    formGeneral.setFieldValue("showResult", showResult);
    formGeneral.submit();
    return true;
  } catch (error: any) {
    if (error && error.hasOwnProperty("errorFields")) {
      alerts.warning("Por favor complete los campos correctamente");
    } else {
      alerts.warning(error.message);
    }
    return false;
  }
};

export const onSubmitGeneral = (
  general: IRequestGeneral,
  showResult: boolean,
  updateGeneral: (
    request: IRequestGeneral,
    showResult: boolean
  ) => Promise<boolean>
) => {
  return updateGeneral(general, showResult);
};
