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

    class plotlyBarChart extends HTMLElement {
        constructor() {
            super();
            this._shadowRoot = this.attachShadow({ mode: "open" });
            this._shadowRoot.appendChild(template.content.cloneNode(true));

            this._root = this._shadowRoot.getElementById("chart_div");

            this._props = {};


        }

        async render(sel) {

            await getScriptPromisify("https://cdn.plot.ly/plotly-2.9.0.min.js");

            /*var xValue = ['Product A', 'Product B', 'Product C'];

            var yValue = [20, 14, 23];
            var yValue2 = [24, 16, 20];*/

            var cat = ['Consumer', 'Corporate', 'Home Office', 'Small Business'];
            var profit = [];
            var order = [];
            var sales = [];
            var discount = [];
            var price = [];
            var cost = [];
            var margin = [];
          
            for(var i=0; i < sel.length; i++){

               // if(i%7 == 0) {if(i+2<sel.length){
                 //  cat.push(sel[i+6].Customer_Segment.description);
                //}
               // }
                if(i%7 == 0){
                    order.push(sel[i]["@MeasureDimension"].rawValue);
                }   
                if(i%7 == 1) {
                    sales.push(sel[i]["@MeasureDimension"].rawValue);
                }
                if(i%7 == 2){
                    discount.push(sel[i]["@MeasureDimension"].rawValue);
                }
                if(i%7 == 3){
                    profit.push(sel[i]["@MeasureDimension"].rawValue);
                }
                if(i%7 == 4){
                    price.push(sel[i]["@MeasureDimension"].rawValue);
                }
                if(i%7 == 5){
                    cost.push(sel[i]["@MeasureDimension"].rawValue);
                }
                if(i%7 == 6){
                    margin.push(sel[i]["@MeasureDimension"].rawValue);
                }
               
            }
            console.log(cat);
            console.log(order);
            console.log(sales);
            console.log(discount);
            console.log(profit);
            console.log(price);
            console.log(cost);
            console.log(margin);

            var trace1 = {
                x: cat,
                y: order,
                type: 'bar',
                text: order.map(String),
                textposition: 'auto',
                hoverinfo: 'none',
                opacity: 0.5,
                marker: {
                    color: 'rgb(158,202,225)',
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1.5
                    }
                }
            };

            var trace2 = {
                x: cat,
                y: sales,
                type: 'bar',
                text: sales.map(String),
                textposition: 'auto',
                hoverinfo: 'none',
                opacity: 0.5,
                marker: {
                    color: 'rgb(95,158,160)',
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1.5
                    }
                }
            };

            var trace3 = {
                x: cat,
                y: discount,
                type: 'bar',
                text: discount.map(String),
                textposition: 'auto',
                hoverinfo: 'none',
                marker: {
                    color: 'rgba(58,200,225,.5)',
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1.5
                    }
                }
            };

            var trace4 = {
                x: cat,
                y: profit,
                type: 'bar',
                text: profit.map(String),
                textposition: 'auto',
                hoverinfo: 'none',
                opacity: 0.5,
                marker: {
                    color: 'rgb(0,191,255)',
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1.5
                    }
                }
            };

            var trace5 = {
                x: cat,
                y: price,
                type: 'bar',
                text: price.map(String),
                textposition: 'auto',
                hoverinfo: 'none',
                opacity: 0.5,
                marker: {
                    color: 'rgb(0,139,139)',
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1.5
                    }
                }
            };

            var trace6 = {
                x: cat,
                y: cost,
                type: 'bar',
                text: cost.map(String),
                textposition: 'auto',
                hoverinfo: 'none',
                opacity: 0.5,
                marker: {
                    color: 'rgb(65,105,225)',
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1.5
                    }
                }
            };

            var trace7 = {
                x: cat,
                y: margin,
                type: 'bar',
                text: margin.map(String),
                textposition: 'auto',
                hoverinfo: 'none',
                opacity: 0.5,
                marker: {
                    color: 'rgb(30,144,255)',
                    line: {
                        color: 'rgb(8,48,107)',
                        width: 1.5
                    }
                }
            };

            var data = [trace1, trace2, trace3, trace4, trace5, trace6, trace7];
		console.log(data);

            var layout = {
                title: 'January 2013 Sales Report'
            };

            const config = {
                displayModeBar: false,

            };

            Plotly.newPlot(this._root, data, layout,config);

        }
    }
    customElements.define("plotly-bar-chart", plotlyBarChart);

})();
