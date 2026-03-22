import { StringParam, useQueryParam } from 'use-query-params';

export function useActiveReservationId() {
  const [activeReservationId, setActiveReservationId] = useQueryParam(SEARCH_PARAM_KEY, StringParam, {
    updateType: 'replaceIn',
    enableBatching: true,
  });

  return [activeReservationId, setActiveReservationId] as const;
}

const SEARCH_PARAM_KEY = 'activeReservationId';
