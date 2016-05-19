function getData(userOpt) {
  var defaultOpt = {
    limit: null,
    type: null,
    near: null,
    dateRange: null
  };

  userOpt = userOpt || {};
  var queryStr = '';
  for (var config in defaultOpt) {
    var opt = (userOpt.hasOwnProperty(config)) ? userOpt : defaultOpt;
    if (opt[config] !== null) {
      queryStr += (queryStr.length) ? '&' : '?';
      switch (config) {
        case 'limit':
          queryStr += `$limit=${opt.limit}`;
          break;
        case 'near':
          queryStr += `$where=within_circle(report_location, ${opt.near.lat}, ${opt.near.lng}, ${opt.near.meter})`;
          break;
        case 'dateRange':
          var dateQuery = opt.dateRange.map(function(date) {
            return (new Date(date)).toISOString().split('.')[0];
          });
          queryStr += `$where=datetime between '${dateQuery[0]}' and '${dateQuery[1]}'`
          break;
        default:
          queryStr += `${config}=${opt[config]}`;
      }
    }
  }
  // console.log('query: ', queryStr);

  var endpoint = 'http://localhost:3000/data/getData';
  // if (queryStr.length) endpoint += queryStr;

  var markerData;
  return $.ajax(endpoint).then(function(data) {
    var markerData = data.map(function(el) {
      return {
        lat: el['lat'],
        lng: el['lng'],
        dateTime: el['datetime'],
        address: el['location'],
        type: el['type'],
        incidentNum: el['incidentNumber'],
        status: el['status'],
        units: el['units'],
        level: el['level']
      };
    });

    console.log(`Rendering ${markerData.length} items on map`);
    displayMarkers(markerData);
    return data;
  });
}

getData({ limit: 30 });

var dummyData1 = {
  limit: null,
  type: null,
  near: {
    lat: 47.59815,
    lng: -122.336540,
    meter: 500
  },
  dateRange: null
};

var dummyData2 = {
  limit: 30,
  dateRange: ['2016-04-14', Date.now()]
};
