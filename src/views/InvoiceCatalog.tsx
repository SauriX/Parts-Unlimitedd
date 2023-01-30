import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import InvoiceCatalogFilter from "../components/invoiceCatalog/InvoiceCatalogFilter";
import InvoiceCatalogHeader from "../components/invoiceCatalog/InvoiceCatalogHeader";
import InvoiceCatalogTable from "../components/invoiceCatalog/InvoiceCatalogTable";



const InvoiceCatalog = () => {
  const [loading, setLoading] = useState(false);
  const {invoiceCatalogStore} = useStore();
  const { exportList,search } = invoiceCatalogStore;
 const handleDownload = async () => {
  setLoading(true);
  await exportList(search);
  setLoading(false);
};
  return (
    <Fragment>
      <InvoiceCatalogHeader  handleDownload={handleDownload}/>
      <Divider className="header-divider" />
      <InvoiceCatalogFilter />
      <InvoiceCatalogTable />
    </Fragment>
  );
};

export default observer(InvoiceCatalog);

