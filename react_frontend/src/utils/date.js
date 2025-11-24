function clone(d) {
  return new Date(d.getTime());
}

// PUBLIC_INTERFACE
export function startOfDay(d) {
  const x = clone(d);
  x.setHours(0, 0, 0, 0);
  return x;
}

// PUBLIC_INTERFACE
export function endOfDay(d) {
  const x = clone(d);
  x.setHours(23, 59, 59, 999);
  return x;
}

// PUBLIC_INTERFACE
export function addDays(d, days) {
  const x = clone(d);
  x.setDate(x.getDate() + days);
  return x;
}

// PUBLIC_INTERFACE
export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

// PUBLIC_INTERFACE
export function startOfWeek(d, weekStartsOn = 0) {
  const x = startOfDay(d);
  const diff = (x.getDay() - weekStartsOn + 7) % 7;
  return addDays(x, -diff);
}

// PUBLIC_INTERFACE
export function endOfWeek(d, weekStartsOn = 0) {
  return addDays(startOfWeek(d, weekStartsOn), 6);
}

// PUBLIC_INTERFACE
export function getMonthGrid(d) {
  const firstOfMonth = new Date(d.getFullYear(), d.getMonth(), 1);
  const start = startOfWeek(firstOfMonth, 0);
  const weeks = [];
  let cur = start;
  for (let w = 0; w < 6; w++) {
    const week = [];
    for (let i = 0; i < 7; i++) {
      week.push(new Date(cur));
      cur = addDays(cur, 1);
    }
    weeks.push(week);
  }
  return weeks;
}

// PUBLIC_INTERFACE
export function formatDayNumber(d) {
  return d.getDate();
}

// PUBLIC_INTERFACE
export function weekdayShort(index) {
  const names = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  return names[index % 7];
}

// PUBLIC_INTERFACE
export function formatMonthYear(d) {
  return d.toLocaleDateString(undefined, { month: 'long', year: 'numeric' });
}

// PUBLIC_INTERFACE
export function formatHourLabel(h) {
  const a = h === 0 ? 12 : h > 12 ? h - 12 : h;
  const ap = h < 12 ? 'AM' : 'PM';
  return `${a}:00 ${ap}`;
}
