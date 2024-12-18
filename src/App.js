import React from "react";
import "./App.css";
import axios from "axios";
import Calendar from "react-calendar";

class App extends React.Component {
  constructor() {
    super();
    this.state = {
      events: null,
      calendarId: "",
      startDate: null,
      endDate: null,
      fetchMessage: null,
      count: null,
      filteredEvents: null,
    };
  }

  // Updated fetchEventsData with pagination
  fetchEventsData = async () => {
    const { calendarId } = this.state;
    // Replace this key with your own valid Google API key (or secure it server-side)
    const apiKey = "AIzaSyAswGe1JBeS2co-1o1IC29K3savoRB742o";

    let allEvents = [];
    let pageToken = null;

    try {
      do {
        // Construct the URL for each "page" of results
        let url = `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&maxResults=2500`;
        if (pageToken) {
          url += `&pageToken=${pageToken}`;
        }

        const res = await axios.get(url);
        const { items, nextPageToken } = res.data;

        // Combine new items with total list
        allEvents = [...allEvents, ...items];
        // If there's a token, we loop again; if not, we're done
        pageToken = nextPageToken;
      } while (pageToken);

      // Process the aggregated events
      const processed = this.processEvents(allEvents);
      this.setState({
        events: allEvents,
        fetchMessage: "Successfully fetched all events",
        count: processed.length,
        filteredEvents: processed,
      });
    } catch (error) {
      console.error("Error fetching events:", error);
      this.setState({
        fetchMessage: "Failed to fetch events.",
      });
    }
  };

  processEvents = (events) => {
    // Only keep events that have not been cancelled,
    // have a valid start dateTime, and fall between selected start & end date
    const { startDate, endDate } = this.state;
    if (!startDate || !endDate) return [];

    let results = events.filter(
      (el) =>
        el.status !== "cancelled" &&
        el.start &&
        el.start.dateTime &&
        new Date(el.start.dateTime).getTime() > startDate &&
        new Date(el.start.dateTime).getTime() < endDate
    );

    console.log("Filtered events:", results);
    return results;
  };

  handleChange = (event) => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value,
    });
  };

  handleTime = (date) => {
    // date is an array of two selected dates [startDate, endDate]
    this.setState({
      startDate: new Date(date[0]).getTime(),
      endDate: new Date(date[1]).getTime(),
    });
  };

  render() {
    console.log("State:", this.state);

    return (
      <div className="App">
        <div>
          <h1 className="title">The People's Events Counter</h1>
          <h3>
            Make sure your calendar is set to PUBLIC or we can't fetch events
            data
          </h3>
          <h1>
            {this.state.count ? this.state.count + " events counted" : null}
          </h1>
          <p>{this.state.fetchMessage ? this.state.fetchMessage : null}</p>
        </div>
        <form>
          <label>
            Type your calendar ID: <br />
            <input
              type="text"
              name="calendarId"
              onChange={this.handleChange}
              value={this.state.calendarId}
              style={{ marginTop: "10px" }}
            />
          </label>
        </form>
        <div className="calendar_div">
          <Calendar onChange={this.handleTime} selectRange={true} />
        </div>
        <button className="fetchButton" onClick={this.fetchEventsData}>
          Click here to count
        </button>
        <div className="events_div">
          {this.state.filteredEvents
            ? this.state.filteredEvents.map((el, index) => {
                return (
                  <div key={index}>
                    <p>
                      {index}. {el.summary}
                    </p>
                    <p>{new Date(el.start.dateTime).toDateString()}</p>
                  </div>
                );
              })
            : null}
        </div>
      </div>
    );
  }
}

export default App;
