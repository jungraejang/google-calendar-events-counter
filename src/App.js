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
      filteredEvents: null
    };
  }

  fetchEventsData = () => {
    let { calendarId } = this.state;
    let apiKey = "AIzaSyDyj2EMI6tvgE76x7oLx2jbaUWHU-FW5ng";
    axios
      .get(
        `https://www.googleapis.com/calendar/v3/calendars/${calendarId}/events?key=${apiKey}&maxResults=2500`
      )
      .then(res => {
        console.log("res: ", res);
        this.setState({
          events: res.data.items,
          fetchMessage: "Successfully fetched all events",
          count: this.processEvents(res.data.items).length,
          filteredEvents: this.processEvents(res.data.items)
        });
      });
  };

  processEvents = events => {
    let results = events.filter(
      el =>
        el.status !== "cancelled" &&
        el.start.dateTime &&
        new Date(el.start.dateTime).getTime() > this.state.startDate &&
        new Date(el.start.dateTime).getTime() < this.state.endDate
    );
    console.log(results);
    return results;
  };

  handleChange = event => {
    event.preventDefault();
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  handleTime = date => {
    this.setState({
      startDate: new Date(date[0]).getTime(),
      endDate: new Date(date[1]).getTime()
    });
  };

  render() {
    console.log(this.state);
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
            ? this.state.filteredEvents.map((el, key) => {
                return (
                  <>
                    <p key={key}>
                      {key}. {el.summary}
                    </p>
                    <p key={key}>
                      {new Date(el.start.dateTime).toDateString()}
                    </p>
                  </>
                );
              })
            : null}
        </div>
      </div>
    );
  }
}

export default App;
