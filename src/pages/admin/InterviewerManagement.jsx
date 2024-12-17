import  { useState, useEffect } from "react";
import axios from "axios";
import * as RadixDialog from "@radix-ui/react-dialog";
import * as RadixAlert from "@radix-ui/react-alert-dialog";
import { 
  AlertCircle, 
  PlusCircle, 
  Trash2, 
  Video, 
  User, 
  Tag, 
  Check,
  X
} from "lucide-react";

const Button = ({ children, className = "", variant = "primary", ...props }) => {
  const variants = {
    primary: "bg-blue-500 text-white hover:bg-blue-600",
    destructive: "bg-red-500 text-white hover:bg-red-600",
    outline: "border border-gray-300 hover:bg-gray-100"
  };

  return (
    <button 
      className={`
        px-4 py-2 rounded-md flex items-center justify-center 
        transition-all disabled:opacity-50 disabled:cursor-not-allowed
        ${variants[variant]} ${className}
      `}
      {...props}
    >
      {children}
    </button>
  );
};

const Input = ({ className = "", error, ...props }) => {
  return (
    <div className="w-full">
      <input
        className={`
          w-full px-3 py-2 border rounded-md 
          focus:outline-none focus:ring-2 focus:ring-blue-500
          ${error ? 'border-red-500' : 'border-gray-300'}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-red-500 text-sm mt-1 flex items-center">
          <AlertCircle className="mr-2 h-4 w-4" /> {error}
        </p>
      )}
    </div>
  );
};

const InterviewerManagement = () => {
  const [categories, setCategories] = useState([]);
  const [newCategory, setNewCategory] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [newInterviewer, setNewInterviewer] = useState({
    name: "",
    question: "",
    videoUrl: "",
  });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Validation function
  const validateInput = (type = 'interviewer') => {
    const newErrors = {};

    if (type === 'category') {
      if (!newCategory.trim()) {
        newErrors.category = "Category name cannot be empty";
      }
    } else {
      // Interviewer validation
      if (!newInterviewer.name.trim()) {
        newErrors.name = "Interviewer name is required";
      }
      if (!newInterviewer.question.trim()) {
        newErrors.question = "Question cannot be empty";
      }
      if (!newInterviewer.videoUrl.trim()) {
        newErrors.videoUrl = "Video URL is required";
      } else {
        // Basic URL validation
        const urlPattern = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})([\/\w \.-]*)*\/?$/;
        if (!urlPattern.test(newInterviewer.videoUrl)) {
          newErrors.videoUrl = "Invalid URL format";
        }
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get("https://backend-lift.onrender.com/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      setErrors({ fetch: "Failed to fetch categories" });
    } finally {
      setIsLoading(false);
    }
  };

  const addCategory = async () => {
    if (!validateInput('category')) return;

    setIsLoading(true);
    try {
      const res = await axios.post("https://backend-lift.onrender.com/categories", {
        category: newCategory.trim(),
      });
      setCategories([...categories, res.data]);
      setNewCategory("");
      setErrors({});
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to add category. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  const deleteCategory = async (id) => {
    setIsLoading(true);
    try {
      await axios.delete(`https://backend-lift.onrender.com/categories/${id}`);
      setCategories(categories.filter((cat) => cat._id !== id));
      if (selectedCategory?._id === id) {
        setSelectedCategory(null);
      }
    } catch (err) {
      console.error(err);
      setErrors({ delete: "Failed to delete category" });
    } finally {
      setIsLoading(false);
    }
  };

  const addInterviewer = async () => {
    if (!validateInput()) return;
    if (!selectedCategory) {
      setErrors({ submit: "Please select a category first" });
      return;
    }

    setIsLoading(true);
    try {
      const res = await axios.post(
        `https://backend-lift.onrender.com/categories/${selectedCategory._id}/interviewers`,
        {
          name: newInterviewer.name.trim(),
          questions: [
            {
              question: newInterviewer.question.trim(),
              videoUrl: newInterviewer.videoUrl.trim(),
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
      setErrors({});
      setDialogOpen(false);
    } catch (err) {
      console.error(err);
      setErrors({ submit: "Failed to add interviewer. Please try again." });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-4xl bg-white shadow-lg rounded-xl">
      {/* Error Banner */}
      {Object.values(errors).some(err => typeof err === 'string') && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-4">
          <div className="flex items-center">
            <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
            <p className="text-red-700">
              {Object.values(errors).find(err => typeof err === 'string')}
            </p>
          </div>
        </div>
      )}

      {/* Category Creation Section */}
      <div className="mb-6 flex space-x-2">
        <Input
          placeholder="New Category"
          value={newCategory}
          onChange={(e) => {
            setNewCategory(e.target.value);
            if (errors.category) {
              const newErrorsCopy = { ...errors };
              delete newErrorsCopy.category;
              setErrors(newErrorsCopy);
            }
          }}
          error={errors.category}
        />
        <Button 
          onClick={addCategory} 
          disabled={isLoading}
          className="min-w-[120px]"
        >
          <PlusCircle className="mr-2" /> Add Category
        </Button>
      </div>

      {/* Categories List */}
      <div className="space-y-4">
        <h2 className="text-xl font-semibold flex items-center">
          <Tag className="mr-2" /> Categories
        </h2>
        {categories.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No categories found</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {categories.map((cat) => (
              <div 
                key={cat._id} 
                className={`
                  border rounded-lg p-4 transition-all 
                  ${selectedCategory?._id === cat._id 
                    ? 'border-blue-500 bg-blue-50 shadow-md' 
                    : 'hover:bg-gray-50 hover:shadow'}
                `}
              >
                <div className="flex justify-between items-center mb-2">
                  <span 
                    onClick={() => setSelectedCategory(cat)}
                    className="cursor-pointer font-medium flex-grow"
                  >
                    {cat.category}
                  </span>
                  <Button 
                    variant="destructive" 
                    onClick={() => deleteCategory(cat._id)}
                    disabled={isLoading}
                    className="p-2 rounded-full"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                {/* Interviewer Section */}
                {selectedCategory?._id === cat._id && (
                  <div className="mt-4">
                    <RadixDialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
                      <RadixDialog.Trigger asChild>
                        <Button className="w-full">
                          <PlusCircle className="mr-2" /> Add Interviewer
                        </Button>
                      </RadixDialog.Trigger>
                      <RadixDialog.Portal>
                        <RadixDialog.Overlay className="fixed inset-0 bg-black/50" />
                        <RadixDialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg p-6 shadow-xl">
                          <RadixDialog.Title className="text-lg font-semibold mb-4">
                            Add New Interviewer
                          </RadixDialog.Title>
                          <div className="space-y-4">
                            <Input
                              placeholder="Interviewer Name"
                              value={newInterviewer.name}
                              onChange={(e) => {
                                setNewInterviewer({ 
                                  ...newInterviewer, 
                                  name: e.target.value 
                                });
                                if (errors.name) {
                                  const newErrorsCopy = { ...errors };
                                  delete newErrorsCopy.name;
                                  setErrors(newErrorsCopy);
                                }
                              }}
                              error={errors.name}
                            />
                            
                            <Input
                              placeholder="Question"
                              value={newInterviewer.question}
                              onChange={(e) => {
                                setNewInterviewer({ 
                                  ...newInterviewer, 
                                  question: e.target.value 
                                });
                                if (errors.question) {
                                  const newErrorsCopy = { ...errors };
                                  delete newErrorsCopy.question;
                                  setErrors(newErrorsCopy);
                                }
                              }}
                              error={errors.question}
                            />
                            
                            <Input
                              placeholder="Video URL"
                              value={newInterviewer.videoUrl}
                              onChange={(e) => {
                                setNewInterviewer({ 
                                  ...newInterviewer, 
                                  videoUrl: e.target.value 
                                });
                                if (errors.videoUrl) {
                                  const newErrorsCopy = { ...errors };
                                  delete newErrorsCopy.videoUrl;
                                  setErrors(newErrorsCopy);
                                }
                              }}
                              error={errors.videoUrl}
                            />

                            <div className="flex space-x-2">
                              <Button 
                                onClick={addInterviewer} 
                                disabled={isLoading}
                                className="flex-grow"
                              >
                                <Check className="mr-2" /> Submit
                              </Button>
                              <RadixDialog.Close asChild>
                                <Button variant="outline" className="p-2">
                                  <X className="h-5 w-5" />
                                </Button>
                              </RadixDialog.Close>
                            </div>
                          </div>
                        </RadixDialog.Content>
                      </RadixDialog.Portal>
                    </RadixDialog.Root>

                    {/* Interviewers List */}
                    <div className="mt-4">
                      <h4 className="text-lg font-semibold mb-2 flex items-center">
                        <Video className="mr-2" /> Interviewers
                      </h4>
                      {(selectedCategory.interviewers || []).length === 0 ? (
                        <div className="bg-gray-50 rounded-lg p-4 text-center">
                          <p className="text-gray-500">No interviewers added yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {(selectedCategory.interviewers || []).map((interviewer, idx) => (
                            <div 
                              key={idx} 
                              className="border rounded-lg p-4 bg-gray-50"
                            >
                              <div className="font-medium mb-2 flex items-center">
                                <User className="mr-2 h-5 w-5 text-blue-500" />
                                {interviewer.name}
                              </div>
                              {interviewer.questions.map((q, qIdx) => (
                                <div 
                                  key={qIdx} 
                                  className="pl-4 border-l-2 border-blue-200 mt-2"
                                >
                                  <p className="text-gray-700 mb-1">{q.question}</p>
                                  <a
                                    href={q.videoUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-500 hover:underline flex items-center"
                                  >
                                    <Video className="mr-2 h-4 w-4" /> View Video
                                  </a>
                                </div>
                              ))}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewerManagement;