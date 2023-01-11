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
    getcfdiOptions,
    cfdiOptions,
    getpaymentMethodOptions,
    getPaymentOptions,
    paymentOptions,
    paymentMethodOptions,
  } = optionStore;
  const { selectedRows, getCompanyById, checkIn } = invoiceCompanyStore;
  const [company, setCompany] = useState<ICompanyForm>();
  const [totalFinalEstudios, setTotalFinalEstudios] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [estudios, setEstudios] = useState<any[]>([]);
  const [currentPaymentMethod, setCurrenPaymentMethod] = useState<any>();

  useEffect(() => {
    getcfdiOptions();
    getpaymentMethodOptions();
    getPaymentOptions();
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
    if (company) {
      const use = cfdiOptions.find((x) => x.value === company.cfdiId);
      const method = paymentOptions.find(
        (x) => x.value === company.formaDePagoId
      )?.label;
      console.log("method", toJS(method));
      const invoiceData = {
        companyId: selectedRows[0]?.companiaId,
        solicitudesId: selectedRows.map((row: any) => row.solicitudId),
        estudios: estudios,
        // formaPago: "" + company?.formaDePagoId,
        formaPago: method,
        tipo: "PUE",
        claveExterna: company?.clave,
        usoCFDI: use?.label,
        cliente: {
          razonSocial: company?.razonSocial,
          RFC: company?.rfc,
          regimenFiscal: company?.regimenFiscal,
          correo: company?.emailEmpresarial,
          telefono: "1234567890",
          codigoPostal: company?.codigoPostal,
          calle: company?.calle,
          numeroExterior: company?.numero,
          numeroInterior: "",
          colonia: company?.colonia,
          ciudad: company?.ciudad,
          municipio: company?.ciudad,
          estado: company?.estado,
          pais: "México",
        },
      };
      console.log("invoice", invoiceData);
      const invoiceInfo = await checkIn(invoiceData);
    }
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
