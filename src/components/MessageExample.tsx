import React from 'react';
import { useMessage } from '../hooks/useMessage';
import { useTranslation } from 'react-i18next';

/**
 * Message 组件使用示例
 * 可以在任何组件中使用 useMessage hook 来显示消息
 */
const MessageExample: React.FC = () => {
  const message = useMessage();
  const { t } = useTranslation();

  return (
    <div style={{ padding: '20px' }}>
      <h2>Message Component Example</h2>
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginTop: '20px' }}>
        <button
          onClick={() => message.success(t('message.operationSuccess'))}
          style={{ padding: '10px 20px', backgroundColor: '#52c41a', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {t('common.success')}
        </button>
        <button
          onClick={() => message.error(t('message.operationFailed'))}
          style={{ padding: '10px 20px', backgroundColor: '#ff4d4f', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {t('common.error')}
        </button>
        <button
          onClick={() => message.warning(t('message.pleaseNote'))}
          style={{ padding: '10px 20px', backgroundColor: '#faad14', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {t('common.warning')}
        </button>
        <button
          onClick={() => message.info(t('message.thisIsAnInfo'))}
          style={{ padding: '10px 20px', backgroundColor: '#1890ff', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}
        >
          {t('common.info')}
        </button>
      </div>
    </div>
  );
};

export default MessageExample;

