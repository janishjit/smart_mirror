const getAuthState = () => {
  /* @ts-ignore */
  return gapi.auth2.getAuthInstance().isSignedIn.get();
};

const signIn = () => {
  /* @ts-ignore */
  gapi.load("auth2", function () {
    /* Ready. Make a call to gapi.auth2.init or some other API */
    /* @ts-ignore */
    gapi.auth2.getAuthInstance().signIn();
  });
};

const getUpcomingEvents = async () => {
  console.log("Getting Upcoming Events");

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

    console.log(response);

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
    console.log(res);

    return res;
  } catch (e) {
    console.log("error getting calendar data");
    console.log(e);
  }
  //
};
export { getAuthState, signIn, getUpcomingEvents };
