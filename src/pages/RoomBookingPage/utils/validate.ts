import { ReservationFilter } from '../hooks/useReservationFilter';

export function validateReservationFilter(
  reservationFilter: ReservationFilter
): { type: 'error'; message: string } | { type: 'success' } {
  const { startTime, endTime, attendees } = reservationFilter;

  if (startTime === '' || endTime === '') {
    return { type: 'error', message: '시작 시간과 종료 시간을 선택해주세요.' };
  }

  if (endTime <= startTime) {
    return { type: 'error', message: '종료 시간은 시작 시간보다 늦어야 합니다.' };
  }

  if (attendees < 1) {
    return { type: 'error', message: '참석 인원은 1명 이상이어야 합니다.' };
  }

  return { type: 'success' };
}
