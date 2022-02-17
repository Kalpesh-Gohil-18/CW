var getScriptPromisify = (src) => {
	return new Promise(resolve => {
		$.getScript(src, resolve)
	})
}

(function () {

	let template = document.createElement("template");
	template.innerHTML = ` 
			<style>
				:host {
					display: block;
				} 
			</style> 
			<div id="chart_div" style="width: 100%; height: 100%"></div>
		`;
//1
	class GoogleGauge extends HTMLElement {
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



			// Set theme
			am4core.useTheme(am4themes_animated);

			// Create chart instance
			var chart = am4core.create(this._root, am4charts.PieChart3D);

			// Let's cut a hole in our Pie chart the size of 40% the radius
			chart.innerRadius = am4core.percent(40);
			var a = [];
			// var b = [];

			for (var i = 0; i < sel.length; i++) {
				// a.push(sel[i].Province_3z1cg02r1y.description);
				// b.push(sel[i]["@MeasureDimension"].formattedValue);

				var b = {

					A: sel[i].Province_3z1cg02r1y.description,
					B: sel[i]["@MeasureDimension"].rawValue

				}

				a.push(b);
				// console.log(b);
			}
			console.log(a);

			// Add data
			chart.data = a;

			// Add and configure Series
			var pieSeries = chart.series.push(new am4charts.PieSeries3D());
			pieSeries.dataFields.value = "B";
			pieSeries.dataFields.category = "A";
			pieSeries.slices.template.stroke = am4core.color("#fff");
			pieSeries.slices.template.strokeWidth = 2;
			pieSeries.slices.template.strokeOpacity = 1;

			// Disabling labels and ticks on inner circle
			pieSeries.labels.template.disabled = true;
			pieSeries.ticks.template.disabled = true;

			// Disable sliding out of slices
			pieSeries.slices.template.states.getKey("hover").properties.shiftRadius = 0;
			pieSeries.slices.template.states.getKey("hover").properties.scale = 1.1;



		}
	}
	customElements.define("com-sap-sample-chart", GoogleGauge);

})();