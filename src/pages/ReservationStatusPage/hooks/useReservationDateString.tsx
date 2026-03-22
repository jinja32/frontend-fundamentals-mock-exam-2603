import { useSearchParams } from 'react-router-dom';
import { formatDate } from 'utils/date';

export function useReservationDateString() {
  const [searchParams, setSearchParams] = useSearchParams();

  const dateString = searchParams.get(SEARCH_PARAM_KEY) || formatDate(new Date());
  const setDateString = (newDateString: string) => {
    setSearchParams(prev => ({ ...Object.fromEntries(prev), [SEARCH_PARAM_KEY]: newDateString }));
  };

  return [dateString, setDateString] as const;
}

const SEARCH_PARAM_KEY = 'dateString';
