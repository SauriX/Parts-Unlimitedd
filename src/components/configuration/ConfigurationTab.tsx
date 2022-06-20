import { Tabs } from "antd";
import React from "react";
import ConfigurationEmailForm from "./ConfigurationEmailForm";
import ConfigurationFiscalForm from "./ConfigurationFiscalForm";
import ConfigurationGeneralForm from "./ConfigurationGeneralForm";

const { TabPane } = Tabs;

const ConfigurationTab = () => {
  return (
    <Tabs type="card">
      <TabPane tab="Generales" key="general">
        <ConfigurationGeneralForm />
      </TabPane>
      <TabPane tab="Fiscal" key="fiscal">
        <ConfigurationFiscalForm />
      </TabPane>
      <TabPane tab="Correo" key="mail">
        <ConfigurationEmailForm />
      </TabPane>
    </Tabs>
  );
};

export default ConfigurationTab;
