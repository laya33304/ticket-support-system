import { Link } from "react-router-dom";

const TicketCard = ({ ticket }) => {
  return (
    <Link to={`/tickets/${ticket.id}`} className="ticket-card">
      <div className="ticket-card-header">
        <h3>{ticket.subject}</h3>

        <span className={`status ${ticket.status}`}>{ticket.status}</span>
      </div>

      <p className="ticket-description">{ticket.description}</p>

      <div className="ticket-meta">
        <span>Priority: {ticket.priority}</span>

        <span>Customer: {ticket.user_name}</span>
      </div>
    </Link>
  );
};

export default TicketCard;
