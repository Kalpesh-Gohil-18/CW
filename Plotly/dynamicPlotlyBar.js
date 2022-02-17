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

        async render(sel,col) {

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
            var color= ['rgb(158,202,225)','rgb(95,158,160)','rgb(58,200,225,.5)','rgb(0,191,255)','rgb(0,139,139)','rgb(65,105,225)','rgb(30,144,255)'];
          
            for(var i=0; i < sel.length; i++){

               // if(i%7 == 0) {if(i+2<sel.length){
                 //  cat.push(sel[i+6].Customer_Segment.description);
                //}
               // }
                if(i%col == 0){
                    order.push(sel[i]["@MeasureDimension"].rawValue);
                }   
                if(i%col == 1) {
                    sales.push(sel[i]["@MeasureDimension"].rawValue);
                }
                if(i%col == 2){
                    discount.push(sel[i]["@MeasureDimension"].rawValue);
                }
                if(i%col == 3){
                    profit.push(sel[i]["@MeasureDimension"].rawValue);
                }
                if(i%col == 4){
                    price.push(sel[i]["@MeasureDimension"].rawValue);
                }
                if(i%col == 5){
                    cost.push(sel[i]["@MeasureDimension"].rawValue);
                }
                if(i%col == 6){
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

            var abc = [order,sales,discount,profit,price,cost,margin]
            var trace=[];
		console.log(abc);

            for( var j=0; j<col; j++){
                trace[j] = {
                    x: cat,
                    y: abc[j],
                    type: 'bar',
                    text: abc[j].map(String),
                    textposition: 'auto',
                    hoverinfo: 'none',
                    opacity: 0.5,
                    marker: {
                        color: color[j],
                        line: {
                            color: 'rgb(8,48,107)',
                            width: 1.5
                        }
                    }
                };
		
            }

            console.log(trace);
                
            var layout = {
                title: 'January 2013 Sales Report'
            };

            const config1 = {
                displayModeBar: false,

            };
	
		//var data =[trace];
		//console.log(data);

            Plotly.newPlot(this._root, trace, layout,config1);

        }
    }
    customElements.define("plotly-dynamic-bar-chart", DplotlyBarChart);

})();