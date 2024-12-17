import axios from "axios";
import { useState, useEffect } from "react";

const InterviewerManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newInterviewer, setNewInterviewer] = useState({
    name: "",
    question: "",
    videoUrl: "",
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await axios.get("https://backend-lift.onrender.com/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const addCategory = async () => {
    try {
      const res = await axios.post("https://backend-lift.onrender.com/categories", {
        category: newCategory,
      });
      setCategories([...categories, res.data]);
      setNewCategory("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteCategory = async (id) => {
    try {
      await axios.delete(`https://backend-lift.onrender.com/categories/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const addInterviewer = async () => {
    if (!selectedCategory) return alert("Select a category first");

    try {
      const res = await axios.post(
        `https://backend-lift.onrender.com/categories/${selectedCategory._id}/interviewers`,
        {
          name: newInterviewer.name,
          questions: [
            {
              question: newInterviewer.question,
              videoUrl: newInterviewer.videoUrl,
            },
          ],
        }
      );
      const updatedCategories = categories.map((cat) =>
        cat._id === selectedCategory._id ? res.data : cat
      );
      setCategories(updatedCategories);
      setSelectedCategory(res.data);
      setNewInterviewer({ name: "", question: "", videoUrl: "" });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Admin Panel</h1>

      <div className="mb-4">
        <input
          type="text"
          className="border rounded p-2 mr-2"
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={addCategory}
        >
          Add Category
        </button>
      </div>

      <h2 className="text-xl font-semibold">Categories</h2>
      <ul className="list-disc pl-6">
        {categories.map((cat) => (
          <li key={cat._id} className="mb-2">
            <div className="flex justify-between">
              <span
                className={`cursor-pointer ${
                  selectedCategory && selectedCategory._id === cat._id
                    ? "font-bold"
                    : ""
                }`}
                onClick={() => setSelectedCategory(cat)}
              >
                {cat.category}
              </span>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded"
                onClick={() => deleteCategory(cat._id)}
              >
                Delete
              </button>
            </div>

            {selectedCategory && selectedCategory._id === cat._id && (
              <div className="mt-4 pl-4">
                <h3 className="text-lg font-semibold">Add Interviewer</h3>
                <input
                  type="text"
                  className="border rounded p-2 mr-2"
                  placeholder="Interviewer Name"
                  value={newInterviewer.name}
                  onChange={(e) =>
                    setNewInterviewer({ ...newInterviewer, name: e.target.value })
                  }
                />
                <input
                  type="text"
                  className="border rounded p-2 mr-2"
                  placeholder="Question"
                  value={newInterviewer.question}
                  onChange={(e) =>
                    setNewInterviewer({
                      ...newInterviewer,
                      question: e.target.value,
                    })
                  }
                />
                <input
                  type="text"
                  className="border rounded p-2 mr-2"
                  placeholder="Video URL"
                  value={newInterviewer.videoUrl}
                  onChange={(e) =>
                    setNewInterviewer({
                      ...newInterviewer,
                      videoUrl: e.target.value,
                    })
                  }
                />
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded"
                  onClick={addInterviewer}
                >
                  Add Interviewer
                </button>

                <h4 className="mt-4 text-md font-semibold">Interviewers</h4>
                <ul className="list-disc pl-6">
                  {(selectedCategory.interviewers || []).map((interviewer, idx) => (
                    <li key={idx} className="mb-2">
                      <p className="font-medium">{interviewer.name}</p>
                      <ul className="list-disc pl-6">
                        {interviewer.questions.map((q, qIdx) => (
                          <li key={qIdx}>
                            <p>{q.question}</p>
                            <a
                              href={q.videoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 underline"
                            >
                              View Video
                            </a>
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InterviewerManagement;
