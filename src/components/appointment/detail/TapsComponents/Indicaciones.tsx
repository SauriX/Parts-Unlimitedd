import { Spin, Form, Row, Col, Pagination, Button, PageHeader, Divider, Radio, DatePicker, List, Typography, Select, Table, Checkbox, Input, Tag, InputNumber, Tabs, Descriptions,Comment } from "antd";
import React, { FC, useEffect, useState } from "react";
import { formItemLayout } from "../../../../app/util/utils";
import TextInput from "../../../../app/common/form/TextInput";
import { useStore } from "../../../../app/stores/store";
import { IReagentForm, ReagentFormValues } from "../../../../app/models/reagent";
import { useNavigate, useSearchParams } from "react-router-dom";
import ImageButton from "../../../../app/common/button/ImageButton";
import HeaderTitle from "../../../../app/common/header/HeaderTitle";
import { observer } from "mobx-react-lite";
import views from "../../../../app/util/view";
import NumberInput from "../../../../app/common/form/NumberInput";
import SelectInput from "../../../../app/common/form/SelectInput";
import SwitchInput from "../../../../app/common/form/SwitchInput";
import alerts from "../../../../app/util/alerts";
import messages from "../../../../app/util/messages";
import { getDefaultColumnProps, IColumns, ISearch } from "../../../../app/common/table/utils";
import { IOptions } from "../../../../app/models/shared";
import moment from "moment";
import type { CheckboxValueType } from 'antd/es/checkbox/Group';
import TextArea from "antd/lib/input/TextArea";
import { IQuotationEstudiosForm, IQuotationPrice, QuotationEstudiosFormValues } from "../../../../app/models/quotation";
import { moneyFormatter } from "../../../../app/util/utils";
import { IIndicationList } from "../../../../app/models/indication";
type IndiciacionesFormProps = {
    clave: any;
    data: IQuotationPrice[];
  };
const IndiciacionesForm:FC<IndiciacionesFormProps> = ({data})=>{
    const [indications, setIndications] = useState<IIndicationList[]>([]);

    useEffect(() => {
      const indications = data.flatMap((x) => x.indicaciones).filter((v, i, a) => a.indexOf(v) === i);
      setIndications(indications);
    }, [data]);
  
 
    return (    <List
        className="request-indication-list"
        itemLayout="horizontal"
        dataSource={indications}
        renderItem={(item) => (
          <li>
            <Comment
              author={item.clave}
              content={item.descripcion}
              // datetime={item.dias === 1 ? "1 día" : `${item.dias} días`}
            />
          </li>
        )}
      />)
}

export default observer(IndiciacionesForm);