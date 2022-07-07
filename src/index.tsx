import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./app/layout/App";
import reportWebVitals from "./reportWebVitals";
import { BrowserRouter } from "react-router-dom";
import { ConfigProvider, Empty } from "antd";
import es_ES from "antd/lib/locale/es_ES";
import { store, StoreContext } from "./app/stores/store";
import NavigateSetter from "./app/common/navigation/NavigateSetter";
import moment from "moment";
import "moment/locale/es-mx";

var meses = "Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre".split(
  "_"
);
var semanas = "Domingo_Lunes_Martes_Miércoles_Jueves_Viernes_Sábado".split("_");

moment.updateLocale("es-mx", {
  week: {
    dow: 1,
  },
  months: meses,
  weekdays: semanas,
});

const root = createRoot(document.getElementById("root")!);

root.render(
  <BrowserRouter basename={`${process.env.REACT_APP_NAME}/admin/`}>
    <ConfigProvider locale={es_ES} renderEmpty={() => <Empty />} componentSize="small">
      <StoreContext.Provider value={store}>
        <NavigateSetter />
        <App />
      </StoreContext.Provider>
    </ConfigProvider>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
