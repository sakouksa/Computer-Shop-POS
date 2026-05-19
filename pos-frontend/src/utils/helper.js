import dayjs from "dayjs";
import "dayjs/locale/km";
import { profileStore } from "../store/profileStore";

export const dateClient = (date) => {
  if (date) {
    return dayjs(date).format("DD MMMM YYYY");
  }
  return null;
};
// for send to Database server (YYYY-MM-DD)
export const dateServer = (date) => {
  if (date) {
    return dayjs(date).format("YYYY-MM-DD");
  }
  return null;
};
// For converting values ​​from Database to DatePicker (AntD)
export const formatToPicker = (date) => {
  return date ? dayjs(date) : null;
};
// permission helper
export const isPermissionAction = (permission_name) => {
  // "Product.create" , "Product.update", "Product.delete"
  const { permission } = profileStore.getState();
  if (permission) {
    let findIndex = permission?.findIndex(
      (item) => item.name == permission_name,
    );
    if (findIndex == -1) {
      return false; // has permission
    }
  }
  return true; // no permission
};

