'use strict';

$(document).ready(function() {
  /*$(document).on("buildingSelector.dateselector", function (e) {
      console.log('building...');
  });
  $(document).on("selectorBuilt.dateselector", function (e) {
      console.log('built at ' + e.time);
  });
  $(document).on("initializingSelector.dateselector", function (e) {
      console.log('init...');
  });
  $(document).on("selectorInitialized.dateselector", function (e) {
      console.log('init done');
  });
  $(document).on("settingDate.dateselector", function (e) {
      console.log('setting date...');
  });
  $(document).on("dateSet.dateselector", function (e) {
      console.log('date set');
  });
  $(document).on("gettingDate.dateselector", function (e) {
      console.log('getting date...');
  });
  $(document).on("dateGot.dateselector", function (e) {
      console.log('date got');
  });
  $(document).on("updatingSelector.dateselector", function (e) {
      console.log('updating...');
  });
  $(document).on("selectorUpdated.dateselector", function (e) {
      console.log('updated');
  });*/

  $('.dateselector1').dateSelector();

  $('.dateselector2').dateSelector({
    container: '#custom-container'
  });

  $('.dateselector3').dateSelector({
    onDateChange: function() { 
      alert('date changed!');
    }
  });

  $('.dateselector4').dateSelector({
    hideSourceNode: false
  });

  $('.dateselector5').dateSelector({
    showTime: true,
    hoursStep: 2,
    minutesStep: 15,
    secondsStep: 30
  });

  $('.dateselector-bs').dateSelector({
    cssFramework: 'bootstrap'
  });

  $('.dateselector-fdt').dateSelector({
    cssFramework: 'foundation'
  });

  $('.dateselector6').dateSelector({
      onDateChange: function() { 
        alert($('.dateselector6').dateSelector('getDate'));
      }
    });

  $('.dateselector7').dateSelector().dateSelector('setDate', new Date(2000, 2, 12));
});
