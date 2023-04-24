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
  Switch,
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
import { reciveStudy } from "../../../../app/models/ReciveTracking";

const formItemLayout = {
  labelCol: { span: 8 },
  wrapperCol: { span: 16 },
};

type DatosFiscalesFormProps = {
  acepted: reciveStudy;
};

const UnCheck = ({ acepted }: DatosFiscalesFormProps) => {
  return (
    <div
      style={{
        height: "auto",
      }}
    >
      <Image
        width={100}
        height={100}
        src="origen"
        fallback={`${process.env.REACT_APP_NAME}/assets/danger.png`}
        style={{ marginLeft: "170%" }}
      />
      <br />
      <br />
      Se ha cancelado la muestra del estudio: <b>{acepted.estudio}</b>,
      solicitud: <b>{acepted.solicitud}</b>
    </div>
  );
};

export default observer(UnCheck);
