import { Col, Divider, Form, Row, Spin } from "antd";
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
import alerts from "../../../../app/util/alerts";
import history from "../../../../app/util/history";
import InvoiceFreeInfo from "../../InvoiceFree/InvoiceFreeInfo";
import InvoiceFreeData from "../../InvoiceFree/InvoiceFreeData";
import InvoiceFreeDetail from "../../InvoiceFree/InvoiceFreeDetail";

type UrlParams = {
  id: string;
  tipo: string;
};

const InvoiceCompanyCreate = () => {
  const navigate = useNavigate();
  const { invoiceCompanyStore, optionStore, invoiceFreeStore } = useStore();
  const {
    getcfdiOptions,
    cfdiOptions,
    getpaymentMethodOptions,
    getPaymentOptions,
    paymentOptions,
    paymentMethodOptions,
  } = optionStore;

  const {
    selectedRows,
    getCompanyById,
    checkIn,
    invoices,
    taxData,
    detailInvoice,
    configurationInvoice,
    nombreSeleccionado,
    consecutiveBySerie,
    getInvoice,
    invoice,
    selectedRequests,
  } = invoiceCompanyStore;
  const { isLoadingFree } = invoiceFreeStore;
  const [company, setCompany] = useState<ICompanyForm>();
  const [totalFinalEstudios, setTotalFinalEstudios] = useState<number>(0);
  const [total, setTotal] = useState<number>(0);
  const [saldo, setSaldo] = useState<number>(0);
  const [estudios, setEstudios] = useState<any[]>([]);
  const [currentPaymentMethod, setCurrenPaymentMethod] = useState<any>();
  const [selectRequests, setSelectedRequests] = useState<any>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  let { id, tipo } = useParams<UrlParams>();
  useEffect(() => {
    setIsLoading(isLoadingFree);
  }, [isLoadingFree]);
  useEffect(() => {
    getcfdiOptions();
    getpaymentMethodOptions();
    getPaymentOptions();

    if (id !== "new") {
      getInvoice(id!);
    }
  }, [id]);

  useEffect(() => {
    if (id === "new") {
      const estuiosTotal = selectedRows.flatMap(
        (solicitud) => solicitud.estudios
      );
      setEstudios(estuiosTotal);
    } else {
      if (!!selectRequests) {
        const estuiosTotal = selectRequests.flatMap(
          (solicitud: any) => solicitud.estudios
        );
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
    if (!!selectedRows.length) {
      loadCompany();
    }
  }, [selectedRows, selectRequests]);

  const createInvoice = async (formDataValues: any) => {
    if (tipo === "company") {
      const use = cfdiOptions.find((x) => x.value === company?.cfdiId);
      const method = paymentOptions.find(
        (x) => x.value === company?.formaDePagoId
      )?.label;
      const invoiceData = {
        tipoFactura: tipo,
        origenFactura: tipo,
        companyId: selectedRows[0]?.companiaId,
        solicitudesId: selectedRows.map((row: any) => row.solicitudId),
        detalles: detailInvoice,
        serie: formDataValues.serieCFDI,
        bancoId: formDataValues.bancoId,
        diasCredito: formDataValues.diasCredito,
        formaPagoId: formDataValues.formaDePagoId,
        numeroCuenta: formDataValues.numeroDeCuenta,
        formaPago: method,
        tipoPago: "PUE",
        tipo: "PUE",
        claveExterna: company?.clave,
        usoCFDI: use?.label,

        tipoDesgloce: configurationInvoice,
        cantidadTotal: total,
        subtotal: total - (total * 16) / 100,
        IVA: (total * 16) / 100,
        consecutivo: +consecutiveBySerie,
        usuario: "",
        fecha: "",
        hora: "",
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

      const invoiceInfo = await checkIn(invoiceData);
      if (!!invoiceInfo?.facturapiId) {
        alerts.success("Factura creada conrrectamente");
        history.push(`/invoice/${tipo}/${invoiceInfo?.facturapiId}`);
      }
    }
    if (tipo === "request") {
      if (!nombreSeleccionado) {
        alerts.info("Debe seleccionar un usuario");
        return;
      }
      if (!Object.keys(taxData).length) {
        alerts.info("Debe seleccionar los datos fiscales del usuario");
        return;
      }
      if (!formDataValues.formaDePagoId) {
        alerts.info("Seleccione una forma de pago");
        return;
      }
      if (!formDataValues.cfdiId) {
        alerts.info("Seleccione un uso de CFDI");
        return;
      }
      const use = cfdiOptions.find((x) => x.value === formDataValues?.cfdiId);
      const method = paymentOptions.find(
        (x) => x.value === formDataValues?.formaDePagoId
      )?.label;

      const invoiceData = {
        tipoFactura: tipo,
        origenFactura: tipo,
        companyId: selectedRows[0]?.companiaId,
        nombre: selectedRequests[0].nombre,
        solicitudesId: selectedRows.map((row: any) => row.solicitudId),
        detalles: detailInvoice,
        taxDataId: taxData.id,
        expedienteId: nombreSeleccionado,
        formaPagoId: "",
        formaPago: formDataValues?.formaDePagoId,
        numeroCuenta: "",
        serie: formDataValues.serieCFDI,
        usoCFDI: use?.label,
        tipoDesgloce: configurationInvoice,
        cantidadTotal: total,
        subtotal: total - (total * 16) / 100,
        IVA: (total * 16) / 100,
        consecutivo: +consecutiveBySerie,
        usuario: "",
        fecha: "",
        hora: "",

        tipoPago: "PUE",
        tipo: "PUE",
        claveExterna: company?.clave,
        cliente: {
          razonSocial: taxData?.razonSocial,
          RFC: taxData?.rfc,
          regimenFiscal: taxData?.regimenFiscal,
          correo: taxData?.correo,
          telefono: "1234567890", // => tomarlo de expdientes
          codigoPostal: taxData?.cp,
          calle: taxData?.calle,
          // numeroExterior: taxData?.numero,
          // numeroInterior: "",
          colonia: taxData?.colonian,
          ciudad: taxData?.municipio,
          municipio: taxData?.municipio,
          estado: taxData?.estado,
          pais: "MEX",
        },
      };

      const invoiceInfo = await checkIn(invoiceData);
      if (!!invoiceInfo?.facturapiId) {
        alerts.success("Factura creada conrrectamente");
        history.push(`/invoice/${tipo}/${invoiceInfo?.facturapiId}`);
      }
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
      <Spin spinning={isLoading}>
        <Divider />
        {tipo !== "free" ? (
          <InvoiceCompanyInfo
            company={company}
            facturapiId={getFacturapi()}
            estatusFactura={getEstatusFactura()}
          />
        ) : (
          <InvoiceFreeInfo />
        )}
        {tipo !== "free" ? (
          <InvoiceCompanyData
            company={company}
            totalEstudios={total}
            totalFinal={totalFinalEstudios}
            createInvoice={createInvoice}
            invoice={id!}
            estatusFactura={getEstatusFactura()}
            facturapiId={getFacturapi()}
          />
        ) : (
          <InvoiceFreeData />
        )}

        <InvoiceFreeDetail
          estudios={estudios}
          totalEstudios={totalFinalEstudios}
        />
      </Spin>
    </>
  );
};

export default observer(InvoiceCompanyCreate);
