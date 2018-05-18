function getQueryString(key){
  var queryStr = window.location.search.substr(1);
  var queryArr = queryStr.split('&');
  for (var k in queryArr) {
    var queryBunch = queryArr[k];
    if (queryBunch.indexOf(key + '=') == 0) {
      return queryBunch.split('=')[1];
    }
  }
}
export default getQueryString