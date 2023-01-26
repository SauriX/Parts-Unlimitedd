import { Divider } from 'antd';
import { observer } from 'mobx-react-lite';
import React, { Fragment, useEffect, useState } from 'react'
import { useStore } from '../app/stores/store';
import SeriesBody from '../components/series/list/SeriesBody';
import SeriesHeader from '../components/series/list/SeriesHeader';

const Series = () => {
    const { seriesStore } = useStore();
    const { scopes, access, clearScopes, exportList, formValues } = seriesStore;
    const [loading, setLoading] = useState(false);

    const handleDownload = async () => {
        setLoading(true);
        await exportList(formValues);
        setLoading(false);
    };

    useEffect(() => {
        const checkAccess = async () => {
            await access();
        };
         
        checkAccess();
    }, [access]);

    useEffect(() => {
        return () => {
            clearScopes();
        };
    }, [clearScopes]);

    if (!scopes?.acceder) return null;
    
  return (
    <Fragment>
        <SeriesHeader handleList={handleDownload} />
        <Divider className="header-divider" />
        <SeriesBody printing={loading} />
    </Fragment>
  )
}

export default observer(Series)