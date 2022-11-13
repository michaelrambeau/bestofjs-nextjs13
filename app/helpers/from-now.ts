import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
dayjs.extend(relativeTime);

// Function equivalent to moment(<stringDate>).fromNow()
// but vague-time module is lighter than moment!
export function fromNow(strDate: string | Date): string {
  return dayjs().from(dayjs(strDate), true)
  // try {
  //   const date: Date = new Date(new Date(strDate));
  //   const formattedDate = vagueTime
  //     .get({ to: date })
  //     .replace("a couple of", "2");
  //   if (/\d+ years ago|a year ago/.test(formattedDate))
  //     return `in ${date.getFullYear()}`;
  //   return formattedDate;
  // } catch (e) {
  //   // avoid throwing "Invalid date" errors
  //   return "?";
  // }
}
