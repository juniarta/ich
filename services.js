const { readJson, writeJson } = require('./utils/files');

async function findRewards(userID, date) {
    try {
        const inputDate = new Date(date);

        const data = await readJson();

        const fistDayofWeek = inputDate.getDate() - inputDate.getDay();
        const lastDayWeek = fistDayofWeek + 6;

        const startDate = new Date(inputDate.setDate(fistDayofWeek)).setHours(0, 0, 0, 0);
        const endDate = new Date(inputDate.setDate(lastDayWeek)).setHours(23, 59, 59, 999);

        const currentUserData = data?.find((item) => item.userID.toString() === userID.toString());
        const dataFiltered = currentUserData?.rewards?.filter((item) => {
            return (
                new Date(item.availableAt) >= startDate && new Date(item.availableAt) <= endDate
            );
        });

        if (dataFiltered && dataFiltered.length) {
            return dataFiltered;
        }

        const generatedData = Array.from({ length: 7 }).map((_, index) => {
            const startDateSave = new Date(startDate);
            const dayOfTheMonth = startDateSave.getDate();
            return {
                availableAt: new Date(startDateSave.setDate(dayOfTheMonth + index)),
                redeemedAt: null,
                expireAt: new Date(startDateSave.setDate(dayOfTheMonth + index + 1))
            }
        })

        if (currentUserData?.rewards?.length) {
            const newData = new Set([...currentUserData.rewards, ...generatedData]);
            currentUserData.rewards = [...newData];
        }

        const newData = currentUserData?.rewards?.length
            ? data.map((item) => {
                if (item.userID.toString() === userID.toString()) {
                    return currentUserData;
                }
                return item;
            })
            : [...data, { userID, rewards: generatedData }];

        await writeJson(newData);
        return generatedData;
    } catch (err) {
        console.log('ERROR Find Rewards:', err.message);
    }
}

async function redeemRewards(userID, date) {
    try {
        const data = await readJson();
        
        const currentUserData = data?.find(
            (item) => item.userID.toString() === userID.toString()
        );

        const redeemedData = currentUserData?.rewards?.find((item) => {
            return new Date(item.availableAt).getTime() === date.getTime();
        });

        if (redeemedData && !redeemedData.redeemedAt) {
            redeemedData.redeemedAt = new Date();

            console.log('dataon conditions', redeemedData)
            currentUserData.rewards = currentUserData.rewards.map((item) =>
                new Date(item.availableAt) === new Date(date) ? redeemedData : item
            );

            const newData = currentUserData?.rewards?.length
            ? data.map((item) => {
                if (item.userID.toString() === userID.toString()) {
                    return currentUserData;
                }
                return item;
            })
            : [...data, { userID, rewards: redeemedData }];
            
            await writeJson(newData);
            return redeemedData;
        }

        return null;

    } catch (err) {
        console.log('ERROR Redeem Rewards:', err.message);
    }
}

module.exports = {
    findRewards,
    redeemRewards
}