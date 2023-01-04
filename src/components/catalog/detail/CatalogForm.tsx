import React, { FC } from "react";
import { IOptionsCatalog } from "../../../app/models/shared";
import CatalogAreaForm from "../type/area/CatalogAreaForm";
import CatalogBudgetForm from "../type/budget/CatalogBudgetForm";
import CatalogDescriptionForm from "../type/description/CatalogDescriptionForm";
import CatalogDimensionForm from "../type/dimension/CatalogDimensionForm";
import CatalogNormalForm from "../type/normal/CatalogNormalForm";

type CatalogFormProps = {
  id: number;
  catalog: IOptionsCatalog;
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
};

const CatalogForm: FC<CatalogFormProps> = ({ id, catalog, componentRef, printing }) => {
  return !catalog ? null : catalog.type === "normal" ? (
    <CatalogNormalForm
      id={id}
      componentRef={componentRef}
      printing={printing}
      catalogName={catalog.value.toString()}
    />
  ) : catalog.type === "description" ? (
    <CatalogDescriptionForm
      id={id}
      componentRef={componentRef}
      printing={printing}
      catalogName={catalog.value.toString()}
    />
  ) : catalog.type === "area" ? (
    <CatalogAreaForm id={id} componentRef={componentRef} printing={printing} />
  ) : catalog.type === "dimension" ? (
    <CatalogDimensionForm id={id} componentRef={componentRef} printing={printing} />
  ) : catalog.type === "costofijo" ? (
    <CatalogBudgetForm id={id} componentRef={componentRef} printing={printing} />
  ) : null;
};

export default CatalogForm;
