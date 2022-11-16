import { Divider } from "antd";
import { observer } from "mobx-react-lite";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../app/stores/store";
import QuotationFilter from "../components/quotation/list/QuotationFilter";
import QuotationHeader from "../components/quotation/list/QuotationHeader";
import QuotationTable from "../components/quotation/list/QuotationTable";

const Quotation = () => {
  const {} = useStore();

  const [loading, setLoading] = useState(false);

  return (
    <Fragment>
      <QuotationHeader />
      <Divider className="header-divider" />
      <QuotationFilter />
      <QuotationTable />
    </Fragment>
  );
};

export default observer(Quotation);

// import { Divider } from "antd";
// import React, { Fragment, useEffect, useRef, useState } from "react";
// import { useSearchParams } from "react-router-dom";
// import { useReactToPrint } from "react-to-print";
// import { useStore } from "../app/stores/store";
// import RequestHeader from "../components/request/list/RequestHeader";
// import RequestFilter from "../components/request/list/RequestFilter";
// import RequestTable from "../components/request/list/RequestTable";

// const Request = () => {
//   const {} = useStore();

//   const [loading, setLoading] = useState(false);

//   return (
//     <Fragment>
//       <RequestHeader />
//       <Divider className="header-divider" />
//       <RequestFilter />
//       <RequestTable />
//     </Fragment>
//   );
// };

// export default Request;
