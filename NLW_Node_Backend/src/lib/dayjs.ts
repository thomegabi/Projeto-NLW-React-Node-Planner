import "dayjs/locale/pt-br"
import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";

dayjs.locale('pt-br');
dayjs.extend(localizedFormat);

export { dayjs }
