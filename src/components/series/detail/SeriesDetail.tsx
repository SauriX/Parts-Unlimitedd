import React, { Fragment, useEffect } from "react";
import SeriesDetailHeader from "./SeriesDetailHeader";
import SeriesForm from "./SeriesForm";
import { Divider } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import { useStore } from "../../../app/stores/store";

type SeriesParams = {
  id: string;
};

const SeriesDetail = () => {
  const { seriesStore } = useStore();
  const { clearScopes, scopes } = seriesStore;
  const navigate = useNavigate();

  const { id } = useParams<SeriesParams>();
  const seriesId = !id ? 0 : isNaN(Number(id)) ? undefined : parseInt(id);

  useEffect(() => {
    if (seriesId === undefined) {
      navigate("/notFound");
    }
  }, [navigate, seriesId]);

  useEffect(() => {
    clearScopes();
  }, [clearScopes]);

  if (seriesId === undefined) navigate("/series");
  if (!scopes?.acceder) navigate("/notFound");

  return (
    <Fragment>
      <SeriesDetailHeader />
      <Divider className="header-divider" />
      <SeriesForm id={seriesId!} />
    </Fragment>
  );
};

export default SeriesDetail;
