import { Divider } from "antd";
import React, { Fragment, useRef, useState,useEffect  } from "react";
import { useReactToPrint } from "react-to-print";
import { useStore } from "../../../app/stores/store";
import { useNavigate,useParams, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";
import StudyFormHeader from "./StudyFormHeader";
import StudyForm from "./StudyForm";
import { IStudyForm, StudyFormValues } from "../../../app/models/study";
type UrlParams = {
  id: string;
};
const StudyDetail = () => {
    const [loading, setLoading] = useState(false);
    const [values, setValues] = useState<IStudyForm>(new StudyFormValues());
    const componentRef = useRef<any>();
    const { studyStore } = useStore();
    const { getById,exportForm } = studyStore;
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
		const readuser = async (id: number) => {
			var study=await getById(id);
      setValues(study!);
		};
		if (id) {
      
			readuser(Number(id));
		}
	}, [   getById ,id ]);
    const  handleDownload = async() => {
        setLoading(true);
        const succes =  await exportForm(values!.id,values!.clave);
        
        if(succes){
          setLoading(false);
        } 
    };
    return (
        <Fragment>
            <StudyFormHeader handlePrint={handlePrint} handleList={handleDownload}></StudyFormHeader>
            <Divider className="header-divider" />
            <StudyForm componentRef={componentRef} load={loading}></StudyForm>
        </Fragment>
      );
}
export default  observer(StudyDetail);
