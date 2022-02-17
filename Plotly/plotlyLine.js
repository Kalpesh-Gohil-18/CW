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

  class plotlyLine extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._root = this._shadowRoot.getElementById("chart_div");

      this._props = {};


    }

    async render(sel) {

      await getScriptPromisify("https://cdn.plot.ly/plotly-2.9.0.min.js");

      var month = [];
      var order = [];

      for (var i = 0; i < sel.length; i++) {
        order.push(sel[i]["@MeasureDimension"].rawValue);
        month.push(sel[i]["Order_Date.CALMONTH"].description);
      }
      //console.log([month,order]);
      var trace1 = {
        x: month,//['jan','feb','mar','apr','may','jun','jul','aug','sep','oct','nov','dec'],
        y: order,
        mode: 'lines+markers',
        connectgaps: true
      };

      // var trace2 = {
      //   x: [1, 2, 3, 4, 5, 6, 7, 8],
      //   y: [16, null, 13, 10, 8, null, 11, 12],
      //   mode: 'lines+markers',
      //   connectgaps: true
      // };

      var data = [trace1];

      var layout = {
        title: 'Connect the Gaps Between Data',
        showlegend: false
      };

      var config = {
        displayModeBar: false
      };

      Plotly.newPlot(this._root, data, layout, config);
    }
  }
  customElements.define("plotly-line-series-chart", plotlyLine);

})();