import L from 'leaflet';
import * as scale from 'd3-scale';


var legend = {};

legend['manual-bivariate'] = function(MAP) {
    var legend = L.control({position: 'topleft'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend multivariate');

        // loop through the status values and generate a label with a coloured square for each value
        div.innerHTML = `<p class="title">&nbsp;${MAP.value[0]}</p>`+ MAP.order[1].map(
        (x,i) => {
            return MAP.order[0].map((y,j) => {
                return `<span style="background: ${MAP.colorschemes[j][i]}"></span>`;
            }).join('')+` ${MAP.order[0][i]}`;
        }).join('<br />') + '<br />⟶&#xfe0e; ' + MAP.value[1];
        return div;
    };


    legend.getColor = function(data) {
      var v1 = MAP.order[0].indexOf(data[MAP.value[0]]);
      var v2 = MAP.order[1].indexOf(data[MAP.value[1]]);

      return MAP.colorschemes[v2][
              v1
              ];
    };

    return legend;
};
legend['category'] = function(MAP) {
    var legend = L.control({position: 'topleft'});

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend multivariate');

        // loop through the status values and generate a label with a coloured square for each value
        div.innerHTML = `<strong>${MAP.value[0]}</strong><br />
            <span style="background: ${MAP.colorschemes[0][0]}"></span> ${MAP.order[0][0]}
            <br />
        `+ MAP.order[0].slice(1).map(
        (x,i) => {
            return `<span style="background: ${MAP.colorschemes[0][i+1]}"></span>`;
            }).join('')+` ${MAP.order[0].slice(1).join('-')}`
        return div;
    };


    legend.getColor = function(data) {
      var v1 = MAP.order[0].indexOf(data[MAP.value[0]]);

      return MAP.colorschemes[0][
              v1
              ];
    };

    return legend;
};


legend['quantile'] = function(MAP) {
    var legend = L.control({position: 'topleft'});
    var alldata = null;
    var myscale = null;

    legend.onAdd = function (map) {
        var div = L.DomUtil.create('div', 'info legend multivariate');

        // loop through the status values and generate a label with a coloured square for each value
        div.innerHTML = `<strong>${MAP.value}</strong><br />

        `+ `${Math.min.apply(Math,alldata)} ` + MAP.colorschemes[1].map(
        (x,i) => {
            return `<span style="background: ${x}"></span>`;
            }).join('')+` ${Math.max.apply(Math,alldata)} %`
        return div;
    };

    legend.ondata = function(data) {
        alldata = data.map((x) => x[MAP.value]).filter((x) => !isNaN(x));
        myscale = scale.scaleQuantile().domain(alldata).range(MAP.colorschemes[1]);
    }


    legend.getColor = function(data) {
      var v1 = data[MAP.value];
      if(isNaN(v1)){
        return MAP.colorschemes[0][0];
      }

      return myscale(v1);
    };

    return legend;
};

export {legend};
