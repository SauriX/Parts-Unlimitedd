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
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";

type UrlParams = {
  id: string;
  tipo: string;
};

const InvoiceCompanyCreate = () => {
  const navigate = useNavigate();
  const { invoiceCompanyStore, optionStore } = useStore();
  const {
    getcfdiOptions,
    cfdiOptions,
    getpaymentMethodOptions,
    getPaymentOptions,
    paymentOptions,
    paymentMethodOptions,
  } = optionStore;

  const { selectedRows, getCompanyById, checkIn, invoices } =
    invoiceCompanyStore;
  const [company, setCompany] = useState<ICompanyForm>();
  const [totalFinalEstudios, setTotalFinalEstudios] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [estudios, setEstudios] = useState<any[]>([]);
  const [currentPaymentMethod, setCurrenPaymentMethod] = useState<any>();
  const [selectRequests, setSelectedRequests] = useState<any>();
  let { id, tipo } = useParams<UrlParams>();
  useEffect(() => {
    getcfdiOptions();
    getpaymentMethodOptions();
    getPaymentOptions();
    if (tipo === "company") {
      if (id !== "new") {
        console.log("ID", id);
        let selectedRequestInvoice = invoices.solicitudes
          .find((invoice: any) => invoice.solicitudId === id)
          .facturas.find(
            (invoice: any) => invoice.tipo === "Compañia"
          )?.solicitudesId;
        let filterRequests = invoices.solicitudes.filter((invoice: any) =>
          selectedRequestInvoice.includes(invoice.solicitudId)
        );

        console.log("filterrequest", toJS(filterRequests));
        setSelectedRequests([...filterRequests]);
      }
    }
    if (tipo === "request") {
      selectedRows.forEach((element) => {
        console.log(toJS(element));
      });
    }
  }, [id]);

  useEffect(() => {
    if (id === "new") {
      const estuiosTotal = selectedRows.flatMap(
        (solicitud) => solicitud.estudios
      );
      console.log("estudios", toJS(estuiosTotal));
      setEstudios(estuiosTotal);
    } else {
      if (!!selectRequests) {
        const estuiosTotal = selectRequests.flatMap(
          (solicitud: any) => solicitud.estudios
        );
        console.log("estudios", toJS(estuiosTotal));
        setEstudios(estuiosTotal);
      }
    }
  }, [selectedRows, selectRequests]);

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
      let companyResult;
      if (id === "new") {
        const branchId = selectedRows[0]?.companiaId;
        companyResult = await getCompanyById(branchId);
      } else {
        if (!!selectRequests) {
          const branchId = selectRequests[0]?.companiaId;
          companyResult = await getCompanyById(branchId);
        }
      }

      setCompany(companyResult);
    };
    loadCompany();
  }, [selectedRows, selectRequests]);

  const createInvoice = async () => {
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

      navigate(`/invoice`);
    }
  };
  const getEstatusFactura = () => {
    if (!!selectRequests) {
      if (id !== "new") {
        return selectRequests[0].facturas[0].estatus.nombre;
      }
    }
  };
  const getFacturapi = () => {
    if (!!selectRequests) {
      if (id !== "new") {
        return selectRequests[0].facturas[0].facturapiId;
      }
    }
  };
  return (
    <>
      <InvoiceCompanyHeader handleDownload={() => {}} />
      <Divider />
      <InvoiceCompanyInfo
        company={company}
        facturapiId={getFacturapi()}
        estatusFactura={getEstatusFactura()}
      />
      <InvoiceCompanyData
        company={company}
        totalEstudios={total}
        totalFinal={totalFinalEstudios}
        createInvoice={createInvoice}
        invoice={id!}
        estatusFactura={getEstatusFactura()}
        facturapiId={getFacturapi()}
      />
      <InvoiceCompanyDetail
        estudios={estudios}
        totalEstudios={totalFinalEstudios}
      />
    </>
  );
};

export default observer(InvoiceCompanyCreate);
