const changeTimestamp = date => Math.floor(Number(date) / 1000);
const momentTime = _ => Math.floor(Number(new Date()) / 1000);

const dispose = res => JSON.parse(JSON.stringify(res));
const returnTime = (res, str) => res.map(item => item[str] *= 1000);

module.exports = {
    changeTimestamp,
    momentTime,
    dispose,
    returnTime,
}