import { css } from '@emotion/react';
import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Spacing, Text } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';

function formatDate(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function ReservationStatusDatePicker() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [date, setDate] = useState(searchParams.get('date') || formatDate(new Date()));

  // URL 쿼리 파라미터 동기화
  useEffect(() => {
    const params: Record<string, string> = {};
    if (date) params.date = date;
    setSearchParams(params, { replace: true });
  }, [date, setSearchParams]);

  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        날짜 선택
      </Text>
      <Spacing size={16} />
      <div
        css={css`
          display: flex;
          flex-direction: column;
          gap: 6px;
        `}
      >
        <input
          type="date"
          value={date}
          min={formatDate(new Date())}
          onChange={e => setDate(e.target.value)}
          aria-label="날짜"
          css={css`
            box-sizing: border-box;
            font-size: 16px;
            font-weight: 500;
            line-height: 1.5;
            height: 48px;
            background-color: ${colors.grey50};
            border-radius: 12px;
            color: ${colors.grey800};
            width: 100%;
            border: 1px solid ${colors.grey200};
            padding: 0 16px;
            outline: none;
            transition: border-color 0.15s;
            &:focus {
              border-color: ${colors.blue500};
            }
          `}
        />
      </div>
    </div>
  );
}
