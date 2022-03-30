import { GoogleEvent } from "../types";

const getUpcomingEvents = async () => {
  try {
    // @ts-ignore
    const response = await gapi.client.calendar.events.list({
      calendarId: "primary",
      timeMin: new Date().toISOString(),
      showDeleted: false,
      singleEvents: true,
      maxResults: 10,
      orderBy: "startTime",
    });

    const events = response.result.items;
    let res = [];
    if (events.length > 0) {
      for (let i = 0; i < events.length; i++) {
        var event = events[i];
        var when = event.start.dateTime;
        if (!when) {
          when = event.start.date;
        }
        res.push({ event, when });
      }
    }
    return res as GoogleEvent[];
  } catch (e) {
    console.error(e);
    return [];
  }
  //
};
export { getUpcomingEvents };
