import { Button, Col, PageHeader } from "antd";
import { observer } from "mobx-react-lite";
import { FC, useEffect, useState } from "react";
import HeaderTitle from "../../../app/common/header/HeaderTitle";
import DownloadIcon from "../../../app/common/icons/DownloadIcon";
import { useParams, useNavigate } from "react-router-dom";
import GoBackIcon from "../../../app/common/icons/GoBackIcon";
import { PlusOutlined } from "@ant-design/icons";
import SelectInput from "../../../app/common/form/proposal/SelectInput";
import { useStore } from "../../../app/stores/store";
import alerts from "../../../app/util/alerts";
import { toJS } from "mobx";

type InvoiceCompanyHeaderProps = {
  handleDownload: () => void;
};
type UrlParams = {
  id: string;
  tipo: string;
};
const InvoiceCompanyHeader: FC<InvoiceCompanyHeaderProps> = ({
  handleDownload,
}) => {
  let navigate = useNavigate();
  const { invoiceCompanyStore, profileStore } = useStore();
  const { profile } = profileStore;
  const {
    selectedRows,
    isSameCommpany: mismaCompania,
    printReceipt,
    selectedRequestGlobal,
    createInvoiceGlobal,
  } = invoiceCompanyStore;
  let { id, tipo } = useParams<UrlParams>();
  const invoiceOptions = [
    { label: "FACTURA", value: "Factura" },
    { label: "RECIBO", value: "Recibo" },
  ];
  const [tipoFactura, setTipoFactura] = useState<string>();

  const createInvoice = async () => {
    if (!selectedRows.length) {
      alerts.warning("No solicitudes seleccionadas");
      return;
    }
    if (!mismaCompania) {
      alerts.warning(
        "Las solicitudes seleccionadas no tienen la misma procedencia"
      );
      return;
    }

    let requestsWithInvoiceCompany: any[] = [];
    selectedRows.forEach((request) => {
      if (
        request.facturas.some(
          (invoice: any) =>
            invoice.tipo === tipo && invoice.estatus.nombre !== "Cancelado"
        )
      ) {
        requestsWithInvoiceCompany.push(request);
      }
    });

    if (!!requestsWithInvoiceCompany.length && tipoFactura === "Factura") {
      // if (false) {
      alerts.confirmInfo(
        "Solicitudes facturadas",
        <>
          <Col>
            <div>
              Alguna de las solicitudes seleccionadas ya se encuentran
              procesadas en una factura:
            </div>
            {requestsWithInvoiceCompany.map((request) => {
              return (
                <div>
                  {request?.clave} -{" "}
                  {
                    request?.facturas.find(
                      (invoice: any) => invoice.tipo === tipo
                    )?.serie
                  }
                  {"-"}
                  {
                    request?.facturas.find(
                      (invoice: any) => invoice.tipo === tipo
                    )?.consecutivo
                  }
                </div>
              );
            })}
          </Col>
        </>,
        async () => {}
      );
    }

    if (!requestsWithInvoiceCompany.length || tipoFactura === "Recibo") {
      // if (true) {
      if (tipoFactura === "Factura") {
        if (tipo === "company") {
          navigate(`/invoice/company/new`);
        }
        if (tipo === "request") {
          navigate(`/invoice/request/new`);
        }
      } else {
        let solicitudesId = selectedRows.map((row) => row.solicitudId);
        let receiptCompanyData = {
          sucursal: "MONTERREY", // "SUCURSAL MONTERREY"
          folio: "",
          atiende: "",
          usuario: "",
          Contraseña: "",
          ContactoTelefono: "",
          SolicitudesId: solicitudesId,
        };
        printReceipt(receiptCompanyData);
      }
    }
  };

  return (
    <>
      <PageHeader
        ghost
        title={
          <HeaderTitle
            title={
              tipo === "company"
                ? "Crédito y cobranza (Facturación por compañía)"
                : tipo === "request"
                ? "Crédito y cobranza (Facturación por solicitud)"
                : tipo === "free"
                ? "Crédito y cobranza (Facturación libre)"
                : tipo === "global"
                ? "Crédito y cobranza (Facturación global)"
                : ""
            }
            image="invoice-company"
          />
        }
        onBack={() => {
          if (id !== "new") {
            navigate(-1);
          } else {
            navigate(-2);
          }
        }}
        className="header-container"
        extra={
          id
            ? [<DownloadIcon key="doc" onClick={handleDownload} />]
            : [
                <DownloadIcon key="doc" onClick={handleDownload} />,
                tipo === "free" || tipo === "global" ? (
                  ""
                ) : (
                  <SelectInput
                    formProps={{
                      name: "generar",
                      label: "",
                    }}
                    placeholder="Tipo factura"
                    options={invoiceOptions}
                    onChange={setTipoFactura}
                  />
                ),
                <Button
                  key="new"
                  type="primary"
                  onClick={() => {
                    if (tipo === "global") {
                      console.log(
                        "solicitudes global",
                        toJS(selectedRequestGlobal)
                      );

                      createInvoiceGlobal(profile?.sucursal!);
                      return;
                    }
                    if (tipo === "free") {
                      navigate(`/invoice/${tipo}/new`);
                    } else {
                      createInvoice();
                    }
                  }}
                  icon={<PlusOutlined />}
                >
                  Generar
                </Button>,
              ]
        }
      ></PageHeader>
    </>
  );
};
export default observer(InvoiceCompanyHeader);
