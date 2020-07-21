import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import React, {useEffect} from 'react';

am4core.addLicense("CH155755061");
am4core.useTheme(am4themes_animated);

function Riskgraph({lines,height,width}){
  let chartReg: any = {};
  function createChart(chartdiv, charttype) {
    // Check if the chart instance exists
     maybeDisposeChart(chartdiv);

    // Create new chart
     chartReg[chartdiv] = am4core.create(chartdiv, charttype);
     return chartReg[chartdiv];
  }

  function maybeDisposeChart(chartdiv) {
    if (chartReg[chartdiv]) {
      chartReg[chartdiv].dispose();
      delete chartReg[chartdiv];
    }
  }


  const graphStyle = {
    height: height,
    width: width,
  }

  // Create chart instance
  let chart = createChart("chartdiv", am4charts.XYChart);

  /* Create axes */
  var categoryAxis = chart.xAxes.push(new am4charts.ValueAxis());
  categoryAxis.renderer.labels.template.fill = am4core.color("#FFFFFF");
  categoryAxis.renderer.grid.template.stroke = "#FFFFFF";
  categoryAxis.renderer.maxLabelPosition = 0.99;
  categoryAxis.renderer.minLabelPosition = 0.01;
  categoryAxis.renderer.minGridDistance = 70;
  categoryAxis.renderer.labels.template.rotation = 20;
  /* Create value axis */
  var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
  valueAxis.cursorTooltipEnabled = false;
  valueAxis.renderer.labels.template.fill = am4core.color("#FFFFFF");
  valueAxis.renderer.grid.template.stroke = "#FFFFFF";
  valueAxis.renderer.inside = true;
  valueAxis.renderer.labels.template.rotation = 20;
  valueAxis.renderer.maxLabelPosition = 0.99;
  valueAxis.renderer.minLabelPosition = 0.01;
  /* Create series */
  var series1 = chart.series.push(new am4charts.LineSeries());
  series1.dataFields.valueY = "p";
  series1.dataFields.valueX = "x";
  series1.name = "Option Value";
  series1.strokeWidth = 3;
  series1.legendSettings.labelText = "[{stroke}]{name}[/]";

  var series2 = chart.series.push(new am4charts.LineSeries());
  series2.dataFields.valueY = "i";
  series2.dataFields.valueX = "x";
  series2.name = "Intrinsic Value";
  series2.strokeWidth = 2;

  series2.tooltipText =  "[bold]{x}[/]\n" + "[" + series1.stroke.hex + "]●[/]" + "Option Value: [bold]{p}[/]\n" + "[" + series2.stroke.hex + "]●[/]" + "Intrinsic Value: [bold]{i}[/]"
  series2.tooltip.getFillFromObject = false;
  series2.tooltip.background.fill = am4core.color("#fff");
  series2.tooltip.label.fill = am4core.color("#00");
  series2.tooltip.pointerOrientation = "vertical";
  series2.legendSettings.labelText = "[{stroke}]{name}[/]";
  /* Add legend */
  chart.legend = new am4charts.Legend();
  /* Create a cursor */
  chart.cursor = new am4charts.XYCursor();
  chart.cursor.snapToSeries = series2
  chart.data = lines

  return (
    <div id="chartdiv" style={graphStyle}></div>
  );

}
export default Riskgraph;
