import { Divider } from "antd";
import React, { Fragment, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import RoleForm from "./RoleForm";
import RoleFormHeader from "./RoleFormHeader";

const NewRole = () => {
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
        <RoleFormHeader handlePrint={handlePrint} handleDownload={()=>{}}/>
        <Divider className="header-divider" />
        <RoleForm componentRef={componentRef} load={printing} />
      </Fragment>
    );
  };

  
export default  NewRole;