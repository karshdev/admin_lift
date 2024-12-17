import React, { useState, useEffect } from "react";

const QuestionsManagement = () => {
  const [interviewers] = useState([
    { id: 1, name: "John", type: "Technical" },
    { id: 2, name: "Richard", type: "Behavioral" },
    { id: 3, name: "Sarah", type: "Technical" },
  ]);

  const [questions, setQuestions] = useState([]);
  const [newQuestion, setNewQuestion] = useState({
    interviewerId: "",
    category: "",
    question: "",
    videoUrl: "",
  });

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editQuestion, setEditQuestion] = useState(null);

  // Fetch questions from API
  useEffect(() => {
    const fetchQuestions = async () => {
      const res = await fetch("https://backend-lift.onrender.com/api/questions");
      const data = await res.json(); 
      setQuestions(data);
    };
    fetchQuestions();
  }, []);

  // Add a new question
  const handleAddQuestion = async () => {
    if (!newQuestion.interviewerId || !newQuestion.category || !newQuestion.question || !newQuestion.videoUrl) {
      alert("Please fill in all fields.");
      return;
    }

    const res = await fetch("https://backend-lift.onrender.com/api/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newQuestion),
    });

    if (res.ok) {
      const addedQuestion = await res.json();
      setQuestions((prev) => [...prev, addedQuestion]);
      setNewQuestion({ interviewerId: "", category: "", question: "", videoUrl: "" });
    }
  };

  // Open edit modal
  const handleEdit = (question) => {
    setEditQuestion(question);
    setIsEditModalOpen(true);
  };

  // Update question
  const handleUpdateQuestion = async () => {
    const res = await fetch(`https://backend-lift.onrender.com/api/questions/${editQuestion._id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editQuestion),
    });

    if (res.ok) {
      const updatedQuestion = await res.json();
      setQuestions((prev) =>
        prev.map((q) => (q._id === updatedQuestion._id ? updatedQuestion : q))
      );
      setIsEditModalOpen(false);
      setEditQuestion(null);
    }
  };

  // Delete a question
  const handleDeleteQuestion = async (id) => {
    const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });

    if (res.ok) {
      setQuestions((prev) => prev.filter((q) => q._id !== id));
    }
  };

  return (
    <div className="p-8">
      <h2 className="text-2xl font-semibold mb-6">Admin Panel</h2>

      {/* Add Question Form */}
      <div className="mb-8 p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-medium mb-4">Add New Question</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <select
            className="border p-2 rounded-md"
            value={newQuestion.interviewerId}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, interviewerId: e.target.value })
            }
          >
            <option value="">Select Interviewer</option>
            {interviewers.map((interviewer) => (
              <option key={interviewer.id} value={interviewer.id}>
                {interviewer.name} - {interviewer.type}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="Category"
            className="border p-2 rounded-md"
            value={newQuestion.category}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, category: e.target.value })
            }
          />
          <textarea
            placeholder="Question"
            className="border p-2 rounded-md"
            value={newQuestion.question}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, question: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Video URL"
            className="border p-2 rounded-md"
            value={newQuestion.videoUrl}
            onChange={(e) =>
              setNewQuestion({ ...newQuestion, videoUrl: e.target.value })
            }
          />
        </div>
        <button
          className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
          onClick={handleAddQuestion}
        >
          Add Question
        </button>
      </div>

      {/* Questions List */}
      <div className="p-4 bg-white shadow-md rounded-lg">
        <h3 className="text-lg font-medium mb-4">Questions List</h3>
        {questions.length === 0 ? (
          <p>No questions available.</p>
        ) : (
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100">
                <th className="text-left p-2">Interviewer</th>
                <th className="text-left p-2">Category</th>
                <th className="text-left p-2">Question</th>
                <th className="text-left p-2">Video URL</th>
                <th className="text-left p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {questions.map((q) => (
                <tr key={q._id}>
                  <td className="p-2">
                    {interviewers.find((i) => i.id === q.interviewerId)?.name}
                  </td>
                  <td className="p-2">{q.category}</td>
                  <td className="p-2">{q.question}</td>
                  <td className="p-2">
                    <a
                      href={q.videoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 underline"
                    >
                      View Video
                    </a>
                  </td>
                  <td className="p-2">
                    <button
                      className="text-blue-500 mr-4"
                      onClick={() => handleEdit(q)}
                    >
                      Edit
                    </button>
                    <button
                      className="text-red-500"
                      onClick={() => handleDeleteQuestion(q._id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg">
            <h3 className="text-lg font-medium mb-4">Edit Question</h3>
            <textarea
              className="border p-2 w-full rounded-md"
              value={editQuestion.question}
              onChange={(e) =>
                setEditQuestion({ ...editQuestion, question: e.target.value })
              }
            />
            <button
              className="mt-4 bg-blue-600 text-white px-4 py-2 rounded-md"
              onClick={handleUpdateQuestion}
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QuestionsManagement;
