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

  class DplotlyBarChart extends HTMLElement {
    constructor() {
      super();
      this._shadowRoot = this.attachShadow({ mode: "open" });
      this._shadowRoot.appendChild(template.content.cloneNode(true));

      this._root = this._shadowRoot.getElementById("chart_div");

      this._props = {};
    }

    async render() {

      await getScriptPromisify("https://d3js.org/d3.v4.js");
      //<svg id="myPlot" style="width:500px;height:500px"></svg> 
      // Set Dimensions
      const xSize = 500;
      const ySize = 500;
      const margin = 40;
      const xMax = xSize - margin * 2;
      const yMax = ySize - margin * 2;

      // Create Random Points
      const numPoints = 100;
      const data = [];
      for (let i = 0; i < numPoints; i++) {
        data.push([Math.random() * xMax, Math.random() * yMax]);
      }
      console.log(data);

      var w = this._root.clientWidth;
      var h = this._root.clientHeight;

      // Append SVG Object to the Page
      const svg = d3.select(this._root)
        // .append("svg")
        // .attr("width", w)
        // .attr("height", h)
        .classed("svg-container", true)
        .append("svg")
        .attr("width", w)
        .attr("height", h)
        // Responsive SVG needs these 2 attributes and no width and height attr.
        .attr("preserveAspectRatio", "xMinYMin meet")
        .attr("viewBox", "0 0 1000 1000")
        .classed("svg-content-responsive", true)

        .append("g")
        // .attr({"height": 100, "width": 100})
        .attr("transform", "translate(" + margin + "," + margin + ")");

      //.attr("transform","translate(" + height + "," + width + ")");

      // X Axis
      const x = d3.scaleLinear()
        .domain([0, 500])
        .range([0, xMax]);

      svg.append("g")
        .attr("transform", "translate(0," + yMax + ")")
        .call(d3.axisBottom(x));

      // Y Axis
      const y = d3.scaleLinear()
        .domain([0, 500])
        .range([yMax, 0]);

      svg.append("g")
        .call(d3.axisLeft(y));

      // Dots
      svg.append('g')
        .selectAll("dot")
        .data(data).enter()
        .append("circle")
        .attr("cx", function (d) { return d[0] })
        .attr("cy", function (d) { return d[1] })
        .attr("r", 3)
        .style("fill", "Red");


    }
  }

  customElements.define("d3-scatter-chart", DplotlyBarChart);

})();