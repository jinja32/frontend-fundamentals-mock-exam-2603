import { StringParam, useQueryParam } from 'use-query-params';

export function useSelectedRoomId() {
  const [selectedRoomId, setSelectedRoomId] = useQueryParam(SEARCH_PARAM_KEY, StringParam, {
    updateType: 'replaceIn',
    enableBatching: true,
  });

  return [selectedRoomId, setSelectedRoomId] as const;
}

const SEARCH_PARAM_KEY = 'selectedRoomId';
