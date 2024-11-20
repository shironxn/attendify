import dayjs from "dayjs";
import "dayjs/locale/id";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

export default function djs(date?: dayjs.ConfigType) {
  dayjs.locale("id");
  dayjs.extend(isSameOrAfter);
  dayjs.extend(localizedFormat);
  return dayjs(date);
}
