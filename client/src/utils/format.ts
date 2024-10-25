import { differenceInMinutes, differenceInDays, format, differenceInHours, formatDistanceToNowStrict, differenceInSeconds, differenceInCalendarDays } from 'date-fns';

export const formatDateMessage1 = (date: Date) => {
  const now = new Date();
  const secondsDifference = differenceInSeconds(now, date);
  const minutesDifference = differenceInMinutes(now, date);
  const hoursDifference = differenceInHours(now, date);
  const daysDifference = differenceInDays(now, date);

  switch (true) {
    case secondsDifference < 60:
      return "just now";
    case minutesDifference < 60:
      return String(minutesDifference).padStart(2, '0') + ' min';

    case hoursDifference < 7:
      return String(hoursDifference).padStart(2, '0') + ' hours';
    case hoursDifference < 25:
      return format(date, 'hh:mm a');
    case daysDifference < 8:
      return String(daysDifference) + ' days';

    default:
      return format(date, 'dd/MM');
  }
};

export const formatDateMessage2 = (date: Date) => {
  const now = new Date();
  const secondsDifference = differenceInSeconds(now, date);
  const hoursDifference = differenceInHours(now, date);

  if (secondsDifference < 60) {
    return "just now";
  } else if (hoursDifference < 1) {
    // Nếu dưới 1 giờ
    const result = formatDistanceToNowStrict(date, { addSuffix: false });
    return result.replace(/minutes?/, 'min').padStart(5, '0');  // Đổi 'minutes' thành 'min' và format 01 min
  } else if (hoursDifference < 24) {
    // Nếu dưới 24 giờ thì hiển thị định dạng giờ: phút AM/PM
    return format(date, 'hh:mm a');  // Ví dụ: 01:00 PM
  } else {
    // Nếu hơn 24 giờ thì hiển thị định dạng ngày/tháng
    return format(date, 'dd/MM');  // Ví dụ: 14/12
  }
};

export const compareDateToNow = (date: Date) => {
  const now = new Date();
  const daysDifference = differenceInCalendarDays(now, date);
  
  if (daysDifference === 0) {
    return "Today";
  } else if (daysDifference === 1) {
    return "Yesterday";
  } else {
    return format(date, "E P");
  }
};