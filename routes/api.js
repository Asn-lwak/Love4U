const express = require("express");
const router = express.Router();

const db = require("../database");

// Test API
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Love4U API is working ❤️"
    });
});

// Save questionnaire responses
router.post("/responses", (req, res) => {

    const {
        name,
        age,
        favorite_color,
        favorite_food,
        favorite_dessert,
        date_type,
        favorite_activity,
        ideal_time
    } = req.body;

    const statement = db.prepare(`
        INSERT INTO responses (
            name,
            age,
            favorite_color,
            favorite_food,
            favorite_dessert,
            date_type,
            favorite_activity,
            ideal_time,
            accepted
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `);

    const result = statement.run(
        name,
        age,
        favorite_color,
        favorite_food,
        favorite_dessert,
        date_type,
        favorite_activity,
        ideal_time,
        "pending"
    );

    res.json({
        success: true,
        responseId: result.lastInsertRowid,
        message: "Responses saved successfully ❤️"
    });

});

// Update coffee-date decision
router.patch("/responses/:id/coffee", (req, res) => {

    const { id } = req.params;
    const { accepted } = req.body;

    if (!["yes", "no"].includes(accepted)) {
        return res.status(400).json({
            success: false,
            message: "Invalid coffee response."
        });
    }

    const statement = db.prepare(`
        UPDATE responses
        SET accepted = ?
        WHERE id = ?
    `);

    const result = statement.run(accepted, id);

    if (result.changes === 0) {
        return res.status(404).json({
            success: false,
            message: "Response not found."
        });
    }

    res.json({
        success: true,
        message: "Coffee response saved ❤️"
    });

});

module.exports = router;