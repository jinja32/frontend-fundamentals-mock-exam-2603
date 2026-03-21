import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

interface Message {
  type?: 'success' | 'error';
  text?: string;
}

export function MessageBanner() {
  const location = useLocation();

  const locationState = location.state as Message | null;
  const [message, setMessage] = useState<Message | null>(null);

  useEffect(() => {
    if (locationState?.text) {
      setMessage({ type: locationState.type, text: locationState.text });
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  if (!message) {
    return null;
  }

  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <div
        css={css`
          padding: 10px 14px;
          border-radius: 10px;
          background: ${message.type === 'success' ? colors.blue50 : colors.red50};
          display: flex;
          align-items: center;
          gap: 8px;
        `}
      >
        <Text typography="t7" fontWeight="medium" color={message.type === 'success' ? colors.blue600 : colors.red500}>
          {message.text}
        </Text>
      </div>
      <Spacing size={12} />
    </div>
  );
}
