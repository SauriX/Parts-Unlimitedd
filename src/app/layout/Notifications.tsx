import { Empty, Comment, Typography, Tooltip, Alert } from "antd";
import { observer } from "mobx-react-lite";
import moment from "moment";
import React, { Fragment, useEffect } from "react";
import { INotification } from "../models/shared";
import { useStore } from "../stores/store";

const { Text } = Typography;

const Notifications = () => {
  const {notificationStore}=useStore();
  const {notifications,updateNotification}=notificationStore;

  const onClose = (notificación:INotification)=>{

    updateNotification(notificación)
  }
  return (
    <Fragment>
      {[...notifications].length === 0 ? (
        <Empty />
      ) : (
        [...notifications].map((x: any) => (
          <div
            key={x.id}
            style={{
              marginBottom: 10,
              background: x.visto
                ? ""
                : "linear-gradient(to left, transparent, rgb(77, 171, 235, .3) 0%, transparent 80%)",
            }}
          >
            <Comment
              author={<Text strong>{x.titulo}</Text>}
              content={    <Alert
                description={x.mensaje}
                closable
                onClose={()=>onClose(x)}
              />}
              datetime={
                <Tooltip title={moment(x.fecha).format("YYYY-MM-DD HH:mm:ss")}>
                  <span>{moment(x.fecha).fromNow()}</span>
                </Tooltip>
              }
            />
          </div>
        ))
      )}
    </Fragment>
  );
};

export default  observer(Notifications);
