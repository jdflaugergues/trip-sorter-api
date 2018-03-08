'use strict';

// capitalize the first letter of a string and the rest in lower case.
function capitalizeFirstLetter(string) {
  if (typeof string !== 'string') {
    return;
  }
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
};

module.exports = {
  capitalizeFirstLetter
};
