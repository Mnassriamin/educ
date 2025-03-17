import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardContent,
  CardHeader,
  Container,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { Calendar, dateFnsLocalizer } from "react-big-calendar";
import { format, parse, startOfWeek, getDay } from "date-fns";
import { enUS } from "date-fns/locale";
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Components
import AddDatePickerEventModal from "./AddDatePickerEventModal";
import PlanningInfoModal from "./PlanningInfoModal";

const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const initialCourseFormData = {
  courseName: "",
  start: undefined,
  end: undefined,
  classId: "",
  color: "#b64fc8", // default color
  recurrenceRule: "", // initially empty
};

const EventPlaning = () => {
  const [events, setEvents] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);
  const [openDatepickerModal, setOpenDatepickerModal] = useState(false);
  const [eventInfoModal, setEventInfoModal] = useState(false);
  const [courseFormData, setCourseFormData] = useState(initialCourseFormData);
  const [classes, setClasses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [selectedProfessorId, setSelectedProfessorId] = useState("all");
  const [userType, setUserType] = useState(null);

  const getToken = () => localStorage.getItem("token");

  useEffect(() => {
    const token = getToken();
    if (!token) return;
    try {
      const decoded = jwtDecode(token);
      setUserType(decoded.type);
      if (decoded.type === "admin") {
        // Admin planning view: load all planning events from planning endpoint.
        loadPlanningData(token);
        loadProfessors(token);
        loadClasses();
      } else if (decoded.type === "parent") {
        loadParentData(token, decoded.id);
      } else if (decoded.type === "prof") {
        // Teacher planning view: load planning events filtered by teacher id.
        loadTeacherPlanningData(token, decoded.id);
        loadClasses();
      }
    } catch (err) {
      console.error("Invalid token:", err);
      setUserType(null);
    }
  }, []);

  // Admin planning: load all planning courses
  const loadPlanningData = async (token) => {
    try {
      const resp = await axios.get("http://localhost:5000/api/planning/courses", {
        headers: { Authorization: token },
      });
      const planningCourses = resp.data.map((course) => ({
        ...course,
        start: new Date(course.datedebut),
        end: new Date(course.datefin),
      }));
      setEvents(planningCourses);
    } catch (error) {
      console.error("Error loading planning courses:", error);
    }
  };

  // Teacher planning: load planning courses and filter by teacher id.
  const loadTeacherPlanningData = async (token, teacherId) => {
    try {
      const resp = await axios.get("http://localhost:5000/api/planning/courses", {
        headers: { Authorization: token },
      });
      const planningCourses = resp.data.map((course) => ({
        ...course,
        start: new Date(course.datedebut),
        end: new Date(course.datefin),
      }));
      const teacherCourses = planningCourses.filter((course) => {
        if (!course.enseignant) return false;
        if (typeof course.enseignant === "object") {
          return course.enseignant._id.toString() === teacherId;
        } else {
          return course.enseignant.toString() === teacherId;
        }
      });
      setEvents(teacherCourses);
    } catch (error) {
      console.error("Error loading teacher planning courses:", error);
    }
  };

  // For parents, load courses from /api/cours.
  const loadParentData = async (token, userId) => {
    try {
      const coursesResp = await axios.get("http://localhost:5000/api/cours", {
        headers: { Authorization: token },
      });
      const dbEvents = coursesResp.data.map((course) => ({
        ...course,
        start: new Date(course.datedebut),
        end: new Date(course.datefin),
      }));
      setEvents(dbEvents);
    } catch (error) {
      console.error("Error loading parent courses:", error);
    }
  };

  // For admin: load all courses from /api/cours if needed.
  const loadProfData = async (token, userId) => {
    try {
      const coursesResp = await axios.get("http://localhost:5000/api/cours", {
        headers: { Authorization: token },
      });
      const filteredCourses = coursesResp.data.filter((course) => {
        if (!course.enseignant) return false;
        if (typeof course.enseignant === "object") {
          return course.enseignant._id.toString() === userId;
        } else {
          return course.enseignant.toString() === userId;
        }
      });
      const dbEvents = filteredCourses.map((course) => ({
        ...course,
        start: new Date(course.datedebut),
        end: new Date(course.datefin),
      }));
      setEvents(dbEvents);
    } catch (error) {
      console.error("Error loading professor courses:", error);
    }
  };

  const loadClasses = async () => {
    try {
      const resp = await axios.get("http://localhost:5000/classes");
      setClasses(resp.data);
    } catch (error) {
      console.error("Error loading classes:", error);
    }
  };

  const loadProfessors = async (token) => {
    try {
      const resp = await axios.get("http://localhost:5000/api/profs", {
        headers: { Authorization: token },
      });
      setProfessors(resp.data);
    } catch (error) {
      console.error("Error loading professors:", error);
    }
  };

  const handleProfessorChange = (event) => {
    const profId = event.target.value;
    setSelectedProfessorId(profId);
    if (profId === "all") {
      loadPlanningData(getToken());
    } else {
      const filtered = events.filter((course) => {
        if (!course.enseignant) return false;
        if (typeof course.enseignant === "object") {
          return course.enseignant._id.toString() === profId;
        } else {
          return course.enseignant.toString() === profId;
        }
      });
      setEvents(filtered);
    }
  };

  const onAddToTimetable = async () => {
    if (!currentEvent) return;
    const token = getToken();
    if (!token) {
      alert("Not logged in.");
      return;
    }
    try {
      const payload = {
        name: currentEvent.name,
        datedebut: currentEvent.datedebut,
        datefin: currentEvent.datefin,
        class: currentEvent.class,
        matiere:
          typeof currentEvent.matiere === "object"
            ? currentEvent.matiere._id
            : currentEvent.matiere,
        enseignant: currentEvent.enseignant,
        color: currentEvent.color,
      };
      await axios.post("http://localhost:5000/api/cours", payload, {
        headers: { Authorization: token },
      });
      alert("Event successfully added to your timetable.");
      setEventInfoModal(false);
    } catch (error) {
      console.error("Error adding event to timetable:", error.response?.data || error.message);
      alert("Failed to add event to timetable. Please try again.");
    }
  };

  const handleSelectSlot = (slotInfo) => {
    if (userType !== "admin") {
      alert("Only admins can add planning events.");
      return;
    }
    setOpenDatepickerModal(true);
  };

  const handleSelectEvent = (calEvt) => {
    setCurrentEvent(calEvt);
    setEventInfoModal(true);
  };

  // Admin: create a planning event, with optional recurrence.
  const onAddEventFromDatePicker = async () => {
    if (userType !== "admin") {
      alert("Only admins can create planning events.");
      return;
    }
    const token = getToken();
    if (!token) {
      alert("Not logged in.");
      return;
    }
    if (selectedProfessorId === "all") {
      alert("Please select a specific teacher to add the course for.");
      return;
    }
    const teacherId = selectedProfessorId;
    const { courseName, start, end, classId, color, recurrenceRule } = courseFormData;
    const linkedMatiere = localStorage.getItem("matiereId");
    if (!linkedMatiere) {
      alert("No linked matière found. Please login as a professor with a valid matière.");
      return;
    }
    const body = {
      name: courseName,
      datedebut: start || new Date(),
      datefin: end || new Date(),
      class: classId,
      matiere: linkedMatiere,
      enseignant: teacherId,
      color: color,
      recurrenceRule: recurrenceRule && recurrenceRule.trim() ? recurrenceRule.trim() : null,
    };
    try {
      const resp = await axios.post("http://localhost:5000/api/planning/course", body, {
        headers: { Authorization: token },
      });
      // In case the backend returns multiple events:
      if (resp.data.courses) {
        setEvents((prev) => [
          ...prev,
          ...resp.data.courses.map((saved) => ({
            ...saved,
            start: new Date(saved.datedebut),
            end: new Date(saved.datefin),
          })),
        ]);
      } else {
        const saved = resp.data.course;
        setEvents((prev) => [
          ...prev,
          { ...saved, start: new Date(saved.datedebut), end: new Date(saved.datefin) },
        ]);
      }
      setCourseFormData(initialCourseFormData);
      setOpenDatepickerModal(false);
    } catch (error) {
      console.error("Error adding event:", error.response?.data || error.message);
      alert("Failed to save event. Check console for details.");
    }
  };

  const onDeleteEvent = async () => {
    if (userType !== "admin") {
      alert("Only admins can delete planning events.");
      return;
    }
    if (!currentEvent?._id) return;
    const token = getToken();
    if (!token) {
      alert("Not logged in.");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/planning/course/${currentEvent._id}`, {
        headers: { Authorization: token },
      });
      setEvents((prev) => prev.filter((evt) => evt._id !== currentEvent._id));
      setEventInfoModal(false);
    } catch (error) {
      console.error("Error deleting event:", error.response?.data || error.message);
      alert("Failed to delete event. Check console for details.");
    }
  };

  return (
    <Box mt={2} mb={2} component="main" sx={{ flexGrow: 1, py: 8 }}>
      <Container maxWidth={false}>
        <Card>
          <CardHeader
            title="Emploie du temps"
            subheader={
              userType === "admin"
                ? "Admin view: manage planned courses."
                : "Teacher planning view: see planning events assigned to you."
            }
          />
          <Divider />
          <CardContent>
            {userType === "admin" && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ButtonGroup size="large" variant="contained">
                  <Button onClick={() => setOpenDatepickerModal(true)}>Add event</Button>
                </ButtonGroup>
                <FormControl sx={{ ml: 2, minWidth: 200 }}>
                  <InputLabel>Select Professor</InputLabel>
                  <Select
                    value={selectedProfessorId}
                    label="Select Professor"
                    onChange={handleProfessorChange}
                  >
                    <MenuItem value="all">All Professors</MenuItem>
                    {professors.map((prof) => (
                      <MenuItem key={prof._id} value={prof._id}>
                        {prof.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Box>
            )}
            {userType === "admin" && (
              <AddDatePickerEventModal
                open={openDatepickerModal}
                handleClose={() => setOpenDatepickerModal(false)}
                datePickerEventFormData={courseFormData}
                setDatePickerEventFormData={setCourseFormData}
                onAddEvent={onAddEventFromDatePicker}
                classes={classes}
              />
            )}
            <PlanningInfoModal
              open={eventInfoModal}
              handleClose={() => setEventInfoModal(false)}
              onDeleteEvent={onDeleteEvent}
              onModifyEvent={() => {}}
              onAddToTimetable={userType === "prof" ? onAddToTimetable : undefined}
              currentEvent={currentEvent}
              userType={userType}
            />
            <Calendar
              localizer={localizer}
              events={events}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable={userType === "admin"}
              startAccessor="start"
              endAccessor="end"
              defaultView="week"
              eventPropGetter={(event) => ({
                style: { backgroundColor: event.color || "#b64fc8" },
              })}
              style={{ height: 600, marginTop: 20 }}
            />
          </CardContent>
        </Card>
      </Container>
    </Box>
  );
};

export default EventPlaning;
