
  google.setOnLoadCallback(drawCharts);

  function drawCharts() {
    var androidData = google.visualization.arrayToDataTable([
      ['Android Version', 'Visits'],
      ['5.x',     27437],
      ['4.x',     25861],
      ['older',  661],
      ['undefined',  1146]
    ]);

    var iosData = google.visualization.arrayToDataTable([
      ['iOS Version', 'Visits'],
      ['9.x',     133],
      ['8.x',     48891],
      ['7.x',      5519],
      ['older',  856]
    ]);

    var desktopData = google.visualization.arrayToDataTable([
      ['Browser & Version', 'Visits'],
      ['Internet Explorer Older',     4948],
      ['Internet Explorer 9',     13141],
      ['Internet Explorer 10',     8285],
      ['Internet Explorer 11',     53738],
      ['Firefox Older',     11076],
      ['Firefox 38',     11121],
      ['Firefox 39',     13176],
      ['Firefox 40',     7140],
      ['Chrome Older',     4906],
      ['Chrome 43.x',     18585],
      ['Chrome 44.x',     15786],
      ['Chrome 45+',     2128],
      ['Safari Older',    7026],
      ['Safari 7',     3595],
      ['Safari 8',     11039],
      ['Edge',      722],
      ['other',  1308]
    ]);


    $('.docs-chart-container').addClass('is-active');
    var androidChart = new google.visualization.PieChart(document.getElementById('android-piechart'));
    var iosChart = new google.visualization.PieChart(document.getElementById('ios-piechart'));
    var desktopChart = new google.visualization.PieChart(document.getElementById('desktop-piechart'));


    androidChart.draw(androidData, { title: 'Android Version Share' });
    iosChart.draw(iosData, { title: 'iOS Version Share' });
    desktopChart.draw(desktopData, { title: 'Browser Share on Desktop' });

  }   
