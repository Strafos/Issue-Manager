import React, { Component } from "react";

import "./CalendarDisplay.css";

import FullCalendar from "fullcalendar-reactwrapper";
import "fullcalendar-reactwrapper/dist/css/fullcalendar.min.css";

class CalendarDisplay extends Component {
  state = {
    openModal: false,
    events: [
      {
        title: "All Day Event",
        start: "2017-05-01",
      },
      {
        title: "Long Event",
        start: "2017-05-07",
        end: "2017-05-10",
      },
      {
        id: 999,
        title: "Repeating Event",
        start: "2017-05-09T16:00:00",
      },
      {
        id: 999,
        title: "Repeating Event",
        start: "2017-05-16T16:00:00",
      },
      {
        title: "Conference",
        start: "2017-05-11",
        end: "2017-05-13",
      },
      {
        title: "Meeting",
        start: "2017-05-12T10:30:00",
        end: "2017-05-12T12:30:00",
      },
      {
        title: "Birthday Party",
        start: "2017-05-13T07:00:00",
      },
      {
        title: "Click for Google",
        url: "http://google.com/",
        start: "2017-05-28",
      },
    ],
  };

  addEvent = () => {};

  render() {
    return (
      <div id="Calendar">
        <FullCalendar
          id="your-custom-ID"
          header={{
            left: "prev,next today createEvent",
            center: "title",
            right: "basicWeek",
          }}
          customButtons={{
            createEvent: {
              text: "New event",
              click: () => this.setState({ openModal: true }),
            },
          }}
          height={800}
          defaultView={"basicWeek"}
          // defaultDate={"2017-05-12"}
          navLinks={true} // can click day/week names to navigate views
          editable={true}
          eventLimit={true} // allow "more" link when too many events
          events={this.state.events}
        />
      </div>
    );
  }
}

export default CalendarDisplay;
