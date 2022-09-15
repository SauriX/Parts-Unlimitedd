import { Button, Col, Divider, Row, Spin } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { observer } from "mobx-react-lite";
import React from "react";
import { Fragment, useState } from "react";
import { useStore } from "../../app/stores/store";
import ClinicResultsColumns, {
  ClinicResultsExpandable,
} from "./columnDefinition/clinicResults";
import ClinicResultsFilter from "./ClinicResultsFilter";
import ClinicResultsTable from "./ClinicResultsTable";
import { IClinicResultForm } from "../../app/models/clinicResults";

type CRDefaultProps = {
    printing: boolean;
    formValues: IClinicResultForm;
  };

const ClinicResultsBody = ({ printing, formValues }: CRDefaultProps) => {
  const { clinicResultsStore } = useStore();
  const { data } = clinicResultsStore;
  const [loading, setLoading] = useState(false);

  return (
    <Fragment>
      <ClinicResultsFilter />
      <Divider orientation="left">{formValues.fecha[0].format('DD-MMM-YYYY')} - {formValues.fecha[1].format('DD-MMM-YYYY')}</Divider>
      <Spin spinning={loading || printing} tip={printing ? "Descargando" : ""}>
        <ClinicResultsTable
          data={data}
          columns={ClinicResultsColumns()}
          expandable={ClinicResultsExpandable()}
        />
      </Spin>
    </Fragment>
  );
}

export default observer(ClinicResultsBody)