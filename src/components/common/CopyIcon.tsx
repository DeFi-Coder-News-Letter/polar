import React, { ReactNode } from 'react';
import CopyToClipboard from 'react-copy-to-clipboard';
import styled from '@emotion/styled';
import { Icon, message } from 'antd';
import { usePrefixedTranslation } from 'hooks';

const Styled = {
  Icon: styled(Icon)`
    margin-left: 5px;
    color: #aaa;
  `,
  Tip: styled.span`
    font-size: 12px;
  `,
};

interface Props {
  value: string;
  label?: string;
  text?: ReactNode;
}

const CopyIcon: React.FC<Props> = ({ value, label = '', text }) => {
  const { l } = usePrefixedTranslation('cmps.common.CopyIcon');
  const msg = l('message', { label });
  const cmp = (
    <>
      {text}
      <CopyToClipboard text={value} onCopy={() => message.success(msg, 2)}>
        <Styled.Icon type="copy" />
      </CopyToClipboard>
    </>
  );
  return cmp;
};

export default CopyIcon;
