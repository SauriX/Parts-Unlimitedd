import { Col, Row, Select,Image } from "antd";
import React, { Fragment } from "react";
import {
  CalendarOutlined,
  AuditOutlined
} from '@ant-design/icons';
import DashboardChart from "../components/dashboard/dashboardChart";
import { IDashBoard } from "../app/models/dashboard";
const data:IDashBoard[] = [{
  pendiente: 2,
  toma: 2,
  ruta: 0,
  solicitud: 4,
  capturado: 20,
  validado: 6,
  liberado: 0,
  enviado: 6,
  entregado:6,   
}]
const Home = () => {
  return(
    <Fragment>
      <Row>
        <Col md={6}>
          <label style={{marginLeft:"20%"}} htmlFor="">Ver por: </label>
          <Select defaultValue={1} style={{width:"40%"}} options={[{value:1,label:"Diario"},{value:2,label:"Semanal"}]}></Select>
        </Col>
        <Col md={18}></Col>
        <Col md={6}>
          <div style={{
                  background:"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(5,150,180,1) 100%)",
                  height: "auto",
                  borderStyle: "solid",
                  borderColor: "#CBC9C9",
                  borderWidth: "1px",
                  borderRadius: "10px",
                  padding: "10px",
                  marginTop:"20%",
                  width:"70%",
                  marginLeft:"20%",
                  color:"#F0F0F0"
                }}
        >
         <b style={{fontSize:"20px"}}>
          Citas
          <Image width={40} style={{marginLeft:"370%"}} src={`/${process.env.REACT_APP_NAME}/admin/assets/citas.png`} preview={false}/>
  
         </b>
        </div>
        <div style={{marginLeft:"20%",textAlign:"center",
                  height: "auto",
                  borderColor: "#CBC9C9",
                  borderWidth: "1px",
                  borderRadius: "10px",
                  padding: "10px",
                  width:"57%",
                }}>
          <b style={{fontSize:"25px"}}>
           {2} 
          </b>
        </div>
        </Col>
        <Col md={6}>
        <div style={{
                  background:"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(5,150,180,1) 100%)",
                  height: "auto",
                  borderStyle: "solid",
                  borderColor: "#CBC9C9",
                  borderWidth: "1px",
                  borderRadius: "10px",
                  padding: "10px",
                  marginTop:"20%",
                  width:"70%",
                  marginLeft:"20%",
                  color:"#F0F0F0"
                }}
        >
         <b style={{fontSize:"20px"}}>
         Solicitudes
         
         <Image width={40} style={{marginLeft:"220%"}} src={`/${process.env.REACT_APP_NAME}/admin/assets/solicitud.png`} preview={false}/>
         </b>
        </div>
        <div style={{marginLeft:"20%",textAlign:"center",
                  height: "auto",
                  borderColor: "#CBC9C9",
                  borderWidth: "1px",
                  borderRadius: "10px",
                  padding: "10px",
                  width:"70%",
                }}>
          <b style={{fontSize:"25px"}}>
           {34} 
          </b>
        </div>
        </Col>
        <Col md={6}>
        <div style={{
                  background:"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(5,150,180,1) 100%)",
                  height: "auto",
                  borderStyle: "solid",
                  borderColor: "#CBC9C9",
                  borderWidth: "1px",
                  borderRadius: "10px",
                  padding: "10px",
                  marginTop:"20%",
                  width:"70%",
                  marginLeft:"20%",
                  color:"#F0F0F0"
                }}
        >
         <b style={{fontSize:"20px"}}>
         Próximas a cierre
         
         <Image width={40} style={{marginLeft:"65%"}} src={`/${process.env.REACT_APP_NAME}/admin/assets/cierre.png`} preview={false}/>
         </b>
        </div>
        <div style={{marginLeft:"20%",textAlign:"center",
                  height: "auto",
                  borderColor: "#CBC9C9",
                  borderWidth: "1px",
                  borderRadius: "10px",
                  padding: "10px",
                  width:"70%",
                }}>
          <b style={{fontSize:"25px"}}>
           {12} 
          </b>
        </div>
        </Col>
        <Col md={6}>
        <div style={{
                  background:"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(5,150,180,1) 100%)",
                  height: "auto",
                  borderStyle: "solid",
                  borderColor: "#CBC9C9",
                  borderWidth: "1px",
                  borderRadius: "10px",
                  padding: "10px",
                  marginTop:"20%",
                  width:"80%",
                  marginLeft:"20%",
                  color:"#F0F0F0"
                }}
        >
         <b style={{fontSize:"20px"}}>
         Muestras a enviar: {4}
         
         <Image width={40} style={{marginLeft:"90%"}} src={`/${process.env.REACT_APP_NAME}/admin/assets/enviar.png`} preview={false}/>
         </b>
        </div>
        <div style={{
                  background:"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(5,150,180,1) 100%)",
                  height: "auto",
                  borderStyle: "solid",
                  borderColor: "#CBC9C9",
                  borderWidth: "1px",
                  borderRadius: "10px",
                  padding: "10px",
                  marginTop:"2%",
                  width:"80%",
                  marginLeft:"20%",
                  color:"#F0F0F0"
                }}
        >
         <b style={{fontSize:"20px"}}>
         Muestras a recibir: {0}
         
         <Image width={40} style={{marginLeft:"90%"}} src={`/${process.env.REACT_APP_NAME}/admin/assets/recibir.png`} preview={false}/>
         </b>
        </div>
        </Col>
      </Row>
      <Row>
        <Col md={18}>
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
                    axisLabel={{ interval: 0, rotate: 30 }}
          ></DashboardChart>
        </Col>
        <Col md={6}>
        <div style={{
                  background:"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(5,150,180,1) 100%)",
                  height: "auto",
                  borderStyle: "solid",
                  borderColor: "#CBC9C9",
                  borderWidth: "1px",
                  borderRadius: "10px",
                  padding: "10px",
                  marginTop:"20%",
                  width:"70%",
                  marginLeft:"30%",
                  color:"#F0F0F0"
                }}
        >
         <b style={{fontSize:"20px"}}>
         Enviadas
          <Image width={40} style={{marginLeft:"270%"}} src={`/${process.env.REACT_APP_NAME}/admin/assets/enviadas.png`} preview={false}/>
  
         </b>
        </div>
        <div style={{marginLeft:"36%",textAlign:"center",
                  height: "auto",
                  borderColor: "#CBC9C9",
                  borderWidth: "1px",
                  borderRadius: "10px",
                  padding: "10px",
                  width:"57%",
                }}>
          <b style={{fontSize:"25px"}}>
           {6} 
          </b>
        </div>
        <div style={{
                  background:"linear-gradient(90deg, rgba(2,0,36,1) 0%, rgba(9,9,121,1) 35%, rgba(5,150,180,1) 100%)",
                  height: "auto",
                  borderStyle: "solid",
                  borderColor: "#CBC9C9",
                  borderWidth: "1px",
                  borderRadius: "10px",
                  padding: "10px",
                  marginTop:"5%",
                  width:"70%",
                  marginLeft:"30%",
                  color:"#F0F0F0"
                }}
        >
         <b style={{fontSize:"20px"}}>
         Entregadas
          <Image width={40} style={{marginLeft:"220%"}} src={`/${process.env.REACT_APP_NAME}/admin/assets/recibidas.png`} preview={false}/>
  
         </b>
        </div>
        <div style={{marginLeft:"36%",textAlign:"center",
                  height: "auto",
                  borderColor: "#CBC9C9",
                  borderWidth: "1px",
                  borderRadius: "10px",
                  padding: "10px",
                  width:"57%",
                }}>
          <b style={{fontSize:"25px"}}>
           {6} 
          </b>
        </div>
        </Col>
      </Row>
    </Fragment>
  );
};

export default Home;
