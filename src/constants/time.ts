import { formatTime } from 'utils/format';

export const TIME_SLOTS: string[] = Array.from({ length: 23 }, (_, i) =>
  formatTime(Math.floor(i / 2) + 9, (i % 2) * 30)
);
