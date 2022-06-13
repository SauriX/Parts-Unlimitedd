import React, { FC } from "react";

type Props = {
  children: React.ReactNode;
};

const Center = ({ children }: Props) => {
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {children}
    </div>
  );
};

export default Center;
