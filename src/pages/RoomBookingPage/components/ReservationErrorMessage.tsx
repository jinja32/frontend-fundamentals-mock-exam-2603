import { css } from '@emotion/react';
import { Spacing } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

export function ReservationErrorMessage() {
  const location = useLocation();

  const locationState = location.state as string | null;
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (locationState) {
      setErrorMessage(locationState);
      window.history.replaceState({}, '');
    }
  }, [locationState]);

  if (!errorMessage) {
    return null;
  }

  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <Spacing size={8} />
      <span
        css={css`
          color: ${colors.red500};
          font-size: 14px;
        `}
        role="alert"
      >
        {errorMessage}
      </span>
    </div>
  );
}
