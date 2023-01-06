import { Col, Divider, Form, Row } from "antd";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { useStore } from "../../../../app/stores/store";
import InvoiceCompanyHeader from "../InvoiceCompanyHeader";
import InvoiceCompanyData from "./InvoiceCompanyData";
import InvoiceCompanyDetail from "./InvoiceCompanyDetail";
import InvoiceCompanyInfo from "./InvoiceCompanyInfo";
import InvoiceCompanyResume from "./InvoiceCompanyResume";

const InvoiceCompanyCreate = () => {
  const { invoiceCompanyStore } = useStore();
  const { selectedRows, getCompanyById } = invoiceCompanyStore;
  const [company, setCompany] = useState<any>();
  const [totalFinalEstudios, setTotalFinalEstudios] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [estudios, setEstudios] = useState<any[]>([]);
  useEffect(() => {
    const estuiosTotal = selectedRows.flatMap(
      (solicitud) => solicitud.estudios
    );
    setEstudios(estuiosTotal);
  }, [selectedRows]);
  useEffect(() => {
    let totalEstudiosSeleccionados = 0;
    let totalFinalEstudiosSeleccionados = 0;
    let saldoEstudiosSeleccionados = 0;
    if (!!estudios.length) {
      estudios.forEach((estudio: any) => {
        totalFinalEstudiosSeleccionados += estudio?.precioFinal;
        totalEstudiosSeleccionados += estudio?.precio;
        saldoEstudiosSeleccionados += estudio?.saldo;
      });
    }
    setTotalFinalEstudios(totalFinalEstudiosSeleccionados);
    setTotal(totalEstudiosSeleccionados);
    setSaldo(saldoEstudiosSeleccionados);
  }, [estudios]);

  useEffect(() => {
    const loadCompany = async () => {
      const branchId = selectedRows[0]?.companiaId;
      const companyResult = await getCompanyById(branchId);
      console.log("reults", selectedRows.length);
      console.log("company", company);
      setCompany(companyResult);
    };
    loadCompany();
  }, [selectedRows]);
  return (
    <>
      <InvoiceCompanyHeader handleDownload={() => {}} />
      <Divider />
      <InvoiceCompanyInfo company={company} />
      <InvoiceCompanyData
        company={company}
        totalEstudios={total}
        totalFinal={totalFinalEstudios}
      />
      <InvoiceCompanyDetail
        estudios={estudios}
        totalEstudios={totalFinalEstudios}
      />
    </>
  );
};

export default observer(InvoiceCompanyCreate);
