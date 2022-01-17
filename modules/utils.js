export const hideElements = (...elements) => elements.forEach(e => e.style.visibility = "hidden");
export const showElements = (...elements) => elements.forEach(e => e.style.visibility = "visible");
export const formatNumToSEK = (number) => {
  return new Intl.NumberFormat("sv-SE", {
    style: "currency",
    currency: "SEK",
  }).format(number);
};