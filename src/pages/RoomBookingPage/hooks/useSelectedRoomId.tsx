import { StringParam, useQueryParam } from 'use-query-params';

export function useSelectedRoomId() {
  const [selectedRoomId, setSelectedRoomId] = useQueryParam(SELECTED_ROOM_ID_SEARCH_PARAM_KEY, StringParam, {
    updateType: 'replaceIn',
    enableBatching: true,
  });

  return [selectedRoomId, setSelectedRoomId] as const;
}

// export function useSelectedRoomId2() {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const selectedRoomId = searchParams.get(SELECTED_ROOM_ID_SEARCH_PARAM_KEY);
//   const setSelectedRoomId = (newRoomId: SelectedRoomId) => {
//     setSearchParams(prev => {
//       const newSearchParams = new URLSearchParams(prev);

//       if (newRoomId === null) {
//         newSearchParams.delete(SELECTED_ROOM_ID_SEARCH_PARAM_KEY);
//       } else {
//         newSearchParams.set(SELECTED_ROOM_ID_SEARCH_PARAM_KEY, newRoomId);
//       }

//       return newSearchParams;
//     });
//   };

//   return [selectedRoomId, setSelectedRoomId] as const;
// }

export const SELECTED_ROOM_ID_SEARCH_PARAM_KEY = 'selectedRoomId';
