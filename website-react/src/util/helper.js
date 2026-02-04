import dayjs from "dayjs";

export const dateClient = (date, format = "DD-MMMM-YYYY") => {
  if (date) {
    return dayjs(date).format(format);
  }
  return null;
};
