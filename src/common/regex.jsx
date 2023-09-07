import { format } from "date-fns";

const checkName = name => {
  const numberRegExp = /[\d]/;
  const specialCharRegExp = /[\{\}\[\]\/?.,;:|\)*~`!^\-+<>@\#$%&\\\=\(\'\"]/gi;
  return (
    name.length < 1 ||
    name.length > 35 ||
    numberRegExp.test(name) ||
    specialCharRegExp.test(name)
  );
};

const checkEmail = email => {
  const emailRegExp = /^[0-9a-zA-Z]([-_\.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
  return !emailRegExp.test(email);
};

const checkDate = (year, month, day) => {
  const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (year % 400 === 0 || (year % 100 !== 0 && year % 4 === 0)) {
    monthLength[1] = 29;
  }
  return day > monthLength[month - 1];
}

const fomatDate = date => {
  const date1 = new Date(date);
  const formattedDate = format(date1, 'HH:mm dd/MM/yyyy');
  return formattedDate;
}

const fomatDates = dateTimeStr => {
  const [time, date] = dateTimeStr.split(" ");
  const [day, month, year] = date.split("/");

  // Ensure that month and day are padded with leading zeros if necessary
  const formattedMonth = String(month).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");

  return  `${year}-${formattedMonth}-${formattedDay}`;
}

const fomatDateBooking = dateTimeStr => {
  const [time, date] = dateTimeStr.split(" ");
  const [day, month, year] = date.split("/");

  // Ensure that month and day are padded with leading zeros if necessary
  const formattedMonth = String(month).padStart(2, "0");
  const formattedDay = String(day).padStart(2, "0");

  return  `${formattedDay}/${formattedMonth}/${year}`;
}


const fomatDateTravel = dateString => {
  const [time, date] = dateString.split(" "); 
  const [hour, minute] = time.split(":"); 
  const [day, month, year] = date.split("/"); 
  return new Date(`${year}-${month}-${day}T${hour}:${minute}`);
}



export { checkName, checkEmail, checkDate, fomatDate, fomatDates, fomatDateTravel, fomatDateBooking };