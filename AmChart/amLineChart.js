var getScriptPromisify = (src) => {
    return new Promise(resolve => {
        $.getScript(src, resolve)
    })
}

(function () {

    let template = document.createElement("template");
    template.innerHTML = ` 
			<div id="chart_div" style="width: 100%; height: 100%"></div>
		`;

    class amLineChart extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(template.content.cloneNode(true));

            this._root = this._shadowRoot.getElementById("chart_div");

            this._props = {};


        }

        async render(sel) {

            await getScriptPromisify("https://cdn.amcharts.com/lib/4/core.js");
            await getScriptPromisify("https://cdn.amcharts.com/lib/4/charts.js");
            await getScriptPromisify("https://cdn.amcharts.com/lib/4/themes/animated.js");

            am4core.useTheme(am4themes_animated);

            // Create chart instance
            var chart = am4core.create(this._root, am4charts.XYChart);

            var data= [];

            for(var i=0; i<sel.length; i++){
                var a={
                    "value" : sel[i]["@MeasureDimension"].rawValue,
                    "month" : sel[i]["Order_Date.CALMONTH"].description
                }
                data.push(a);
            }

            // Add data
            // chart.data = [{
            //     "date": new Date(2018, 0, 1),
            //     "value": 450,
            //     "value2": 162,
            //     "value3": 1100
            // }, {
            //     "date": new Date(2018, 0, 2),
            //     "value": 669,
            //     "value3": 841
            // }, {
            //     "date": new Date(2018, 0, 3),
            //     "value": 1200,
            //     "value3": 199
            // }, {
            //     "date": new Date(2018, 0, 4),
            //     "value2": 867
            // }, {
            //     "date": new Date(2018, 0, 5),
            //     "value2": 185,
            //     "value3": 669
            // }, {
            //     "date": new Date(2018, 0, 6),
            //     "value": 150
            // }, {
            //     "date": new Date(2018, 0, 7),
            //     "value": 1220,
            //     "value2": 350,
            //     "value3": 600
            // }];

            console.log(data);

            chart.data=data;
            // Create axes
            var categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
            categoryAxis.dataFields.category = "month";
            // categoryAxis.renderer.inside = true;
            // categoryAxis.renderer.minLabelPosition = 0.1;
            // categoryAxis.renderer.maxLabelPosition = 0.9;
            // categoryAxis.renderer.grid.template.location = 0;
            // categoryAxis.renderer.minGridDistance = 30;

            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

            // Create series
            function createSeries(field, name) {
                var series = chart.series.push(new am4charts.LineSeries());
                series.dataFields.valueY = field;
                series.dataFields.categoryX = "month";
                series.name = name;
                series.tooltipText = "{categoryX}: [b]{valueY}[/]";
                series.strokeWidth = 2;

                series.smoothing = "monotoneX";

                var bullet = series.bullets.push(new am4charts.CircleBullet());
                bullet.circle.stroke = am4core.color("#fff");
                bullet.circle.strokeWidth = 2;

                return series;
            }

            createSeries("value", "Order Quantity");
            //createSeries("value2", "profit");
            //createSeries("value3", "Sales");

            chart.legend = new am4charts.Legend();
            chart.cursor = new am4charts.XYCursor();

        };



    }

    customElements.define("line-series-chart", amLineChart);

})();
