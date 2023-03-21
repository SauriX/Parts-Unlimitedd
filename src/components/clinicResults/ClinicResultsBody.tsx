import { Button, Col, Divider, Row, Spin } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { observer } from "mobx-react-lite";
import React, { useEffect } from "react";
import { Fragment, useState } from "react";
import { useStore } from "../../app/stores/store";
import ClinicResultsColumns, {
  ClinicResultsExpandable,
} from "./columnDefinition/clinicResults";
import ClinicResultsFilter from "./ClinicResultsFilter";
import ClinicResultsTable from "./ClinicResultsTable";
import { IClinicResultForm } from "../../app/models/clinicResults";
import moment from "moment";

type CRDefaultProps = {
  printing: boolean;
  formValues: IClinicResultForm;
};

const ClinicResultsBody = ({ printing, formValues }: CRDefaultProps) => {
  const { clinicResultsStore } = useStore();
  const { data } = clinicResultsStore;
  const [loading] = useState(false);

  return (
    <Fragment>
      <ClinicResultsFilter />
      <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
        <ClinicResultsTable
          data={data}
          columns={ClinicResultsColumns()}
          expandable={ClinicResultsExpandable()}
        />
      </Spin>
    </Fragment>
  );
};

export default observer(ClinicResultsBody);
