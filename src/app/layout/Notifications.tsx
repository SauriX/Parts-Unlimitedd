import { Empty, Comment, Typography, Tooltip } from "antd";
import moment from "moment";
import React, { Fragment } from "react";

const { Text } = Typography;

const Notifications = () => {
  return (
    <Fragment>
      {[].length === 0 ? (
        <Empty />
      ) : (
        [].map((x: any) => (
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
              content={x.mensaje}
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

export default Notifications;
