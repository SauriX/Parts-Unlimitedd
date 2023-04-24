import {
    Button,
    Divider,
    PageHeader,
    Spin,
    Table,
    Form,
    Row,
    Col,
    Modal,
    Pagination,
    Image,
    InputNumber,
    Switch
  } from "antd";
import { useEffect, useState } from "react";
import TextInput from "../../../../app/common/form/proposal/TextInput";
import SelectInput from "../../../../app/common/form/proposal/SelectInput";
import { useStore } from "../../../../app/stores/store";
import { observer } from "mobx-react-lite";
import {
  getDefaultColumnProps,
  IColumns,
  ISearch,
} from "../../../../app/common/table/utils";
import { IFormError, IOptions } from "../../../../app/models/shared";
import { ITaxData } from "../../../../app/models/taxdata";
import IconButton from "../../../../app/common/button/IconButton";
import { EditOutlined } from "@ant-design/icons";
import alerts from "../../../../app/util/alerts";

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

type DatosFiscalesFormProps = {

  closeModal: () => void
 setScanSwitch: React.Dispatch<React.SetStateAction<boolean>>
};

const Scan= ( {
    closeModal,
    setScanSwitch
}: DatosFiscalesFormProps ) => {
  
  return (
<div style={{
              height: "auto",

              }}>

              <Image
                      width={50}
                      height={50}
                      src="origen"
                      fallback={`${process.env.REACT_APP_NAME}/assets/scaner.png`}
                      style={{marginLeft:"400%"}}
              />
              <br />
              Por favor proceder con el escaneo de la muestra para registrar las muestras
              <br />
              <br />
      <Row>
        <Col md={12}><Button type="primary" onClick={()=>{closeModal(); setScanSwitch(true); }} style={{backgroundColor:" #18AC50",marginLeft:"50%"}}>ACEPTAR</Button></Col>
        <Col md={12} ><Button type="primary" onClick={()=>{closeModal(); setScanSwitch(false); }} danger>CANCELAR</Button></Col>
      </Row>
</div>
  );
};

export default observer(Scan);
