import { FormInstance } from 'antd'
import { observer } from 'mobx-react-lite'
import React from 'react'

type ParameterFormProps = {
    form: FormInstance<any>
}

const ParameterForm = () => {
  return (
    <div>ParameterForm</div>
  )
}

export default observer(ParameterForm)