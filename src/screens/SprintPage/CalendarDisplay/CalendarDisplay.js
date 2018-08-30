import React, { Component } from "react";
import { Segment } from "semantic-ui-react";

import "./CalendarDisplay.css";

import FullCalendar from "fullcalendar-reactwrapper";
import "fullcalendar-reactwrapper/dist/css/fullcalendar.min.css";
import EventModal from "../../../components/Modal/EventModal/EventModal";

class CalendarDisplay extends Component {
  state = {
    modalOpen: false,
    events: [],
  };

  createEvent = newEvents => {
    const { events } = this.state;
    events.concat(newEvents);
    this.setState({
      events: events.concat(newEvents),
    });
  };

  render() {
    const { modalOpen, events } = this.state;
    console.log(events);

    return (
      <Segment id="Calendar">
        <EventModal
          createEvent={this.createEvent}
          onModalClose={() => this.setState({ modalOpen: false })}
          modalOpen={modalOpen}
        />
        <FullCalendar
          id="your-custom-ID"
          header={{
            left: "prev,next today createEvent",
            center: "title",
            right: "month,basicWeek,basicDay",
          }}
          customButtons={{
            createEvent: {
              text: "New event",
              click: () => this.setState({ modalOpen: true }),
            },
          }}
          height={800}
          navLinks={true} // can click day/week names to navigate views
          editable={true}
          eventLimit={true} // allow "more" link when too many events
          events={events}
        />
      </Segment>
    );
  }
}

export default CalendarDisplay;
