import { useEffect, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";

import Navbar from "../components/Navbar";
import Loading from "../components/Loading";

import {
  getTicketById,
  getComments,
  createComment,
  updateTicket,
  deleteTicket,
  getAgents,
} from "../services/api";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const [ticket, setTicket] = useState(null);
  const [comments, setComments] = useState([]);
  const [agents, setAgents] = useState([]);

  const [comment, setComment] = useState("");

  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [assignedTo, setAssignedTo] = useState("");

  const [loading, setLoading] = useState(true);
  const [commentLoading, setCommentLoading] = useState(false);
  const [updateLoading, setUpdateLoading] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    const loadTicket = async () => {
      try {
        setLoading(true);

        const [ticketData, commentsData] = await Promise.all([
          getTicketById(id),
          getComments(id),
        ]);

        setTicket(ticketData);
        setComments(commentsData);

        setStatus(ticketData.status);
        setPriority(ticketData.priority);
        setAssignedTo(ticketData.assigned_to || "");
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id]);

  useEffect(() => {
    const loadAgents = async () => {
      if (user?.role !== "agent") {
        return;
      }

      try {
        const data = await getAgents();

        setAgents(data);
      } catch (error) {
        console.error(error);
      }
    };

    loadAgents();
  }, [user?.role]);

  const handleCommentSubmit = async (event) => {
    event.preventDefault();

    if (!comment.trim()) {
      return;
    }

    try {
      setCommentLoading(true);

      await createComment(id, comment);

      const updatedComments = await getComments(id);

      setComments(updatedComments);
      setComment("");
    } catch (error) {
      setError(error.message);
    } finally {
      setCommentLoading(false);
    }
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    try {
      setUpdateLoading(true);

      await updateTicket(id, {
        status,
        priority,
        assigned_to: assignedTo ? Number(assignedTo) : null,
      });

      const updatedTicket = await getTicketById(id);

      setTicket(updatedTicket);

      alert("Ticket updated successfully.");
    } catch (error) {
      setError(error.message);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleDelete = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this ticket?",
    );

    if (!confirmed) {
      return;
    }

    try {
      await deleteTicket(id);

      navigate("/dashboard");
    } catch (error) {
      setError(error.message);
    }
  };

  if (loading) {
    return (
      <>
        <main className="container">
          <Loading />
        </main>
      </>
    );
  }

  if (error && !ticket) {
    return (
      <>
        <main className="container">
          <p className="error">{error}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Link to="/dashboard" className="back-link">
        ← Back to Dashboard
      </Link>

      <main className="container">
        {error && <p className="error">{error}</p>}

        <div className="ticket-detail-header">
          <div>
            <p className="ticket-id">Ticket #{ticket.id}</p>

            <h1>{ticket.subject}</h1>
          </div>

          <span className={`status ${ticket.status}`}>{ticket.status}</span>
        </div>

        <section className="detail-card">
          <h2>Ticket Information</h2>

          <p>
            <strong>Customer:</strong> {ticket.user_name}
          </p>

          <p>
            <strong>Priority:</strong> {ticket.priority}
          </p>

          <p>
            <strong>Status:</strong> {ticket.status}
          </p>

          <div className="description">
            <strong>Description</strong>

            <p>{ticket.description}</p>
          </div>
        </section>

        {user?.role === "agent" && (
          <section className="detail-card">
            <h2>Manage Ticket</h2>

            <form onSubmit={handleUpdate}>
              <label>Status</label>

              <select
                value={status}
                onChange={(event) => setStatus(event.target.value)}
              >
                <option value="open">Open</option>
                <option value="in_progress">In Progress</option>
                <option value="resolved">Resolved</option>
                <option value="closed">Closed</option>
              </select>

              <label>Priority</label>

              <select
                value={priority}
                onChange={(event) => setPriority(event.target.value)}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>

              <label>Assign Agent</label>

              <select
                value={assignedTo}
                onChange={(event) => setAssignedTo(event.target.value)}
              >
                <option value="">Unassigned</option>

                {agents.map((agent) => (
                  <option key={agent.id} value={agent.id}>
                    {agent.name}
                  </option>
                ))}
              </select>

              <div className="button-row">
                <button
                  type="submit"
                  className="button primary"
                  disabled={updateLoading}
                >
                  {updateLoading ? "Updating..." : "Update Ticket"}
                </button>

                <button
                  type="button"
                  className="button danger"
                  onClick={handleDelete}
                >
                  Delete Ticket
                </button>
              </div>
            </form>
          </section>
        )}

        <section className="detail-card">
          <h2>Comments</h2>

          {comments.length === 0 && <p className="muted">No comments yet.</p>}

          <div className="comments">
            {comments.map((item) => (
              <div key={item.id} className="comment">
                <div className="comment-header">
                  <strong>{item.user_name}</strong>

                  <span>{item.role}</span>
                </div>

                <p>{item.comment}</p>

                <small>{new Date(item.created_at).toLocaleString()}</small>
              </div>
            ))}
          </div>

          <form onSubmit={handleCommentSubmit} className="comment-form">
            <textarea
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              placeholder="Write a comment..."
              rows="4"
            />

            <button
              type="submit"
              className="button primary"
              disabled={commentLoading}
            >
              {commentLoading ? "Adding..." : "Add Comment"}
            </button>
          </form>
        </section>
      </main>
    </>
  );
};

export default TicketDetails;
