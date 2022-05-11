import { Divider } from "antd";
import { resolve } from "path";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";
import PackFormHeader from "./PackFormHeader";
import PackForm from "./PackForm";

type UrlParams = {
  id: string;
};

const PackDetail = () => {
  const [loading, setLoading] = useState(false);
  const componentRef = useRef<any>();
  const {  } = useStore();

  let { id } = useParams<UrlParams>();
   
 
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setLoading(true);
      return new Promise((resolve: any) => {
        setTimeout(() => {
          resolve();
        }, 200);
      });
    },
    onAfterPrint: () => {
      setLoading(false);
    },
  });
  useEffect( () => {
    const readuser = async (idUser: string) => {
       //await getById(idUser);
    };
    if (id) {
      readuser(id);
    }
  }, [/*  getById,id  */]);
  const  handleDownload = async() => {
    
    console.log("download");
    setLoading(true);
    //const succes = await exportForm(id!,"sucursal");
    
/*     if(succes){
      setLoading(false);
    } */
  };
  return (
    <Fragment>
    <PackFormHeader  handlePrint={handlePrint} handleDownload={handleDownload}/>
      <Divider className="header-divider" />
    <PackForm  componentRef={componentRef} load={loading} />
    </Fragment>
  );
};

export default observer(PackDetail);
