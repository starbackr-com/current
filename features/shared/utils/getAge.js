export const getAge = (timestamp) => {
    const now = new Date();
    const timePassedInMins = Math.floor(
        (now - new Date(timestamp * 1000)) / 1000 / 60
    );

    if (timePassedInMins < 60) {
        return `${timePassedInMins}min ago`;
    } else if (timePassedInMins >= 60 && timePassedInMins < 1440) {
        return `${Math.floor(timePassedInMins / 60)}h ago`;
    } else if (timePassedInMins >= 1440 && timePassedInMins < 10080) {
        return `${Math.floor(timePassedInMins / 1440)}d ago`;
    } else {
        return `on ${new Date(timestamp * 1000).toLocaleDateString()}`;
    }
};
