const API_URL = 'http://localhost:5050/api';

async function handleResponse(res) {
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const msg = data.message || 'Something went wrong.';
    throw new Error(msg);
  }
  return data;
}

export async function loginUser(email, password) {
  const res = await fetch(`${API_URL}/users/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return await handleResponse(res);
}

export async function registerUser(data) {
  const res = await fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  return await handleResponse(res);
}

export async function fetchMe(token) {
  const res = await fetch(`${API_URL}/users/me`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return await handleResponse(res);
}


export async function updateUser(token, body) {
  const res = await fetch(`${API_URL}/users/update`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(body),
  });
  return await handleResponse(res);
}

// === Class Fetching APIs ===
export async function fetchTeacherClasses(token) {
  const res = await fetch(`${API_URL}/classes/mine/teacher`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch teacher classes");
  return data;
}

export async function fetchStudentClasses(token) {
  const res = await fetch(`${API_URL}/classes/mine/student`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to fetch student classes");
  return data;
}

// === Create a new class ===
export async function createClass(token, { name, description, code }) {
  const res = await fetch(`${API_URL}/classes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ name, description, code }),
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create class");
  return data;
}

// === Get class by ID ===
export const getClassById = async (token, classId) => {
  const res = await fetch(`${API_URL}/classes/${classId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to fetch class details");
  }
  return res.json();
};

export const removeStudentFromClass = async (token, classId, studentId) => {
  const res = await fetch(`${API_URL}/classes/${classId}/student/${studentId}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to remove student");
  return data;
};
