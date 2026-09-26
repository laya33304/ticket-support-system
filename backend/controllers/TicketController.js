const db = require("../config/db");

const createTicket = async (req, res, next) => {
  try {
    const { subject, description, priority } = req.body;
    const [result] = await db.execute(
      `INSERT INTO tickets
             (user_id, subject, description, priority)
             VALUES (?, ?, ?, ?)`,
      [req.user.id, subject, description, priority || "medium"],
    );
    res.status(201).json({
      message: "Ticket created",
      ticketId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};

const getTickets = async (req, res, next) => {
  try {
    let query;
    let values = [];
    if (req.user.role === "agent") {
      query = `
                SELECT
                    tickets.id,
                    tickets.subject,
                    tickets.description,
                    tickets.status,
                    tickets.priority,
                    tickets.user_id,
                    users.name AS user_name
                FROM tickets
                JOIN users
                    ON tickets.user_id = users.id
                ORDER BY tickets.created_at DESC
            `;
    } else {
      query = `
                SELECT
                    tickets.id,
                    tickets.subject,
                    tickets.description,
                    tickets.status,
                    tickets.priority,
                    tickets.user_id,
                    tickets.assigned_to,
                    users.name AS user_name
                FROM tickets
                JOIN users
                    ON tickets.user_id = users.id
                WHERE tickets.user_id = ?
                ORDER BY tickets.created_at DESC
            `;
      values = [req.user.id];
    }
    const [rows] = await db.execute(query, values);
    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const getTicketById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const [rows] = await db.execute(
      `SELECT
                tickets.id,
                tickets.subject,
                tickets.description,
                tickets.status,
                tickets.priority,
                tickets.user_id,
                users.name AS user_name
             FROM tickets
             JOIN users
                ON tickets.user_id = users.id
             WHERE tickets.id = ?`,
      [id],
    );
    if (rows.length === 0) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }
    const ticket = rows[0];
    if (req.user.role === "customer" && ticket.user_id !== req.user.id) {
      return res.status(403).json({
        message: "You are not allowed to access this ticket",
      });
    }
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

const updateTicket = async (req, res, next) => {
  try {
    const { id } = req.params;

    // 1. We MUST extract assigned_to here first before using it anywhere else!
    const { status, priority, assigned_to } = req.body;

    // 2. Validate the agent only if assigned_to is provided in the JSON body
    if (assigned_to) {
      const [agents] = await db.execute(
        `SELECT id FROM users WHERE id = ? AND role = 'agent'`,
        [assigned_to],
      );

      if (agents.length === 0) {
        return res.status(400).json({
          message: "assigned_to must be a valid agent",
        });
      }
    }

    // 3. Update the ticket columns safely
    const [result] = await db.execute(
      `UPDATE tickets
       SET status = ?, priority = ?, assigned_to = ?
       WHERE id = ?`,
      [status || "open", priority || "medium", assigned_to || null, id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    return res.json({
      message: "Ticket updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

const deleteTicket = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [result] = await db.execute(
      "DELETE FROM tickets WHERE id = ?",

      [id],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Ticket not found",
      });
    }

    res.json({
      message: "Ticket deleted",
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createTicket,

  getTickets,

  getTicketById,

  updateTicket,

  deleteTicket,
};
