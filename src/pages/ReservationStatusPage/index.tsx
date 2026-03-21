import { css } from '@emotion/react';
import { useNavigate } from 'react-router-dom';
import { Top, Spacing, Border, FixedBottomCTA } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { MessageBanner } from 'pages/ReservationStatusPage/components/MessageBanner';
import { ReservationList } from 'pages/ReservationStatusPage/components/ReservationList';
import { ReservationStatusTimeline } from 'pages/ReservationStatusPage/components/ReservationStatusTimeline';
import { ReservationStatusDatePicker } from 'pages/ReservationStatusPage/components/ReservationStatusDatePicker';

export function ReservationStatusPage() {
  const navigate = useNavigate();

  return (
    <div
      css={css`
        background: ${colors.white};
        padding-bottom: 40px;
      `}
    >
      <Top.Top03
        css={css`
          padding-left: 24px;
          padding-right: 24px;
        `}
      >
        회의실 예약
      </Top.Top03>

      <Spacing size={24} />

      {/* 날짜 선택 */}
      <ReservationStatusDatePicker />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 예약 현황 타임라인 */}
      <ReservationStatusTimeline />

      <Spacing size={24} />
      <Border size={8} />
      <Spacing size={24} />

      {/* 메시지 배너 */}
      <MessageBanner />

      {/* 내 예약 목록 */}
      <ReservationList />

      <Spacing size={48} />

      {/* 예약하기 버튼 */}
      <FixedBottomCTA onClick={() => navigate('/booking')}>예약하기</FixedBottomCTA>
    </div>
  );
}
