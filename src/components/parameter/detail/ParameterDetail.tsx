import { Divider } from "antd";
import React, { Fragment, useRef, useState,useEffect  } from "react";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../../../app/stores/store";
import { useNavigate,useParams, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import ParameterHeaderForm from "./ParameterHeaderForm";
import ParameterForm from "./ParameterForm";
type UrlParams = {
  id: string;
};
const ParameterDetail = () => {
    const [loading, setLoading] = useState(false);
    const componentRef = useRef<any>();
    const { parameterStore } = useStore();
    const {getById,exportForm,parameter } = parameterStore;
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
	}, [  getById ,id ]);
    const  handleDownload = async() => {
        setLoading(true);
        const succes = await exportForm(id!);
        
        if(succes){
          setLoading(false);
        } 
    };
    return (
        <Fragment>
          <ParameterHeaderForm handlePrint={handlePrint} handleDownload={handleDownload}></ParameterHeaderForm>
          <Divider className="header-divider" />
          <ParameterForm componentRef={componentRef} load={loading}></ParameterForm>
        </Fragment>
      );
}
export default  observer(ParameterDetail);
