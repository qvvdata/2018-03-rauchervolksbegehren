'use strict';
require('./qvv.css');
require('./leaflet.fusesearch.09e7508.css');
require('./style.css');
require('leaflet-responsive-popup/leaflet.responsive.popup.css')



import {getEmbed} from './pymembed';
window.getEmbed = getEmbed;

import L from 'leaflet';
//import LS from 'leaflet-sleep';
import URI from 'urijs';
import * as request from 'd3-request/index';
import * as format from 'd3-format/index';
import * as queue from 'd3-queue/index';
import * as scale from 'd3-scale/index';
import * as topojson  from 'topojson/index';
import './leaflet.fusesearch.09e7508';
import 'leaflet-responsive-popup';

import {maps} from './data';

import {legend} from './legend';

var PARAMS = URI.parseQuery(document.location.search)

var MAP = maps[PARAMS.map];
var colorlegend = legend[MAP.scale](MAP);

var pymChild = new pym.Child();


format.formatDefaultLocale({decimal: ",", thousands: ".", grouping: [3], currency: ['€ ','']})
var numfmt = format.format(',d');
var pctfmt = format.format(',.2r');

var map = L.map('graph',
  {
    zoomControl: false,
    pan: false,
    wakeMessage: 'Karte mit Klick aktivieren',
    wakeMessageTouch: 'Karte mit Berührung aktivieren',
    sleepOpacity: .95,
    hoverToWake: false,
    zoomSnap: 0.25
  });

map.dragging.disable();
map.touchZoom.disable();
map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();
map.keyboard.disable();

// Disable tap handler, if present.
if (map.tap) map.tap.disable();

map.createPane('popup2',map._container);
map.on('move', function() {
  map._panes['popup2'].style.transform = map._mapPane.style.transform;

});


document.getElementsByTagName('h1')[0].innerHTML = PARAMS.bundesland && MAP.bundesland_title ? MAP.bundesland_title : MAP.title;
document.querySelector('footer .actual_source').innerHTML = MAP.source;
document.querySelector('footer p.detail').innerHTML = MAP.detail || '';
document.querySelector('body p').innerHTML = MAP.description || '';

if(PARAMS.force_message || (PARAMS.bundesland && MAP.bundesland_message)) {
  document.querySelector('#bundesland_message').innerHTML = MAP.bundesland_message;
}

queue.queue()
  .defer(request.json, 'gemeinden_w_bez_topo.json')
  .defer(request.csv, MAP.csv)
  .await(function(error, topo, data){
    var os = topo.objects[Object.keys(topo.objects)[0]];
    if(PARAMS.bundesland) {
      os.geometries = os.geometries.filter((x) => x.properties.GKZ[0]==PARAMS.bundesland);
    }
    var tf =
      topojson.feature(topo, os);
    var layer;

    if(colorlegend.ondata) {
      colorlegend.ondata(data);
    }

    layer = L.geoJson(
      tf, {
        smoothFactor: L.Browser.retina?0.5:1,
        style: function(feature) {
          feature.data = data.filter((x) => x.gkz_neu==feature.properties.GKZ)[0];
          return {
            fillColor: feature.data?colorlegend.getColor(feature.data):'lightgrey',
              color: 'white',
              weight: L.Browser.retina?0.25:0.5,
              opacity: 1,
              fillOpacity: 1
            };
          },
        onEachFeature: function(feature,thislayer) {
          feature.layer = thislayer;
          thislayer.on({
            'mouseover': (e) => {e.target.setStyle({weight: 1.5})},
            'mouseout': (e) => {layer.resetStyle(e.target)}
          });


          var p = feature.properties;
          var d = feature.data;
          thislayer.bindPopup(L.responsivePopup().setContent(
            MAP.tooltip(d,p,pctfmt,numfmt)
          ),{pane: 'popup2'});
        }
      });

    layer.addTo(map);
    var bm_key = (x) => PARAMS.bundesland?x.properties.GKZ.slice(0,3):x.properties.GKZ[0];
    var bm = topojson.mesh(topo,
      topo.objects[Object.keys(topo.objects)[0]],
        (a,b) => bm_key(a)!==bm_key(b)
    );
    var blayer = L.geoJson(
      [bm],
      {style: {fillColor: 'transparent',
        fillOpacity: 0, color: 'white', weight: 2, opacity: 1,
      attribution: 'Grenzen: cc-by Geoland.at, Wien.gv.at'}}
    );
    blayer.addTo(map);

    var searchCtrl = L.control.fuseSearch({maxResultLength: 6, placeholder: 'Gemeindesuche', title: 'Gemeindesuche'});
    searchCtrl.indexFeatures(tf,['name']);
    searchCtrl.addTo(map);
    document.getElementById('controls').appendChild(searchCtrl._container);
    searchCtrl._container.children[0].innerHTML='Gemeindesuche';

    var popup_highlight = null;
    var popup_line = null;

    map.on('popupopen', function(e) {
      if(popup_highlight) {
        map.removeLayer(popup_highlight);
        popup_highlight=null;
      }
      if(popup_line) {
        map.removeLayer(popup_line);
        popup_line=null;
      }
      if(map._container.clientWidth<500) {
        document.getElementById('info').innerHTML = e.popup._content;
        document.getElementById('info').style.maxHeight = 999+'px';
        map.closePopup();
        var t = map.containerPointToLatLng([map._size.x/2, 0]);
        popup_line = L.polyline([[e.popup._latlng.lat,e.popup._latlng.lng],
          t], {color: '#f1f1f1',weight: 2, opacity: 0.7}).addTo(map);
        document.querySelector('a.button').scrollIntoView();
        pymChild.scrollParentToChildPos(
          document.getElementById('info').getBoundingClientRect().top + window.pageYOffset - 125
        );
      } else {
        document.getElementById('info').innerHTML = '';
        document.getElementById('info').style.maxHeight = "0";
      }
      popup_highlight = L.geoJson(
        e.popup._source.feature.layer.toGeoJSON(),
        {style: {weight: 1.75, color: 'white', fillColor: 'transparent'}}).addTo(map);
    });
    map.on('popupclose', function(e) {
      if(map._container.clientWidth<500){
        return;
      }
      if(popup_highlight) {
        map.removeLayer(popup_highlight);
      }
      if(popup_line) {
        map.removeLayer(popup_line);
      }
    });
    map.on('move', (e) => {
      if(popup_line) {
        map.removeLayer(popup_line);
        popup_line=null;
      }
    });


    //map.zoomControl.setPosition('bottomright');

    colorlegend.addTo(map);

    var b = layer.getBounds()
    map.fitBounds(b, {
      paddingTopLeft: [0,60],
      paddingBottomRight: [0,25],
      animate: false
    });
    map.setMaxBounds(map.getBounds().pad(5));
    map.options.minZoom = map.getZoom()-0.5;
    map.fire('zoomend');

    pymChild.sendHeight();

    window.addEventListener('resize', function() {
      pymChild.sendHeight();
    })
});

