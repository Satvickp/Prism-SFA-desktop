import "react-big-calendar/lib/css/react-big-calendar.css";
import withDragAndDrop from "react-big-calendar/lib/addons/dragAndDrop";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import getRandomColor from "../../../../helper/getRandomColor";

const localizer = momentLocalizer(moment);

export default function Calendar(props) {
  const DragAndDropCalendar = withDragAndDrop(BigCalendar);

  // Map to store event colors
  const eventColors = new Map();
  const today = new Date()

  // Event style getter
  const eventStyleGetter = (event) => {
    const backgroundColor = getRandomColor(event.beetJourneyPlanStatus);
  
    return {
      style: {
        backgroundColor, // Use the calculated color
        color: "white", // Ensure text is readable
        borderRadius: "5px", // Optional: Add a border radius for a softer look
        border: "none", // Remove default borders
      },
    };
  };

  // Add color to each event if not already provided
  const eventsWithColors = props.events.map((event) => ({
    ...event,
    color: event.color || getRandomColor(event.beetJourneyPlanStatus),
  }));

  return (
    <DragAndDropCalendar
      localizer={localizer}
      {...props}
      events={eventsWithColors} // Pass updated events with colors
      eventPropGetter={eventStyleGetter}
      startAccessor="start"
      endAccessor="end"
      defaultView="month"
      draggableAccessor={(event) => props.isDraggable || true}
      defaultDate={new Date()}
      min={today}
      selectable={true}
    />
  );
}
