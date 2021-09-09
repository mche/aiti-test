const re = {
  nonDigit: /\D+/g,
  name: /^\D{2,}\s+\D{2,}\s+\D{2,}$/,
  email: /[0-9a-z_.]+@[0-9a-z_.]+/i,
};

export default re;