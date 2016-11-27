function ellipsis(str, max=10) {
  if (str.length <= max) return str;
  return str.substr(0, max) + '...';
}

module.exports = {
  ellipsis
}