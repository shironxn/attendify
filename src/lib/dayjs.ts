import dayjs from "dayjs";
import "dayjs/locale/id";

export default function djs(date?: dayjs.ConfigType) {
  dayjs.locale("id");
  return dayjs(date);
}
