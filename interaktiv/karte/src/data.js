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
            ['#D0CEDB','#B1ADC3','#938DAB','#746C93','#564C7C']
  ],
  detail: 'Stand: 8. Oktober 2018 (Vorläufiges Endergebnis)',

  tooltip: function(d, p, pctfmt, numfmt) {
    if(d) {
      return `<strong>${d.Name}</strong>: <br/>`
        +`Unterschriften: ${numfmt(d['Unterschriften'])}<br />`
        +`Wahlberechtigte: ${numfmt(d['Wahlberechtigte'])}<br />`
        +`Anteil: <strong>${pctfmt(d['Anteil'])} %</strong><br />`
        +`Steigerung in der Eintragungswoche: ${pctfmt(d['pct_diff'])}&nbsp;Prozentpunkte`

    } else {
      return `<strong>${p.name}, ${p.GKZ}</strong>: Keine Daten vorhanden`;
    }
  }
};


maps['orfbegehren'] = {
  title: 'Wo die Zustimmung zum Volksbegehren „ORF ohne Zwangsgebühren" am höchsten ist',
  bundesland_title: 'XXXX',
  bundesland_message: 'YYY <a href="http://add.at/014_01" target="_blank">Addendum.org</a>.',
  csv: 'analysis_gem_orf.csv',
  source: 'CPÖ',
  value: 'Anteil',
  scale: 'quantile',
  colorschemes: [['#000'],
            ['#dacbe5','#b599cb','#9069b1','#693a97','#3f007d']
            //['#dacbe5','#3f007d']
  ],
  detail: 'Stand: 8. Oktober 2018 (Vorläufiges Endergebnis)',

  tooltip: function(d, p, pctfmt, numfmt) {
    if(d) {
      return `<strong>${d.Name}</strong>: <br/>`
        +`Unterschriften: ${numfmt(d['Unterschriften'])}<br />`
        +`Wahlberechtigte: ${numfmt(d['Wahlberechtigte'])}<br />`
        +`Anteil: <strong>${pctfmt(d['Anteil'])} %</strong><br />`
        +`Steigerung in der Eintragungswoche: ${pctfmt(d['pct_diff'])}&nbsp;Prozentpunkte`

    } else {
      return `<strong>${p.name}, ${p.GKZ}</strong>: Keine Daten vorhanden`;
    }
  }
};


maps['klimavolksbegehren'] = {
  title: 'Wo die Zustimmung zum Klimavolksbegehren am höchsten ist',
  csv: 'analysis_klimavolksbegehren.csv',
  source: '-',
  value: 'Anteil',
  scale: 'quantile',
  colorschemes: [['#000'],
            ['#dacbe5','#b599cb','#9069b1','#693a97','#3f007d']
            //['#dacbe5','#3f007d']
  ],
  detail: 'Stand: 30. Juni 2020',

  tooltip: function(d, p, pctfmt, numfmt) {
    if(d) {
      return `<strong>${d.Name}</strong>: <br/>`
        +`Unterschriften: ${numfmt(d['Unterschriften'])}<br />`
        +`Wahlberechtigte: ${numfmt(d['Wahlberechtigte'])}<br />`
        +`Anteil: <strong>${pctfmt(d['Anteil'])} %</strong><br />`
        +`Steigerung in der Eintragungswoche: ${pctfmt(d['pct_diff'])}&nbsp;Prozentpunkte`

    } else {
      return `<strong>${p.name}, ${p.GKZ}</strong>: Keine Daten vorhanden`;
    }
  }
};


Object.keys(maps).map((x) => {maps[x].map=x});

export { maps };
