import { Divider } from "antd";
import { resolve } from "path";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import BranchForm from "./BranchForm";
import BranchFormHeader from "./BranchFormHeader";
import { observer } from "mobx-react-lite";
import { useStore } from "../../../app/stores/store";

type UrlParams = {
  id: string;
};

const BranchDetail = () => {
  const [loading, setLoading] = useState(false);
  const componentRef = useRef<any>();
  const { branchStore } = useStore();
  const { exportForm,getById,sucursal} = branchStore;
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
       await getById(idUser);
    };
    if (id) {
      readuser(id);
    }
  }, [ getById,id ]);
  const  handleDownload = async() => {
    console.log(sucursal);
    console.log("download");
    setLoading(true);
    const succes = await exportForm(id!,"sucursal");
    
    if(succes){
      setLoading(false);
    }
  };
  return (
    <Fragment>
      <BranchFormHeader  handlePrint={handlePrint} handleDownload={handleDownload}/>
      <Divider className="header-divider" />
      <BranchForm  componentRef={componentRef} load={loading} />
    </Fragment>
  );
};

export default BranchDetail;
