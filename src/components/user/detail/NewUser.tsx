import { Divider } from "antd";
import React, { Fragment, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import UserForm from "./UserForm";
import UserFormHeader from "./UserFormHeader";

const NewUser = () => {
  const [printing, setPrinting] = useState(false);

  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setPrinting(true);
    },
    onAfterPrint: () => {
      setPrinting(false);
    },
  });

  return (
    <Fragment>
      <UserFormHeader handlePrint={handlePrint} handleDownload={()=>{}}/>
      <Divider className="header-divider" />
      <UserForm componentRef={componentRef} load={printing} />
    </Fragment>
  );
};

export default NewUser;