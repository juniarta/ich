const express = require('express');
const { findRewards, redeemRewards } = require('./services');

const app = express();
const port = process.env.PORT || 8000

app.get("/health", (_, res) => {
    res.status(200).send("ok");
  });

app.get("/users/:id/reward", async (req, res) => {
    const { id } = req.params;
    const { at } = req.query;

    try {
        if(!id || !at) {
            res.status(400).send("Bad Request");
            return;
        }

        const date = new Date(at);

        if(isNaN(date.getTime())) {
            res.status(400).send("Please input valid date")
        }

        const results = await findRewards(id, at);
        return res.status(200).send({ data: results})
    } catch (err) {
        res.status(500).send(err.message);
    }
});

app.patch("/users/:id/reward/:redeemAt/redeem", async (req, res) => {
    try {
        const { id, redeemAt } = req.params;

        const redeem = await redeemRewards(id, new Date(redeemAt));

        if (redeem) {
            return res.status(200).send({ data: redeem });
        }

        return res.status(400).send({ error: { message: "This reward is already expired"}});
        
    } catch (error) {
        res.status(500).send(err.message);
    }
})

app.listen(port, () => {
    console.log(`App running on port ${port}`)
})