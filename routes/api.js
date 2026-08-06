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
            favorite_activity,
            ideal_time
        )
        VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    statement.run(
        name,
        age,
        favorite_color,
        favorite_food,
        favorite_dessert,
        favorite_activity,
        ideal_time
    );

    res.json({
        success: true,
        message: "Responses saved successfully ❤️"
    });

});

module.exports = router;