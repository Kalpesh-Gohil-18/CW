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
            this.addEventListener("click", event => {
                var eventclick = new Event("onClick");
                this.dispatchEvent(eventclick);
            });
        }

        onCustomWidgetAfterUpdate(changedProperties) {
            var that = this;
            render(that, this._root, changedProperties);
        }

        _firePropertiesChanged() {
            this.selectedNode = "";
            this.dispatchEvent(new CustomEvent("propertiesChanged", {
                detail: {
                    properties: {
                        selectedNode: this.selectedNode
                    }
                }
            }))
        }
    }
    customElements.define("line-series-chart", amLineChart);

    async function render(that, root1) {

        await getScriptPromisify("https://cdn.amcharts.com/lib/4/core.js");
        await getScriptPromisify("https://cdn.amcharts.com/lib/4/charts.js");
        await getScriptPromisify("https://cdn.amcharts.com/lib/4/themes/animated.js");

        am4core.useTheme(am4themes_animated);

        var sel = that.resultset;
        var part = that.partition_1;

        var data = [];

        var all_arr = [];
        var line_arr = [];
        var range_arr = [];

        var all = sel[0]["@MeasureDimension"].description;
        all_arr.push(all);

        for (var i = 1; i < sel.length; i++) {
            if (all !== sel[i]["@MeasureDimension"].description) {
                all_arr.push(sel[i]["@MeasureDimension"].description);
            }
            else {
                break;
            }
        }

        for (var j = 0; j < all_arr.length; j++) {
            if (all_arr[j].charAt(1) === "_") {
                line_arr.push(all_arr[j]);
            }
            if (all_arr[j].charAt(1) === "M") {
                range_arr.push(all_arr[j].slice(2, all_arr[j].length));
            }
        }

        console.log(all_arr);
        console.log(line_arr);
        console.log(range_arr);

        for (var k = 0; k < sel.length; k = k + all_arr.length) {
            var a = { a0: new Date(sel[(k)].Year.description) };

            for (var m = 0; m < all_arr.length; m++) {
                if (sel[k + m]["@MeasureDimension"].formattedValue == 0) {
                    a[all_arr[m]] = null;
                }
                else {
                    a[all_arr[m]] = sel[k + m]["@MeasureDimension"].formattedValue;
                }


            }
            data.push(a);
        }
        console.log(data);

        var chart = am4core.create(root1, am4charts.XYChart);

        if (part == true) {
            chart.leftAxesContainer.layout = "vertical";
            // chart.rightAxesContainer="vertical";
        }

        var title = chart.titles.create();
        title.text = "Line Chart";
        title.fontSize = 25;
        title.marginBottom = 30;

        chart.cursor = new am4charts.XYCursor();
        chart.cursor.maxTooltipDistance = 20;

        chart.data = data;

        // Add Scroller
        chart.scrollbarX = new am4core.Scrollbar();
        chart.scrollbarX.parent = chart.bottomAxesContainer;

        var interfaceColors = new am4core.InterfaceColorSet();

        // Create axes
        var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
        dateAxis.renderer.minGridDistance = 0;
        dateAxis.periodChangeDateFormats.setKey("month", "[bold]yyyy[/]");
        dateAxis.skipEmptyPeriods = true;
        dateAxis.title.text = "[bold]Year"

        if (part == true) {
            var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.title.text = "[bold]Values"
        }

        var valueAxis1 = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis1.title.text = "[bold]Values"
        valueAxis1.renderer.maxLabelPosition = 0.95;

        // Create Range 
        var event = dateAxis.axisRanges.create();
        event.date = new Date(2001, 10, 17);
        event.endDate = new Date(2002, 0, 17);
        event.grid.disabled = false;
        event.axisFill.fillOpacity = 0.1;
        event.label.inside = true;
        event.label.text = "[bold]Null Values";
        event.label.location = 0.5
        event.label.valign = "top";
        
        // Create Line
        for (var n = 0; n < line_arr.length; n++) {
            var series0 = chart.series.push(new am4charts.LineSeries());
            series0.data = chart.data;
            series0.dataFields.valueY = line_arr[n];
            series0.dataFields.dateX = "a0";
            series0.name = line_arr[n];
            series0.tooltipText = " [bold]{name}[\]:{valueY.value} \n{dateX.formatDate('MMM yyyy')}";
            series0.bullets.push(new am4charts.CircleBullet());
            series0.yAxis = valueAxis1;
        }

        // Create Range
        for (var o = 0; o < range_arr.length; o++) {
            //Mid
            var series1 = chart.series.push(new am4charts.LineSeries());
            series1.data = chart.data;
            series1.dataFields.valueY = "RM" + range_arr[o];
            series1.dataFields.dateX = "a0";
            series1.name = "RM" + range_arr[o];
            series1.tensionX = 0.9;
            series1.defaultState.transitionDuration = 1500;
            series1.strokeWidth = 1.5;
            series1.tooltipText = " [bold]{name}[\]-{valueY.value} ";
            var bullet = series1.bullets.push(new am4charts.Bullet());
            var square = bullet.createChild(am4core.Rectangle);
            square.horizontalCenter = "middle";
            square.verticalCenter = "middle";
            square.width = 10;
            square.height = 10;
            series1.yAxis = valueAxis1;

            //Low
            var series2 = chart.series.push(new am4charts.LineSeries());
            series2.data = chart.data;
            series2.dataFields.valueY = "RL" + range_arr[o];
            series2.dataFields.dateX = "a0";
            series2.dataFields.openValueY = "RM" + range_arr[o];
            series2.fillOpacity = 0.3;
            series2.tensionX = 0.9;
            series2.defaultState.transitionDuration = 1500;
            series2.strokeWidth = 0;
            series2.name = "RL" + range_arr[o];
            series2.yAxis = valueAxis1;

            //High
            var series3 = chart.series.push(new am4charts.LineSeries());
            series3.data = chart.data;
            series3.dataFields.valueY = "RH" + range_arr[o];
            series3.dataFields.dateX = "a0";
            series3.dataFields.openValueY = "RM" + range_arr[o];
            series3.fillOpacity = 0.3;
            series3.tensionX = 0.9;
            series3.defaultState.transitionDuration = 1500;
            series3.strokeWidth = 0;
            series3.name = "RH" + range_arr[o];
            series3.yAxis = valueAxis1;
        }

        if (part == true) {

            // Create Line
            for (var n = 0; n < line_arr.length; n++) {
                var series0 = chart.series.push(new am4charts.LineSeries());
                series0.data = chart.data;
                series0.dataFields.valueY = line_arr[n];
                series0.dataFields.dateX = "a0";
                series0.name = line_arr[n];
                series0.tooltipText = " [bold]{name}[\]:{valueY.value} \n{dateX.formatDate('MMM yyyy')}";
                series0.bullets.push(new am4charts.CircleBullet());
            }

            // Create Range
            for (var o = 0; o < range_arr.length; o++) {
                //Mid
                var series1 = chart.series.push(new am4charts.LineSeries());
                series1.data = chart.data;
                series1.dataFields.valueY = "RM" + range_arr[o];
                series1.dataFields.dateX = "a0";
                series1.name = "RM" + range_arr[o];
                series1.tensionX = 0.9;
                series1.defaultState.transitionDuration = 1500;
                series1.strokeWidth = 1.5;
                series1.tooltipText = " [bold]{name}[\]-{valueY.value} ";
                var bullet = series1.bullets.push(new am4charts.Bullet());
                var square = bullet.createChild(am4core.Rectangle);
                square.horizontalCenter = "middle";
                square.verticalCenter = "middle";
                square.width = 10;
                square.height = 10;

                //Low
                var series2 = chart.series.push(new am4charts.LineSeries());
                series2.data = chart.data;
                series2.dataFields.valueY = "RL" + range_arr[o];
                series2.dataFields.dateX = "a0";
                series2.dataFields.openValueY = "RM" + range_arr[o];
                series2.fillOpacity = 0.3;
                series2.tensionX = 0.9;
                series2.defaultState.transitionDuration = 1500;
                series2.strokeWidth = 0;
                series2.name = "RL" + range_arr[o];

                //High
                var series3 = chart.series.push(new am4charts.LineSeries());
                series3.data = chart.data;
                series3.dataFields.valueY = "RH" + range_arr[o];
                series3.dataFields.dateX = "a0";
                series3.dataFields.openValueY = "RM" + range_arr[o];
                series3.fillOpacity = 0.3;
                series3.tensionX = 0.9;
                series3.defaultState.transitionDuration = 1500;
                series3.strokeWidth = 0;
                series3.name = "RH" + range_arr[o];
            }
        }
    }

})();