import React, { FC } from "react";
import { IOptionsCatalog } from "../../app/models/shared";
import CatalogNormalTable from "./type/normal/CatalogNormalTable";
import CatalogDescriptionTable from "./type/description/CatalogDescriptionTable";
import CatalogAreaTable from "./type/area/CatalogAreaTable";
import CatalogDimensionTable from "./type/dimension/CatalogDimensionTable";
import { observer } from "mobx-react-lite";
import CatalogBudgetTable from "./type/budget/CatalogBudgetTable";

type CatalogTableProps = {
  componentRef: React.MutableRefObject<any>;
  printing: boolean;
  catalog: IOptionsCatalog | undefined;
};

const CatalogTable: FC<CatalogTableProps> = ({ componentRef, printing, catalog }) => {
  return !catalog ? null : catalog.type === "normal" ? (
    <CatalogNormalTable
      componentRef={componentRef}
      printing={printing}
      catalogName={catalog.value.toString()}
    />
  ) : catalog.type === "description" ? (
    <CatalogDescriptionTable
      componentRef={componentRef}
      printing={printing}
      catalogName={catalog.value.toString()}
    />
  ) : catalog.type === "area" ? (
    <CatalogAreaTable componentRef={componentRef} printing={printing} />
  ) : catalog.type === "dimension" ? (
    <CatalogDimensionTable componentRef={componentRef} printing={printing} />
  ) : catalog.type === "budget" ? (
    <CatalogBudgetTable componentRef={componentRef} printing={printing}/>
  ) : null;
};

export default observer(CatalogTable);
