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
// Correct CSS import for react-big-calendar:
import "react-big-calendar/lib/css/react-big-calendar.css";
import axios from "axios";
import { jwtDecode } from "jwt-decode";

// Import subcomponents
import AddDatePickerEventModal from "./AddDatePickerEventModal";
import EventInfoModal from "./EventInfoModal";

// ---------- dateFnsLocalizer ----------
const locales = { "en-US": enUS };
const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

// ---------- Initial State for Course Form ----------
const initialCourseFormData = {
  courseName: "",
  start: undefined,
  end: undefined,
  classId: "",
  color: "#b64fc8", // default color value
};

const EventCalendar = () => {
  // Calendar and events state
  const [events, setEvents] = useState([]);
  const [allCourses, setAllCourses] = useState([]);
  const [currentEvent, setCurrentEvent] = useState(null);

  // Modal toggles
  const [openDatepickerModal, setOpenDatepickerModal] = useState(false);
  const [eventInfoModal, setEventInfoModal] = useState(false);

  // Course creation form state
  const [courseFormData, setCourseFormData] = useState(initialCourseFormData);

  // Other data from API
  const [matieres, setMatieres] = useState([]);
  const [classes, setClasses] = useState([]);
  const [professors, setProfessors] = useState([]);
  const [selectedProfessorId, setSelectedProfessorId] = useState("all");
  const [userType, setUserType] = useState(null);

  // Retrieve token from localStorage
  const getToken = () => localStorage.getItem("token");

  // ---------- On mount: decode token, load data ----------
  useEffect(() => {
    const token = getToken();
    if (!token) return; // Not logged in

    try {
      const decoded = jwtDecode(token);
      if (!decoded || !decoded.type) return;
      setUserType(decoded.type);
      if (decoded.type === "admin") {
        loadData(token, decoded.type, decoded.id);
        loadProfessors(token);
      } else if (decoded.type === "parent") {
        loadData(token, decoded.type, decoded.id);
      } else if (decoded.type === "prof") {
        loadData(token, decoded.type, decoded.id);
        loadClasses();
      }
    } catch (err) {
      console.error("Invalid token:", err);
      setUserType(null);
    }
  }, []);

  // ---------- Load Data: Matières and Courses ----------
  const loadData = async (token, type, userId) => {
    try {
      // 1) Load Matières
      const matResp = await axios.get("http://localhost:5000/api/matieres");
      setMatieres(matResp.data);

      // 2) Load all courses
      const coursesResp = await axios.get("http://localhost:5000/api/cours", {
        headers: { Authorization: token },
      });
      let coursesData = coursesResp.data;

      // For professors, filter courses by teacher id.
      if (type === "prof" && userId) {
        coursesData = coursesData.filter((course) => {
          if (!course.enseignant) return false;
          if (typeof course.enseignant === "object") {
            return course.enseignant._id.toString() === userId.toString();
          } else {
            return course.enseignant.toString() === userId.toString();
          }
        });
      }

      // For parents, filter courses based on their children's classes.
      if (type === "parent" && userId) {
        try {
          const elevesResp = await axios.get(`http://localhost:5000/eleves?parent=${userId}`, {
            headers: { Authorization: token },
          });
          const parentClasses = elevesResp.data.map((ele) => ele.class.toString());
          const uniqueParentClasses = Array.from(new Set(parentClasses));
          coursesData = coursesData.filter((course) => {
            let courseClassId = "";
            if (typeof course.class === "object") {
              courseClassId = course.class._id.toString();
            } else {
              courseClassId = course.class.toString();
            }
            return uniqueParentClasses.includes(courseClassId);
          });
        } catch (error) {
          console.error("Error loading parent's children:", error);
        }
      }

      const dbEvents = coursesData.map((course) => ({
        ...course,
        start: new Date(course.datedebut),
        end: new Date(course.datefin),
      }));
      setEvents(dbEvents);
      if (type === "admin") {
        setAllCourses(dbEvents);
      }
    } catch (error) {
      console.error("Error loading data:", error);
    }
  };

  // ---------- Load available classes ----------
  const loadClasses = async () => {
    try {
      const classesResp = await axios.get("http://localhost:5000/classes");
      setClasses(classesResp.data);
    } catch (error) {
      console.error("Error loading classes:", error);
    }
  };

  // ---------- Load all professors (for admin view) ----------
  const loadProfessors = async (token) => {
    try {
      const profResp = await axios.get("http://localhost:5000/api/profs", {
        headers: { Authorization: token },
      });
      setProfessors(profResp.data);
    } catch (error) {
      console.error("Error loading professors:", error);
    }
  };

  // ---------- Handle professor selection (admin view) ----------
  const handleProfessorChange = (event) => {
    const profId = event.target.value;
    setSelectedProfessorId(profId);
    if (profId === "all") {
      setEvents(allCourses);
    } else {
      const filtered = allCourses.filter((course) => {
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

  // ---------- onSelectSlot: user clicks blank area ----------
  const handleSelectSlot = (slotInfo) => {
    if (userType !== "prof") {
      alert("Only professors can add events.");
      return;
    }
    setOpenDatepickerModal(true);
  };

  // ---------- onSelectEvent: user clicks an existing event ----------
  const handleSelectEvent = (calEvt) => {
    setCurrentEvent(calEvt);
    setEventInfoModal(true);
  };

  // ---------- Add event from DatePicker (course creation) ----------
  const onAddEventFromDatePicker = async () => {
    if (userType !== "prof") {
      alert("Only professors can create events.");
      return;
    }
    const token = getToken();
    if (!token) {
      alert("Not logged in.");
      return;
    }
    const { courseName, start, end, classId, color } = courseFormData;
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
      color: color,
    };
    try {
      const resp = await axios.post("http://localhost:5000/api/cours", body, {
        headers: { Authorization: token },
      });
      const saved = resp.data;
      setEvents((prev) => [
        ...prev,
        { ...saved, start: new Date(saved.datedebut), end: new Date(saved.datefin) },
      ]);
      setCourseFormData(initialCourseFormData);
      setOpenDatepickerModal(false);
    } catch (error) {
      console.error("Error adding event:", error.response?.data || error.message);
      alert("Failed to save event. Check console for details.");
    }
  };

  // ---------- Delete event ----------
  const onDeleteEvent = async () => {
    if (userType !== "prof") {
      alert("Only professors can delete events.");
      return;
    }
    if (!currentEvent || !currentEvent._id) return;
    const token = getToken();
    if (!token) {
      alert("Not logged in.");
      return;
    }
    try {
      await axios.delete(`http://localhost:5000/api/cours/${currentEvent._id}`, {
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
                ? "Admin view: select a professor to view their courses."
                : userType === "prof"
                ? "Professor sees all courses."
                : "Parent sees only courses linked to their children."
            }
          />
          <Divider />
          <CardContent>
            {userType === "admin" && (
              <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                <ButtonGroup size="large" variant="contained">
                  <Button disabled>Add event</Button>
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
            {userType === "prof" && (
              <>
                <ButtonGroup size="large" variant="contained">
                  <Button onClick={() => setOpenDatepickerModal(true)}>Add event</Button>
                </ButtonGroup>
                <Divider sx={{ my: 2 }} />
              </>
            )}
            {userType === "prof" && (
              <AddDatePickerEventModal
                open={openDatepickerModal}
                handleClose={() => setOpenDatepickerModal(false)}
                datePickerEventFormData={courseFormData}
                setDatePickerEventFormData={setCourseFormData}
                onAddEvent={onAddEventFromDatePicker}
                classes={classes}
              />
            )}
            <EventInfoModal
              open={eventInfoModal}
              handleClose={() => setEventInfoModal(false)}
              onDeleteEvent={onDeleteEvent}
              currentEvent={currentEvent}
              userType={userType === "admin" ? undefined : userType}
              classes={classes}
              matieres={matieres}
            />
            <Calendar
              localizer={localizer}
              events={events}
              onSelectEvent={handleSelectEvent}
              onSelectSlot={handleSelectSlot}
              selectable={userType === "prof"}
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

export default EventCalendar;
