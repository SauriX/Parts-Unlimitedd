import { Col, Divider, Form, Row } from "antd";
import { toJS } from "mobx";
import { observer } from "mobx-react-lite";
import { useEffect, useState } from "react";
import { ICompanyForm } from "../../../../app/models/company";
import { useStore } from "../../../../app/stores/store";
import InvoiceCompanyHeader from "../InvoiceCompanyHeader";
import InvoiceCompanyData from "./InvoiceCompanyData";
import InvoiceCompanyDetail from "./InvoiceCompanyDetail";
import InvoiceCompanyInfo from "./InvoiceCompanyInfo";

const InvoiceCompanyCreate = () => {
  const { invoiceCompanyStore, optionStore } = useStore();
  const {
    bankOptions,
    paymentMethodOptions,
    cfdiOptions,
    getbankOptions,
    getpaymentMethodOptions,
    getcfdiOptions,
  } = optionStore;
  const { selectedRows, getCompanyById, checkIn } = invoiceCompanyStore;
  const [company, setCompany] = useState<ICompanyForm>();
  const [totalFinalEstudios, setTotalFinalEstudios] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [estudios, setEstudios] = useState<any[]>([]);
  useEffect(() => {
    getbankOptions();
    getpaymentMethodOptions();
    getcfdiOptions();
  }, []);
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

      setCompany(companyResult);
    };
    loadCompany();
  }, [selectedRows]);
  const createInvoice = async () => {
    console.log("creating invoice...");
    console.log("company", toJS(company));
    console.log("totalrow", toJS(selectedRows));
    const invoiceData = {
      companyId: selectedRows[0]?.companiaId,
      solicitudesId: selectedRows.map((row: any) => row.solicitudId),
      estudios: estudios,
      formaPago: "" + company?.formaDePagoId,
      tipo: "",
      claveExterna: company?.clave,
      usoCFDI: "",
      cliente: {
        razonSocial: company?.razonSocial,
        RFC: company?.razonSocial,
        regimenFiscal: "",
        correo: "",
        telefono: "",
        domicilio: {
          codigoPostal: company?.codigoPostal,
          calle: "",
          numeroExterior: "",
          numeroInterior: "",
          colonia: "",
          ciudad: company?.ciudad,
          municipio: "",
          estado: company?.estado,
          pais: "",
        },
      },
    };
    console.log("invoice", invoiceData);
    const invoiceInfo = await checkIn(invoiceData);
  };
  return (
    <>
      <InvoiceCompanyHeader handleDownload={() => {}} />
      <Divider />
      <InvoiceCompanyInfo company={company} />
      <InvoiceCompanyData
        company={company}
        totalEstudios={total}
        totalFinal={totalFinalEstudios}
        createInvoice={createInvoice}
      />
      <InvoiceCompanyDetail
        estudios={estudios}
        totalEstudios={totalFinalEstudios}
      />
    </>
  );
};

export default observer(InvoiceCompanyCreate);
