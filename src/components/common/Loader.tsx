import React from 'react';
import { Icon } from 'antd';

interface Props {
  inline?: boolean;
  size?: string;
}

const Loader: React.FC<Props> = ({ inline, size }) => (
  <Icon
    type="loading"
    theme="outlined"
    style={{
      color: '#ffa940',
      fontSize: size || '2rem',
      position: inline ? undefined : 'absolute',
      top: inline ? undefined : '50%',
      left: inline ? undefined : '50%',
      transform: inline ? undefined : 'translate(-50%, -50%)',
    }}
  />
);

export default Loader;
