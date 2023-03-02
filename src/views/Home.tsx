import { Col, Row, Image, Card, Statistic, Typography } from "antd";
import { Fragment, useEffect, useRef, useState } from "react";
import DashboardChart from "../components/dashboard/dashboardChart";
import { IDashBoard } from "../app/models/dashboard";
import { useStore } from "../app/stores/store";
import { IRequestFilter } from "../app/models/request";
import moment from "moment";
import {
  SearchTracking,
  TrackingFormValues,
} from "../app/models/routeTracking";
import AppointmentCalendar from "../components/dashboard/dashCalendar";
import { useReactToPrint } from "react-to-print";
import SelectInput from "../app/common/form/proposal/SelectInput";

const { Text } = Typography;

const Home = () => {
  const [printing, setPrinting] = useState(false);
  const componentRef = useRef<any>();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: () => {
      setPrinting(true);
    },
    onAfterPrint: () => {
      setPrinting(false);
    },
  });
  const { appointmentStore, requestStore, routeTrackingStore, profileStore } =
    useStore();
  const { profile } = profileStore;
  const { getAllDom, getAllLab, search } = appointmentStore;
  const { getRequests } = requestStore;
  const { getAll, getAllRecive, searchPending, setSearchi } =
    routeTrackingStore;
  const [calendar, setCalendar] = useState<boolean>(false);
  const [vista, setVista] = useState<number>(1);
  const [citas, setCitas] = useState<number>(0);
  const [enviar, setEnviar] = useState<number>(0);
  const [recibir, setRecibir] = useState<number>(0);
  const [solicitudes, setSolicitudes] = useState<number>(0);
  const [proxCierre, setProxCierre] = useState<number>(0);
  const [calendarType, setCalendarType] = useState<"week" | "date">("date");
  const [data, setData] = useState<IDashBoard[]>([]);

  useEffect(() => {
    const readcitas = async () => {
      var lab = await getAllLab(search);
      var citasTotales = lab?.length!;
      setCitas(citasTotales);
    };
    readcitas();
  }, [getAllLab]);
  useEffect(() => {
    const readRequest = async () => {
      var temp: IDashBoard[] = [
        {
          pendiente: undefined,
          toma: undefined,
          ruta: undefined,
          solicitud: undefined,
          capturado: undefined,
          validado: undefined,
          liberado: undefined,
          enviado: undefined,
          entregado: undefined,
        },
      ];

      var filter: IRequestFilter = {
        fechaInicial: moment(moment.now()),
        fechaFinal: moment(moment.now()),
        tipoFecha: 1,
      };
      if (vista == 2) {
        var weeknumber = moment(moment.now()).week();
        var primer = moment().isoWeek(weeknumber).startOf("W");
        var final = moment().isoWeek(weeknumber).endOf("W").subtract(1, "d");
        filter = { fechaInicial: primer, fechaFinal: final, tipoFecha: 1 };
      }
      var requests = await getRequests(filter);

      console.log(requests, "solis");
      setSolicitudes(requests!.length);

      var cierre = 0;
      requests?.forEach((solicitud) =>
        solicitud.estudios.forEach((x) => {
          if (x.estatusId == 6 || x.estatusId == 7 || x.estatusId == 10) {
            cierre++;
          }
        })
      );
      requests?.forEach((solicitud) =>
        solicitud.estudios.forEach((x) => {
          switch (x.estatusId) {
            case 1: {
              var datos = temp;
              if (datos[0].pendiente == undefined) {
                datos[0].pendiente = 0;
              }

              datos[0].pendiente++;
              setData(datos);
              break;
            }
            case 2: {
              var datos = temp;
              if (datos[0].toma == undefined) {
                datos[0].toma = 0;
              }

              datos[0].toma++;
              setData(datos);
              break;
            }
            case 3: {
              var datos = temp;
              if (datos[0].solicitud == undefined) {
                datos[0].solicitud = 0;
              }

              datos[0].solicitud++;
              setData(datos);
              break;
            }
            case 4: {
              var datos = temp;
              if (datos[0].capturado == undefined) {
                datos[0].capturado = 0;
              }
              datos[0].capturado++;
              setData(datos);
              break;
            }
            case 5: {
              var datos = temp;
              if (datos[0].validado == undefined) {
                datos[0].validado = 0;
              }
              datos[0].validado++;
              setData(datos);
              break;
            }
            case 6: {
              var datos = temp;
              if (datos[0].liberado == undefined) {
                datos[0].liberado = 0;
              }
              datos[0].liberado++;
              setData(datos);
              break;
            }
            case 7: {
              var datos = temp;
              if (datos[0].enviado == undefined) {
                datos[0].enviado = 0;
              }
              datos[0].enviado++;
              setData(datos);
              break;
            }
            case 8: {
              var datos = temp;
              if (datos[0].ruta == undefined) {
                datos[0].ruta = 0;
              }
              datos[0].ruta++;
              setData(datos);
              break;
            }
            case 10: {
              var datos = temp;
              if (datos[0].entregado == undefined) {
                datos[0].entregado = 0;
              }
              datos[0].entregado++;
              setData(datos);
              break;
            }
            default: {
              //statementss;
              break;
            }
          }
        })
      );
      console.log(temp, "temporal");
      setProxCierre(cierre);
    };
    readRequest();
  }, [getRequests, vista]);

  useEffect(() => {
    const readsend = async () => {
      var search: SearchTracking = new TrackingFormValues();
      var envia = await getAll(search);

      const weeknumber = moment(moment.now()).week();
      const primer = moment().isoWeek(weeknumber).startOf("W");
      const final = moment().isoWeek(weeknumber).endOf("W").subtract(1, "d");
      if (vista == 2) {
        envia = envia?.filter(
          (x) =>
            Date.parse(moment(x.entrega).format("YYYY MM DD")) >
              Date.parse(moment(primer).format("YYYY MM DD")) &&
            Date.parse(moment(x.entrega).format("YYYY MM DD")) <
              Date.parse(moment(final).format("YYYY MM DD"))
        );
      } else {
        envia = envia?.filter(
          (x) =>
            moment(x.entrega).format("YYYY MM DD") ==
            moment(moment.now()).format("YYYY MM DD")
        );
      }

      setEnviar(envia?.length!);
      if (vista == 1) {
        var recibe = await getAllRecive({
          ...searchPending!,
          sucursaldest: profile?.sucursal!,
        });
        setRecibir(recibe?.length!);
      }

      if (vista == 2) {
        var contador = 0;
        for (var i = 0; i <= 5; i++) {
          var dia = moment().isoWeek(weeknumber).startOf("W");
          dia = dia.add(i, "d");
          var recibe = await getAllRecive({
            ...searchPending!,
            fecha: dia,
            sucursaldest: profile?.sucursal!,
          });
          contador += recibe?.length!;
          console.log(contador);
        }
        console.log(contador);
        setRecibir(contador);
      }
    };
    readsend();
  }, [getAllRecive, getAll, vista]);
  return (
    <Fragment>
      <Row gutter={[16, 16]}>
        <Col md={6} offset={18}>
          <SelectInput
            formProps={{ name: "fecha", label: "Ver por" }}
            options={[
              { value: 1, label: "Diario" },
              { value: 2, label: "Semanal" },
            ]}
            onChange={(values) => {
              setVista(values);
              if (values == 2) {
                setCalendarType("week");
              } else {
                setCalendarType("date");
              }
            }}
            defaultValue={1}
          />
        </Col>
        <Col md={8}>
          <Card
            onClick={() => {
              setCalendar(!calendar);
            }}
            className="dashboard-card"
          >
            <Statistic
              title={
                <Fragment>
                  <Row
                    className="dashboard-card-title"
                    justify="space-between"
                    align="middle"
                  >
                    <Col span={12}>
                      <Text className="dashboard-card-text">Citas</Text>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <Image
                        width={30}
                        src={`/${process.env.REACT_APP_NAME}/admin/assets/citas.png`}
                        preview={false}
                      />
                    </Col>
                  </Row>
                </Fragment>
              }
              value={citas}
              valueStyle={{ textAlign: "center", fontWeight: "500" }}
            />
          </Card>
        </Col>
        <Col md={8}>
          <Card className="dashboard-card">
            <Statistic
              title={
                <Fragment>
                  <Row
                    className="dashboard-card-title"
                    justify="space-between"
                    align="middle"
                  >
                    <Col span={12}>
                      <Text className="dashboard-card-text">Solicitudes</Text>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <Image
                        width={30}
                        src={`/${process.env.REACT_APP_NAME}/admin/assets/solicitud.png`}
                        preview={false}
                      />
                    </Col>
                  </Row>
                </Fragment>
              }
              value={solicitudes}
              valueStyle={{ textAlign: "center", fontWeight: "500" }}
            />
          </Card>
        </Col>
        <Col md={8}>
          <Card className="dashboard-card">
            <Statistic
              title={
                <Fragment>
                  <Row
                    className="dashboard-card-title"
                    justify="space-between"
                    align="middle"
                  >
                    <Col span={12}>
                      <Text className="dashboard-card-text">
                        Prox. a cierre
                      </Text>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <Image
                        width={30}
                        src={`/${process.env.REACT_APP_NAME}/admin/assets/cierre.png`}
                        preview={false}
                      />
                    </Col>
                  </Row>
                </Fragment>
              }
              value={proxCierre}
              valueStyle={{ textAlign: "center", fontWeight: "500" }}
            />
          </Card>
        </Col>
        <Col md={vista == 2 && !calendar ? 18 : 16}>
          {calendar && (
            <AppointmentCalendar
              type={calendarType}
              componentRef={componentRef}
              printing={printing}
            ></AppointmentCalendar>
          )}
          {!calendar && (
            <Fragment>
              <DashboardChart<IDashBoard>
                data={data as IDashBoard[]}
                series={[
                  { title: "Pendiente", dataIndex: "pendiente" },
                  { title: "Toma", dataIndex: "toma" },
                  { title: "En ruta", dataIndex: "ruta" },
                  { title: "Solicitado", dataIndex: "solicitud" },
                  { title: "Capturado", dataIndex: "capturado" },
                  { title: "Validado", dataIndex: "validado" },
                  { title: "Liberado", dataIndex: "liberado" },
                  { title: "Enviado", dataIndex: "enviado" },
                  { title: "Entregado", dataIndex: "entregado" },
                ]}
                axisLabel={{ interval: 0, rotate: 0 }}
              ></DashboardChart>
            </Fragment>
          )}
        </Col>
        <Col span={8}>
          <Card className="dashboard-card">
            <Statistic
              title={
                <Fragment>
                  <Row
                    className="dashboard-card-title"
                    justify="space-between"
                    align="middle"
                  >
                    <Col span={12}>
                      <Text className="dashboard-card-text">
                        Muestras a enviar
                      </Text>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <Image
                        width={30}
                        src={`/${process.env.REACT_APP_NAME}/admin/assets/enviar.png`}
                        preview={false}
                      />
                    </Col>
                  </Row>
                </Fragment>
              }
              value={enviar}
              valueStyle={{ textAlign: "center", fontWeight: "500" }}
            />
          </Card>
          <Card className="dashboard-card">
            <Statistic
              title={
                <Fragment>
                  <Row
                    className="dashboard-card-title"
                    justify="space-between"
                    align="middle"
                  >
                    <Col span={12}>
                      <Text className="dashboard-card-text">
                        Muestras a recibir
                      </Text>
                    </Col>
                    <Col span={12} style={{ textAlign: "right" }}>
                      <Image
                        width={30}
                        src={`/${process.env.REACT_APP_NAME}/admin/assets/recibir.png`}
                        preview={false}
                      />
                    </Col>
                  </Row>
                </Fragment>
              }
              value={recibir}
              valueStyle={{ textAlign: "center", fontWeight: "500" }}
            />
          </Card>
        </Col>
        {vista == 2 && !calendar && (
          <Col md={6}>
            <div
              style={{
                background: "#253B65",
                height: "auto",
                borderStyle: "solid",
                borderColor: "#CBC9C9",
                borderWidth: "1px",
                borderRadius: "10px",
                padding: "10px",
                marginTop: "20%",
                width: "70%",
                marginLeft: "30%",
                color: "#F0F0F0",
              }}
            >
              <b style={{ fontSize: "20px" }}>
                Enviadas
                <Image
                  width={40}
                  style={{ marginLeft: "270%" }}
                  src={`/${process.env.REACT_APP_NAME}/admin/assets/enviadas.png`}
                  preview={false}
                />
              </b>
            </div>
            <div
              style={{
                marginLeft: "36%",
                textAlign: "center",
                height: "auto",
                borderColor: "#CBC9C9",
                borderWidth: "1px",
                borderRadius: "10px",
                padding: "10px",
                width: "57%",
              }}
            >
              <b style={{ fontSize: "25px" }}>
                {data[0].enviado == undefined ? data[0].enviado : 0}
              </b>
            </div>
            <div
              style={{
                background: "#253B65",
                height: "auto",
                borderStyle: "solid",
                borderColor: "#CBC9C9",
                borderWidth: "1px",
                borderRadius: "10px",
                padding: "10px",
                marginTop: "5%",
                width: "70%",
                marginLeft: "30%",
                color: "#F0F0F0",
              }}
            >
              <b style={{ fontSize: "20px" }}>
                Entregadas
                <Image
                  width={40}
                  style={{ marginLeft: "220%" }}
                  src={`/${process.env.REACT_APP_NAME}/admin/assets/recibidas.png`}
                  preview={false}
                />
              </b>
            </div>
            <div
              style={{
                marginLeft: "36%",
                textAlign: "center",
                height: "auto",
                borderColor: "#CBC9C9",
                borderWidth: "1px",
                borderRadius: "10px",
                padding: "10px",
                width: "57%",
              }}
            >
              <b style={{ fontSize: "25px" }}>{data[0].entregado}</b>
            </div>
          </Col>
        )}
      </Row>
    </Fragment>
  );
};

export default Home;
