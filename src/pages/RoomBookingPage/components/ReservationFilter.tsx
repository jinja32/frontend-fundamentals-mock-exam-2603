import { css } from '@emotion/react';
import { useQuery } from '@tanstack/react-query';
import { Spacing, Text, Select } from '_tosslib/components';
import { colors } from '_tosslib/constants/colors';
import { getRooms } from 'pages/remotes';
import { formatDate } from 'utils/date';
import { ALL_EQUIPMENT, EQUIPMENT_LABELS } from 'constants/equipment';
import { TIME_SLOTS } from 'constants/time';
import { useReservationFilter } from '../hooks/useReservationFilter';
import { useSelectedRoomId } from '../hooks/useSelectedRoomId';

export function ReservationFilter() {
  return (
    <div
      css={css`
        padding: 0 24px;
      `}
    >
      <Text typography="t5" fontWeight="bold" color={colors.grey900}>
        예약 조건
      </Text>
      <Spacing size={16} />

      {/* 날짜 */}
      <SelectDate />
      <Spacing size={14} />

      {/* 시간 */}
      <div
        css={css`
          display: flex;
          gap: 12px;
        `}
      >
        <SelectStartTime />
        <SelectEndTime />
      </div>
      <Spacing size={14} />

      {/* 참석 인원 + 선호 층 */}
      <div
        css={css`
          display: flex;
          gap: 12px;
        `}
      >
        <SelectAttendees />
        <SelectPreferredFloor />
      </div>
      <Spacing size={14} />

      {/* 장비 */}
      <SelectEquipment />
    </div>
  );
}

function SelectDate() {
  const [{ date }, setReservationFilter] = useReservationFilter();
  const [selectedRoomId, setSelectedRoomId] = useSelectedRoomId();

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 6px;
      `}
    >
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        날짜
      </Text>
      <input
        type="date"
        defaultValue={date}
        min={formatDate(new Date())}
        onChange={e => {
          setReservationFilter({ date: e.target.value });
          setSelectedRoomId(null);
        }}
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
  );
}

function SelectStartTime() {
  const [{ startTime }, setReservationFilter] = useReservationFilter();
  const [selectedRoomId, setSelectedRoomId] = useSelectedRoomId();

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
      `}
    >
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        시작 시간
      </Text>
      <Select
        defaultValue={startTime}
        onChange={e => {
          setReservationFilter({ startTime: e.target.value });
          setSelectedRoomId(null);
        }}
        aria-label="시작 시간"
      >
        <option value="">선택</option>
        {TIME_SLOTS.slice(0, -1).map(t => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Select>
    </div>
  );
}

function SelectEndTime() {
  const [{ endTime }, setReservationFilter] = useReservationFilter();
  const [selectedRoomId, setSelectedRoomId] = useSelectedRoomId();

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
      `}
    >
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        종료 시간
      </Text>
      <Select
        defaultValue={endTime}
        onChange={e => {
          setReservationFilter({ endTime: e.target.value });
          setSelectedRoomId(null);
        }}
        aria-label="종료 시간"
      >
        <option value="">선택</option>
        {TIME_SLOTS.slice(1).map(t => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </Select>
    </div>
  );
}

function SelectAttendees() {
  const [{ attendees }, setReservationFilter] = useReservationFilter();
  const [selectedRoomId, setSelectedRoomId] = useSelectedRoomId();

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
      `}
    >
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        참석 인원
      </Text>
      <input
        type="number"
        min={1}
        defaultValue={attendees}
        placeholder="1"
        onChange={e => {
          setReservationFilter({ attendees: Math.max(1, Number(e.target.value)) });
          setSelectedRoomId(null);
        }}
        aria-label="참석 인원"
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
  );
}

function SelectPreferredFloor() {
  const [{ preferredFloor }, setReservationFilter] = useReservationFilter();
  const [selectedRoomId, setSelectedRoomId] = useSelectedRoomId();

  const { data: rooms = [] } = useQuery(['rooms'], getRooms);

  const floors = [...new Set(rooms.map((r: { floor: number }) => r.floor))].sort((a: number, b: number) => a - b);

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        gap: 6px;
        flex: 1;
      `}
    >
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        선호 층
      </Text>
      <Select
        defaultValue={preferredFloor ?? ''}
        onChange={e => {
          const val = e.target.value;
          setReservationFilter({ preferredFloor: val === '' ? null : Number(val) });
          setSelectedRoomId(null);
        }}
        aria-label="선호 층"
      >
        <option value="">전체</option>
        {floors.map((f: number) => (
          <option key={f} value={f}>
            {f}층
          </option>
        ))}
      </Select>
    </div>
  );
}

function SelectEquipment() {
  const [{ equipment }, setReservationFilter] = useReservationFilter();
  const [selectedRoomId, setSelectedRoomId] = useSelectedRoomId();

  return (
    <div>
      <Text as="label" typography="t7" fontWeight="medium" color={colors.grey600}>
        필요 장비
      </Text>
      <Spacing size={8} />
      <div
        css={css`
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        `}
      >
        {ALL_EQUIPMENT.map(eq => {
          const selected = equipment.includes(eq);
          return (
            <button
              key={eq}
              type="button"
              onClick={() => {
                const next = selected ? equipment.filter(e => e !== eq) : [...equipment, eq];
                setReservationFilter({ equipment: next });
                setSelectedRoomId(null);
              }}
              aria-label={EQUIPMENT_LABELS[eq]}
              aria-pressed={selected}
              css={css`
                padding: 8px 16px;
                border-radius: 20px;
                border: 1px solid ${selected ? colors.blue500 : colors.grey200};
                background: ${selected ? colors.blue50 : colors.grey50};
                color: ${selected ? colors.blue600 : colors.grey700};
                font-size: 14px;
                font-weight: 500;
                cursor: pointer;
                transition: all 0.15s;
                &:hover {
                  border-color: ${selected ? colors.blue500 : colors.grey400};
                }
              `}
            >
              {EQUIPMENT_LABELS[eq]}
            </button>
          );
        })}
      </div>
    </div>
  );
}
