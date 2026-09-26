import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import { getTickets } from "../services/api";
import TicketCard from "../components/TicketCard";
import Loading from "../components/Loading";

const Dashboard = () => {
  const [tickets, setTickets] = useState([]);
  const [filteredTickets, setFilteredTickets] = useState([]);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));

  const isAgent = user?.role === "agent";

  useEffect(() => {
    const loadTickets = async () => {
      try {
        const data = await getTickets();

        setTickets(data);
        setFilteredTickets(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
  }, []);

  useEffect(() => {
    let result = [...tickets];

    // Search
    if (search.trim()) {
      const searchText = search.toLowerCase();

      result = result.filter((ticket) =>
        `${ticket.subject} ${ticket.description}`
          .toLowerCase()
          .includes(searchText),
      );
    }

    // Status
    if (statusFilter !== "all") {
      result = result.filter((ticket) => ticket.status === statusFilter);
    }

    // Priority
    if (priorityFilter !== "all") {
      result = result.filter((ticket) => ticket.priority === priorityFilter);
    }

    // Sort
    if (sortBy === "newest") {
      result.sort((a, b) => b.id - a.id);
    }

    if (sortBy === "oldest") {
      result.sort((a, b) => a.id - b.id);
    }

    if (sortBy === "priority-high") {
      const priority = {
        high: 3,
        medium: 2,
        low: 1,
      };

      result.sort((a, b) => priority[b.priority] - priority[a.priority]);
    }

    if (sortBy === "priority-low") {
      const priority = {
        high: 3,
        medium: 2,
        low: 1,
      };

      result.sort((a, b) => priority[a.priority] - priority[b.priority]);
    }

    setFilteredTickets(result);
  }, [tickets, search, statusFilter, priorityFilter, sortBy]);

  const clearFilters = () => {
    setSearch("");
    setStatusFilter("all");
    setPriorityFilter("all");
    setSortBy("newest");
  };

  // Statistics
  const total = tickets.length;

  const open = tickets.filter((ticket) => ticket.status === "open").length;

  const inProgress = tickets.filter(
    (ticket) => ticket.status === "in_progress",
  ).length;

  const resolved = tickets.filter(
    (ticket) => ticket.status === "resolved",
  ).length;

  const closed = tickets.filter((ticket) => ticket.status === "closed").length;

  if (loading) {
    return <Loading />;
  }

  return (
    <main className="dashboard">
      {/* Header */}

      <section className="dashboard-intro">
        <div>
          <p className="dashboard-label">
            {isAgent ? "SUPPORT OPERATIONS" : "CUSTOMER PORTAL"}
          </p>

          <h1>{isAgent ? "Support Dashboard" : "My Tickets"}</h1>

          <p className="dashboard-description">
            {isAgent
              ? "Monitor and manage customer support requests."
              : "Track your support requests and conversations."}
          </p>
        </div>

        {!isAgent && (
          <Link to="/tickets/create" className="primary-button">
            + New Ticket
          </Link>
        )}
      </section>

      {/* Agent Statistics */}

      {isAgent && (
        <section className="statistics">
          <div className="stat-card">
            <span>Total Tickets</span>
            <strong>{total}</strong>
          </div>

          <div className="stat-card">
            <span>Open</span>
            <strong>{open}</strong>
          </div>

          <div className="stat-card">
            <span>In Progress</span>
            <strong>{inProgress}</strong>
          </div>

          <div className="stat-card">
            <span>Resolved</span>
            <strong>{resolved}</strong>
          </div>

          <div className="stat-card">
            <span>Closed</span>
            <strong>{closed}</strong>
          </div>
        </section>
      )}

      {/* Error */}

      {error && <div className="error-message">{error}</div>}

      {/* Filters */}

      <section className="filters">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search tickets..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          value={statusFilter}
          onChange={(event) => setStatusFilter(event.target.value)}
        >
          <option value="all">All Statuses</option>
          <option value="open">Open</option>
          <option value="in_progress">In Progress</option>
          <option value="resolved">Resolved</option>
          <option value="closed">Closed</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(event) => setPriorityFilter(event.target.value)}
        >
          <option value="all">All Priorities</option>
          <option value="high">High Priority</option>
          <option value="medium">Medium Priority</option>
          <option value="low">Low Priority</option>
        </select>

        <select
          value={sortBy}
          onChange={(event) => setSortBy(event.target.value)}
        >
          <option value="newest">Newest</option>
          <option value="oldest">Oldest</option>
          <option value="priority-high">Priority: High → Low</option>
          <option value="priority-low">Priority: Low → High</option>
        </select>

        {/* <button type="button" onClick={clearFilters} className="clear-button">
          Clear
        </button> */}
      </section>

      {/* Results */}

      <section className="ticket-section">
        <div className="ticket-section-header">
          <div>
            <h2>{isAgent ? "All Support Tickets" : "Your Tickets"}</h2>

            <p>
              {filteredTickets.length} of {tickets.length} tickets
            </p>
          </div>
        </div>

        {filteredTickets.length === 0 ? (
          <div className="empty-state">
            <h3>No tickets found</h3>

            <p>Try changing your search or filters.</p>

            <button onClick={clearFilters} className="clear-button">
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="ticket-list">
            {filteredTickets.map((ticket) => (
              <TicketCard key={ticket.id} ticket={ticket} />
            ))}
          </div>
        )}
      </section>
    </main>
  );
};

export default Dashboard;
