import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import {
  getClassById,
  removeStudentFromClass,
  fetchTeacherClasses,
  fetchStudentClasses, // added
} from "../../api";
import { toast } from "react-toastify";
import { FaTrash } from "react-icons/fa";

const ViewClass = ({ selectedClassId: propClassId }) => {
  const { user, token } = useContext(AuthContext);
  const [classData, setClassData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedClassId, setSelectedClassId] = useState(propClassId || "");
  const [teacherClasses, setTeacherClasses] = useState([]);
  const [studentClasses, setStudentClasses] = useState([]); // added

  // Fetch teacher's classes for dropdown
  useEffect(() => {
    const loadClasses = async () => {
      try {
        if (user?.isTeacher) {
          const data = await fetchTeacherClasses(token);
          setTeacherClasses(data);
        } else {
          const data = await fetchStudentClasses(token); // student classes
          setStudentClasses(data);
        }
      } catch (err) {
        toast.error(err.message);
      }
    };
    loadClasses();
  }, [user, token]);

  // Fetch class info
  const fetchClassData = async (id) => {
    if (!id) return;
    try {
      setLoading(true);
      const data = await getClassById(token, id);
      setClassData(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (selectedClassId) fetchClassData(selectedClassId);
  }, [selectedClassId]);

  const handleRemoveStudent = async (studentId) => {
    if (!window.confirm("Remove this student from class?")) return;
    try {
      await removeStudentFromClass(token, selectedClassId, studentId);
      toast.success("Student removed");
      await fetchClassData(selectedClassId);
    } catch (err) {
      toast.error(err.message);
    }
  };

  // === Dropdown if no class selected ===
  if (!selectedClassId) {
    return (
      <div className="home-tab">
        <h2 className="class-heading-unique">SELECT CLASS TO VIEW</h2>
        {user?.isTeacher ? (
          <div className="dropdown-container">
            <select
              className="class-dropdown"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">Select a class</option>
              {teacherClasses.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} ({cls.code})
                </option>
              ))}
            </select>
          </div>
        ) : user ? (
          <div className="dropdown-container">
            <select
              className="class-dropdown"
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
            >
              <option value="">Select a class</option>
              {studentClasses.map((cls) => (
                <option key={cls._id} value={cls._id}>
                  {cls.name} ({cls.code})
                </option>
              ))}
            </select>
          </div>
        ) : (
          <p className="dim-text">Loading user info...</p>
        )}
      </div>
    );
  }

  if (loading) return <p className="center-text">Loading class details...</p>;
  if (!classData) return <p className="center-text">Class not found.</p>;

  const { classInfo, members, groups } = classData;

  return (
    <div className="playground-tab view-class-tab">
      <h2 className="class-heading-unique">CLASS INFO</h2>
      <div className="info-card">
        <p>
          <strong>Name:</strong> {classInfo.name}
        </p>
        <p>
          <strong>Description:</strong>{" "}
          {classInfo.description || "No description provided"}
        </p>
        <p>
          <strong>Code:</strong> {classInfo.code}
        </p>
      </div>

      <h2 className="class-heading-unique">MEMBERS</h2>
      <div className="info-card">
        {members.students?.length > 0 ? (
          members.students.map((student) => (
            <div key={student._id} className="member-item">
              <span>
                {student.name} — <span className="dim-text">{student.email}</span>
              </span>
              {user?.isTeacher && (
                <FaTrash
                  className="delete-icon"
                  onClick={() => handleRemoveStudent(student._id)}
                />
              )}
            </div>
          ))
        ) : (
          <p className="dim-text">No students in this class yet.</p>
        )}
      </div>

      <h2 className="class-heading-unique">GROUPS</h2>
      <div className="info-card">
        {groups?.length > 0 ? (
          <ul className="list">
            {groups.map((g) => (
              <li key={g._id}>
                <strong>{g.name}</strong> — {g.members.length} members
              </li>
            ))}
          </ul>
        ) : (
          <p className="dim-text">No groups created yet.</p>
        )}
      </div>
    </div>
  );
};

export default ViewClass;
