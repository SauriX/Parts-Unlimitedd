import { FormInstance } from "antd";
import { IRequestGeneral, IRequestPack, IRequestStudy, IRequestTotal } from "../../../app/models/request";
import alerts from "../../../app/util/alerts";

export const submitGeneral = async (formGeneral: FormInstance<IRequestGeneral>) => {
  try {
    await formGeneral.validateFields();
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
  updateGeneral: (request: IRequestGeneral) => Promise<boolean>
) => {
  return updateGeneral(general);
};
