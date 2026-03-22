import { formatDate } from 'utils/date';
import { ArrayParam, NumberParam, StringParam, useQueryParams, withDefault } from 'use-query-params';

export interface ReservationFilter {
  date: string;
  startTime: string;
  endTime: string;
  attendees: number;
  equipment: string[];
  preferredFloor: number | null;
}

export function useReservationFilter() {
  const [query, setQuery] = useQueryParams(
    {
      [SEARCH_PARAM_KEYS.date]: withDefault(StringParam, formatDate(new Date())),
      [SEARCH_PARAM_KEYS.startTime]: withDefault(StringParam, ''),
      [SEARCH_PARAM_KEYS.endTime]: withDefault(StringParam, ''),
      [SEARCH_PARAM_KEYS.attendees]: withDefault(NumberParam, 1),
      [SEARCH_PARAM_KEYS.equipment]: withDefault(ArrayParam, [] as string[]),
      [SEARCH_PARAM_KEYS.preferredFloor]: withDefault(NumberParam, null),
    } satisfies Record<(typeof SEARCH_PARAM_KEYS)[keyof typeof SEARCH_PARAM_KEYS], unknown>,
    {
      updateType: 'replaceIn',
      enableBatching: true,
    }
  );

  const reservationFilter: ReservationFilter = {
    date: query[SEARCH_PARAM_KEYS.date],
    startTime: query[SEARCH_PARAM_KEYS.startTime],
    endTime: query[SEARCH_PARAM_KEYS.endTime],
    attendees: query[SEARCH_PARAM_KEYS.attendees],
    equipment: query[SEARCH_PARAM_KEYS.equipment].filter((item): item is string => item !== null) as string[],
    preferredFloor: query[SEARCH_PARAM_KEYS.preferredFloor],
  };
  function setReservationFilter(newReservationFilter: Partial<ReservationFilter>) {
    setQuery({
      ...(newReservationFilter.date ? { [SEARCH_PARAM_KEYS.date]: newReservationFilter.date } : {}),
      ...(newReservationFilter.startTime ? { [SEARCH_PARAM_KEYS.startTime]: newReservationFilter.startTime } : {}),
      ...(newReservationFilter.endTime ? { [SEARCH_PARAM_KEYS.endTime]: newReservationFilter.endTime } : {}),
      ...(newReservationFilter.attendees ? { [SEARCH_PARAM_KEYS.attendees]: newReservationFilter.attendees } : {}),
      ...(newReservationFilter.equipment ? { [SEARCH_PARAM_KEYS.equipment]: newReservationFilter.equipment } : {}),
      ...(newReservationFilter.preferredFloor
        ? { [SEARCH_PARAM_KEYS.preferredFloor]: newReservationFilter.preferredFloor }
        : {}),
    });
  }

  return [reservationFilter, setReservationFilter] as const;
}

// export function useReservationFilter2() {
//   const [searchParams, setSearchParams] = useSearchParams();

//   const reservationFilter: ReservationFilter = {
//     date: searchParams.get(SEARCH_PARAM_KEYS.date) || formatDate(new Date()),
//     startTime: searchParams.get(SEARCH_PARAM_KEYS.startTime) || '',
//     endTime: searchParams.get(SEARCH_PARAM_KEYS.endTime) || '',
//     attendees: Number(searchParams.get(SEARCH_PARAM_KEYS.attendees)) || 1,
//     equipment: searchParams.get(SEARCH_PARAM_KEYS.equipment)?.split(',').filter(Boolean) || [],
//     preferredFloor: searchParams.get(SEARCH_PARAM_KEYS.preferredFloor)
//       ? Number(searchParams.get(SEARCH_PARAM_KEYS.preferredFloor))
//       : null,
//   };
//   function setReservationFilter(newReservationFilter: Partial<ReservationFilter>) {
//     setSearchParams(prev => {
//       const newSearchParams = new URLSearchParams(prev);
//       // 필터가 변경되면 선택된 회의실 ID도 초기화해야 한다.
//       newSearchParams.delete(SELECTED_ROOM_ID_SEARCH_PARAM_KEY);

//       Object.entries(newReservationFilter).forEach(([key, value]) => {
//         const searchParamKey = SEARCH_PARAM_KEYS[key as keyof typeof SEARCH_PARAM_KEYS];

//         if (value === null || value === undefined || value === '') {
//           newSearchParams.delete(searchParamKey);
//         } else if (Array.isArray(value)) {
//           if (value.length === 0) {
//             newSearchParams.delete(searchParamKey);
//           } else {
//             newSearchParams.set(searchParamKey, value.join(','));
//           }
//         } else {
//           newSearchParams.set(searchParamKey, String(value));
//         }
//       });

//       return newSearchParams;
//     });
//   }

//   return [reservationFilter, setReservationFilter] as const;
// }

const SEARCH_PARAM_KEYS = {
  date: 'date',
  startTime: 'startTime',
  endTime: 'endTime',
  attendees: 'attendees',
  equipment: 'equipment',
  preferredFloor: 'floor',
} as const satisfies Record<keyof ReservationFilter, string>;
