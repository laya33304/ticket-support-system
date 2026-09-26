const db = require("../config/db");

const getComments = async (req, res, next) => {
  try {
    const { id } = req.params;

    const [rows] = await db.execute(
      `SELECT

c.id,

c.ticket_id,

c.user_id,

c.comment,

c.created_at,

u.name AS user_name,

u.role

FROM ticket_comments c

JOIN users u

ON c.user_id = u.id

WHERE c.ticket_id = ?

ORDER BY c.created_at`,

      [id],
    );

    res.json(rows);
  } catch (error) {
    next(error);
  }
};

const createComment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { comment } = req.body;
    const [result] = await db.execute(
      `INSERT INTO ticket_comments
             (ticket_id, user_id, comment)
             VALUES (?, ?, ?)`,
      [id, req.user.id, comment],
    );
    res.status(201).json({
      message: "Comment added",
      commentId: result.insertId,
    });
  } catch (error) {
    next(error);
  }
};
module.exports = {
  getComments,

  createComment,
};
