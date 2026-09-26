import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { createTicket } from "../services/api";

const CreateTicket = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    subject: "",
    description: "",
    priority: "medium",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError("");

    if (!formData.subject.trim()) {
      setError("Subject is required.");
      return;
    }

    if (!formData.description.trim()) {
      setError("Description is required.");
      return;
    }

    try {
      setLoading(true);

      await createTicket(formData);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <main className="container">
        <div className="form-page">
          <h1>Create Ticket</h1>

          <p className="form-subtitle">
            Describe your issue and submit a support request.
          </p>

          {error && <p className="error">{error}</p>}

          <form onSubmit={handleSubmit} className="form-card">
            <label>Subject</label>

            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              placeholder="Example: Unable to login"
            />

            <label>Description</label>

            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Describe your problem..."
              rows="6"
            />

            <label>Priority</label>

            <select
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>

            <button type="submit" className="button primary" disabled={loading}>
              {loading ? "Creating..." : "Create Ticket"}
            </button>
          </form>
        </div>
      </main>
    </>
  );
};

export default CreateTicket;
