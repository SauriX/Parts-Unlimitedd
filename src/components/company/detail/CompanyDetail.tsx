import { Divider, Table } from "antd";
import { resolve } from "path";
import React, { Fragment, useEffect, useRef, useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { IContactForm } from "../../../app/models/contact";
import CompanyForm from "./CompanyForm";
import CompanyFormHeader from "./CompanyFormHeader";

type UrlParams = {
  id: string;
};

const CompanyDetail = () => {
  let navigate = useNavigate();
  const [contacts, setContacts] = useState<IContactForm[]>([]);
  const [searchParams, setSearchParams] = useSearchParams();

  const [printing, setPrinting] = useState(false);

  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setPrinting(true);
      return new Promise((resolve: any) => {
        setTimeout(() => {
          resolve();
        }, 200);
      });
    },
    onAfterPrint: () => {
      setPrinting(false);
    },
  });

  const { id } = useParams<UrlParams>();
  const companyId = !id ? undefined : id;

  useEffect(() => {
    console.log(companyId);
    // if (companyId === undefined) {
    //   navigate("/notFound");
    // }
  }, [navigate, companyId]);

  //if (companyId === undefined) return null;

  return (
    <Fragment>
      <CompanyFormHeader id={companyId!} handlePrint={handlePrint} />
      <Divider className="header-divider" />
      <CompanyForm
        id={companyId!}
        componentRef={componentRef}
        printing={printing}
      />
      {/* <Divider className="header-divider" /> */}
      {/* <Table<IContactForm>
            size="large"
            rowKey={(record) => record.tempId ?? record.id}
            columns={columns.slice(0, 5)}
            dataSource={[...contacts]}
          /> */}
    </Fragment>
  );
};

export default CompanyDetail;
