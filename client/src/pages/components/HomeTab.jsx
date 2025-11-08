import React, { useEffect, useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { fetchTeacherClasses, fetchStudentClasses } from "../../api";
import { FaRegCopy } from "react-icons/fa";

const HomeTab = ({ setActiveTab, setSelectedClassId }) => {
  const { user, token } = useContext(AuthContext);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadClasses = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const data = user.isTeacher
        ? await fetchTeacherClasses(token)
        : await fetchStudentClasses(token);
      setClasses(data);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
      toast.success("Class code copied!");
    } catch {
      toast.error("Failed to copy code.");
    }
  };

  useEffect(() => {
    loadClasses();
  }, [user]);

  return (
    <div className="home-tab">
      {/* Greeting */}
      <div className="home-greeting">
        <h1 className="gradient-text">Hi, {user?.name} 👋</h1>
      </div>

      {/* Classes Section */}
      <div className="home-content">
        <h2 className="class-heading-unique">
          {user?.isTeacher ? "CLASSES YOU HAVE CREATED" : "CLASSES YOU ARE IN"}
        </h2>

        {loading ? (
          <div className="center-text">
            <p className="loading-text">Loading your classes...</p>
          </div>
        ) : classes.length === 0 ? (
          <div className="center-text">
            <p className="no-classes">No classes found.</p>
          </div>
        ) : (
          <div className="class-grid">
            {classes.map((cls) => (
              <div
                key={cls._id}
                className="class-card"
                onClick={() => {
                  setSelectedClassId(cls._id);
                  setActiveTab("View Class");
                }}
              >
                <div className="class-header">
                  <span className="class-name">{cls.name}</span>
                  <div className="class-code-container">
                    <span className="class-code-text">{cls.code}</span>
                    <FaRegCopy
                      className="copy-icon"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopyCode(cls.code);
                      }}
                    />
                  </div>
                </div>
                <p className="class-desc">
                  {cls.description || "No description provided"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomeTab;