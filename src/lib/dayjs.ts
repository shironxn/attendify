import dayjs from "dayjs";
import "dayjs/locale/id";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";

export default function djs(date?: dayjs.ConfigType) {
  dayjs.locale("id");
  dayjs.extend(isSameOrAfter);
  return dayjs(date);
}
