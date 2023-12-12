// eslint-disable-next-line consistent-return
const timeStrToSeconds = (data, duration) => {
  const output = data.toString('utf8');
  const progressMatch = output.match(/time=(\d+:\d+:\d+\.\d+)/);
  if (progressMatch) {
    const currentTime = progressMatch[1];
    const timeArray = currentTime.split(':');
    const [seconds, ms] = timeArray[2].split('.');
    const inSecond = Number(seconds) + Number(timeArray[1] * 60) + Number(timeArray[0] * 60 * 60);
    console.info(`>>>>>>>>>>>>>>>>>>>>>>>> ${((parseFloat(`${inSecond}.${ms}`) / duration) * 100).toFixed(2)} % Completed`);
  }
};

module.exports = { timeStrToSeconds };
