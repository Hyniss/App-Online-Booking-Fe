import moment from "moment/moment";

const compareDate = (dateTimeA, dateTimeB, format = "HH:mm DD/MM/YYYY") => {
    var momentA = moment(dateTimeA, format);
    var momentB = moment(dateTimeB, format);
    if (momentA > momentB) return 1;
    else if (momentA < momentB) return -1;
    else return 0;
};

const daysBetween = (fromDate, toDate, format = "HH:mm DD/MM/YYYY") => {
    const start = moment(toDate, format);
    const end = moment(fromDate, format);
    return Math.ceil(Math.abs(moment.duration(start.diff(end)).asDays()));
};

export { compareDate, daysBetween };
