import { css } from '@emotion/react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Spacing, Button, Text, ListRow } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { cancelReservation, getMyReservations, getRooms, Reservation } from 'pages/remotes';
import { useNavigate } from 'react-router-dom';

const EQUIPMENT_LABELS: Record<string, string> = {
  tv: 'TV',
  whiteboard: '화이트보드',
  video: '화상장비',
  speaker: '스피커',
};

export function ReservationList() {
  const { data: myReservationList = [] } = useQuery(['myReservations'], getMyReservations);

  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <div
        css={css`
          display: flex;
          align-items: baseline;
          gap: 6px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          내 예약
        </Text>
        {myReservationList.length > 0 && (
          <Text typography="t7" fontWeight="medium" color={colors.grey500}>
            {myReservationList.length}건
          </Text>
        )}
      </div>
      <Spacing size={16} />

      {myReservationList.length === 0 ? (
        <div
          css={css`
            padding: 40px 0;
            text-align: center;
            background: ${colors.grey50};
            border-radius: 14px;
          `}
        >
          <Text typography="t6" color={colors.grey500}>
            예약 내역이 없습니다.
          </Text>
        </div>
      ) : (
        <div
          css={css`
            display: flex;
            flex-direction: column;
            gap: 10px;
          `}
        >
          {myReservationList.map(reservation => (
            <MyReservationListItem key={reservation.id} reservation={reservation} />
          ))}
        </div>
      )}
    </div>
  );
}

function MyReservationListItem({ reservation }: { reservation: Reservation }) {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: rooms = [] } = useQuery(['rooms'], getRooms);

  const cancelMutation = useMutation((id: string) => cancelReservation(id), {
    onSuccess: () => {
      queryClient.invalidateQueries(['reservations']);
      queryClient.invalidateQueries(['myReservations']);
    },
  });

  const getRoomName = (roomId: string) =>
    rooms.find((r: { id: string; name: string }) => r.id === roomId)?.name ?? roomId;

  return (
    <div
      key={reservation.id}
      css={css`
        padding: 14px 16px;
        border-radius: 14px;
        background: ${colors.grey50};
        border: 1px solid ${colors.grey200};
      `}
    >
      <ListRow
        contents={
          <ListRow.Text2Rows
            top={getRoomName(reservation.roomId)}
            topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
            bottom={`${reservation.date} ${reservation.start}~${reservation.end} · ${reservation.attendees}명 · ${
              reservation.equipment.map((e: string) => EQUIPMENT_LABELS[e]).join(', ') || '장비 없음'
            }`}
            bottomProps={{ typography: 't7', color: colors.grey600 }}
          />
        }
        right={
          <Button
            type="danger"
            style="weak"
            size="small"
            onClick={async e => {
              e.stopPropagation();
              if (window.confirm('정말 취소하시겠습니까?')) {
                try {
                  await cancelMutation.mutateAsync(reservation.id);
                  navigate('/', { state: { type: 'success', text: '예약이 취소되었습니다.' } });
                } catch {
                  navigate('/', { state: { type: 'error', text: '취소에 실패했습니다.' } });
                }
              }
            }}
          >
            취소
          </Button>
        }
      />
    </div>
  );
}
