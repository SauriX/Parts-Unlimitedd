import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./app/layout/App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, Empty } from "antd";
import es_ES from "antd/es/locale/es_ES";
import { store, StoreContext } from "./app/stores/store";
import NavigateSetter from "./app/common/navigation/NavigateSetter";

ReactDOM.render(
  <BrowserRouter basename={`${process.env.REACT_APP_NAME}/admin/`}>
    <ConfigProvider locale={es_ES} renderEmpty={() => <Empty />}>
      <StoreContext.Provider value={store}>
        <NavigateSetter />
        <App />
      </StoreContext.Provider>
    </ConfigProvider>
  </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
