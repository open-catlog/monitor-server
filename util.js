'use strict';

exports.isEmptyObject = function (obj) {
  for (var key in obj) {
    return false;
  }
  return true;
}