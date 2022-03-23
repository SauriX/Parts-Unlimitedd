import React, { FC, ReactNode } from "react";
import { Typography, Image } from "antd";

const { Title } = Typography;

type Props = {
  title: string;
  icon?: ReactNode;
  image?: "user" | "reagent" | "role";
};

const HeaderTitle: FC<Props> = ({ title, icon, image }) => {
  return (
    <Title level={4} className="header-title">
      {image ? (
        <Image src={`/${process.env.REACT_APP_NAME}/admin/assets/${image}.png`} preview={false} />
      ) : (
        icon
      )}
      {icon}
      {title}
    </Title>
  );
};

export default HeaderTitle;
