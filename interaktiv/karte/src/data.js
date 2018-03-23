var maps = {};

maps['raucherbegehren'] = {
  title: 'Wo die Zustimmung zum Nichtraucherschutz-Volksbegehren am höchsten ist',
  bundesland_title: 'XXXX',
  bundesland_message: 'YYY <a href="http://add.at/014_01" target="_blank">Addendum.org</a>.',
  csv: 'analysis_gem.csv',
  source: 'Ärztekammer Wien',
  value: 'Anteil',
  scale: 'quantile',
  colorschemes: [['#000'],
            ['#c6dbef','#9ecae1','#6baed6','#3182bd','#08519c']
  ],

  tooltip: function(d, p, pctfmt, numfmt) {
    if(d) {
      return `<strong>${p.name}</strong>: <br/>`
        +`Unterstützer: ${numfmt(d['Unterstützer'])}<br />`
        +`Wahlberechtigte: ${numfmt(d['Wahlberechtigte'])}<br />`
        +`Anteil: ${pctfmt(d['Anteil'])} %`
    } else {
      return `<strong>${p.name}, ${p.GKZ}</strong>: Keine Daten vorhanden`;
    }
  }
};

Object.keys(maps).map((x) => {maps[x].map=x});

export { maps };
