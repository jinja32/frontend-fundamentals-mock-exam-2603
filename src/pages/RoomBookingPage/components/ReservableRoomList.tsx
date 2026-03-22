import { css } from '@emotion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Spacing, Text, ListRow, FixedBottomCTA } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms, getReservations, createReservation } from 'pages/remotes';
import axios from 'axios';
import { EQUIPMENT_LABELS } from 'constants/equipment';
import { useReservationFilter } from '../hooks/useReservationFilter';
import { useSelectedRoomId } from '../hooks/useSelectedRoomId';
import { validateReservationFilter, validateRoomByReservationFilter } from '../utils/validate';

export function ReservableRoomList() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { search } = useLocation();

  const [reservationFilter] = useReservationFilter();
  const { date, startTime, endTime, attendees, equipment, preferredFloor } = reservationFilter;

  const [selectedRoomId, setSelectedRoomId] = useSelectedRoomId();

  const { data: rooms = [] } = useQuery(['rooms'], getRooms);
  const { data: reservations = [] } = useQuery(['reservations', date], () => getReservations(date), {
    enabled: !!date,
  });

  const createMutation = useMutation(
    (data: { roomId: string; date: string; start: string; end: string; attendees: number; equipment: string[] }) =>
      createReservation(data),
    {
      onSuccess: (_data, variables) => {
        queryClient.invalidateQueries(['reservations', variables.date]);
        queryClient.invalidateQueries(['myReservations']);
      },
    }
  );

  const validationResult = validateReservationFilter(reservationFilter);
  const isFilterComplete = validationResult.type === 'success';

  const timeFilteredReservationIds = reservations
    .filter(reservation => reservation.date === date && reservation.start < endTime && reservation.end > startTime)
    .map(room => room.id);

  const availableRooms = rooms
    .filter(room => validateRoomByReservationFilter(room, reservationFilter))
    .filter(room => !timeFilteredReservationIds.includes(room.id))
    .sort((a, b) => (a.floor === b.floor ? a.name.localeCompare(b.name) : a.floor - b.floor));

  const handleBook = async () => {
    if (!selectedRoomId) {
      navigate(`/booking${search}`, { state: '회의실을 선택해주세요.', replace: true });
      return;
    }
    if (validationResult.type === 'error') {
      navigate(`/booking${search}`, { state: validationResult.message, replace: true });
      return;
    }

    try {
      const result = await createMutation.mutateAsync({
        roomId: selectedRoomId,
        date,
        start: startTime,
        end: endTime,
        attendees,
        equipment,
      });

      if ('ok' in result && result.ok) {
        navigate('/', { state: { type: 'success', text: '예약이 완료되었습니다!' } });
        return;
      }

      const errResult = result as { message?: string };
      navigate(`/booking${search}`, { state: errResult.message ?? '예약에 실패했습니다.', replace: true });
      setSelectedRoomId(null);
    } catch (err: unknown) {
      let serverMessage = '예약에 실패했습니다.';
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string } | undefined;
        serverMessage = data?.message ?? serverMessage;
      }
      navigate(`/booking${search}`, { state: serverMessage, replace: true });
      setSelectedRoomId(null);
    }
  };

  if (!isFilterComplete) {
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
          display: flex;
          align-items: baseline;
          gap: 6px;
        `}
      >
        <Text typography="t5" fontWeight="bold" color={colors.grey900}>
          예약 가능 회의실
        </Text>
        <Text typography="t7" fontWeight="medium" color={colors.grey500}>
          {availableRooms.length}개
        </Text>
      </div>
      <Spacing size={16} />
      {availableRooms.length === 0 ? (
        <div
          css={css`
            padding: 40px 0;
            text-align: center;
            background: ${colors.grey50};
            border-radius: 14px;
          `}
        >
          <Text typography="t6" color={colors.grey500}>
            조건에 맞는 회의실이 없습니다.
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
          {availableRooms.map(
            (room: { id: string; name: string; floor: number; capacity: number; equipment: string[] }) => {
              const isSelected = selectedRoomId === room.id;
              return (
                <div
                  key={room.id}
                  onClick={() => setSelectedRoomId(room.id)}
                  role="button"
                  aria-pressed={isSelected}
                  aria-label={room.name}
                  css={css`
                    cursor: pointer;
                    padding: 14px 16px;
                    border-radius: 14px;
                    border: 2px solid ${isSelected ? colors.blue500 : colors.grey200};
                    background: ${isSelected ? colors.blue50 : colors.white};
                    transition: all 0.15s;
                    &:hover {
                      border-color: ${isSelected ? colors.blue500 : colors.grey300};
                    }
                  `}
                >
                  <ListRow
                    contents={
                      <ListRow.Text2Rows
                        top={room.name}
                        topProps={{ typography: 't6', fontWeight: 'bold', color: colors.grey900 }}
                        bottom={`${room.floor}층 · ${room.capacity}명 · ${room.equipment
                          .map((e: string) => EQUIPMENT_LABELS[e])
                          .join(', ')}`}
                        bottomProps={{ typography: 't7', color: colors.grey600 }}
                      />
                    }
                    right={
                      isSelected ? (
                        <Text typography="t7" fontWeight="bold" color={colors.blue500}>
                          선택됨
                        </Text>
                      ) : undefined
                    }
                  />
                </div>
              );
            }
          )}
        </div>
      )}
      <Spacing size={16} />
      <FixedBottomCTA onClick={handleBook} disabled={createMutation.isLoading}>
        {createMutation.isLoading ? '예약 중...' : '확정'}
      </FixedBottomCTA>
    </div>
  );
}
