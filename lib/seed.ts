// see
// https://dynobase.dev/dynamodb-json-converter-tool/

export const seedArr = [
  // standard catalog
  {
    pk: {
      S: "standardCatalog",
    },
    sk: {
      S: "standardCatalog",
    },
    entityType: {
      S: "catalog",
    },
    obj: {
      M: {
        catalog: {
          L: [
            {
              S: "exam1",
            },
            {
              S: "exam2",
            },
          ],
        },
      },
    },
  },
  // exam1
  {
    pk: {
      S: "exam1",
    },
    sk: {
      S: "exam1",
    },
    entityType: {
      S: "examData",
    },
    obj: {
      M: {
        name: {
          S: "Sustainable energy",
        },
        qList: {
          L: [
            {
              S: "qText100",
            },
            {
              S: "qText101",
            },
            {
              S: "qText102",
            },
            {
              S: "qText103",
            },
            {
              S: "qText104",
            },
            {
              S: "qText105",
            },
            {
              S: "qText199",
            },
          ],
        },
      },
    },
  },
  //exam2
  {
    pk: {
      S: "exam2",
    },
    sk: {
      S: "exam2",
    },
    entityType: {
      S: "examData",
    },
    obj: {
      M: {
        name: {
          S: "Basic science",
        },
        qList: {
          L: [
            {
              S: "qText100",
            },
            {
              S: "qText201",
            },
            {
              S: "qText202",
            },
            {
              S: "qText199",
            },
          ],
        },
      },
    },
  },
  // intro
  {
    pk: {
      S: "qText100",
    },
    sk: {
      S: "qText100",
    },
    entityType: {
      S: "intro",
    },
    obj: {
      M: {
        markup: {
          S: "<div><p>Please answer every question.</p><button id='intro' class='choices'>Continue</button></div>",
        },
        rubric: {
          M: {
            intro: {
              N: "0",
            },
          },
        },
      },
    },
  },
  // outro
  {
    pk: {
      S: "qText199",
    },
    sk: {
      S: "qText199",
    },
    entityType: {
      S: "outro",
    },
    obj: {
      M: {
        markup: {
          S: "<div><p>Thank you for your participation.</p><button id='end_of_exam' class='choices'>OK</button></div>",
        },
        rubric: {
          M: {
            outro: {
              N: "0",
            },
          },
        },
      },
    },
  },
  // q101
  {
    pk: {
      S: "qText101",
    },
    sk: {
      S: "qText101",
    },
    entityType: {
      S: "4Multichoice",
    },
    obj: {
      M: {
        markup: {
          S: "<div><p>If you raise up a 100g apple through 1m from a low table to your mouth, how many people would need to raise up similar apples in 1s to expend power at a rate of 1 killowatt? Where: Force due to gravity, F = 10 newtons per kilogramme; x = distance in metres; Work done in joules, W = F.x; Power in watts, P= dW/dt</p><button id='a1' class='choices'>One</button><button id='a2' class='choices'>Ten</button><button id='a3' class='choices'>One hundred</button><button id='a4' class='choices'>One thousand</button></div>",
        },
        rubric: {
          M: {
            a4: {
              N: "1",
            },
          },
        },
      },
    },
  },
  // q102
  {
    pk: {
      S: "qText102",
    },
    sk: {
      S: "qText102",
    },
    entityType: {
      S: "4Multichoice",
    },
    obj: {
      M: {
        markup: {
          S: "<div><p>For domestic ventilation systems, which of the following statements is NOT true?</p><button id='a1' class='choices'>Ventilation systems minimise energy consumption.</button><button id='a2' class='choices'>Ventilation systems remove water vapour.</button><button id='a3' class='choices'>Ventilation systems dilute pollutants.</button><button id='a4' class='choices'>Ventilation systems minimise mould growth.</button></div>",
        },
        rubric: {
          M: {
            a1: {
              N: "1",
            },
          },
        },
      },
    },
  },
  // q103
  {
    pk: {
      S: "qText103",
    },
    sk: {
      S: "qText103",
    },
    entityType: {
      S: "4Multichoice",
    },
    obj: {
      M: {
        markup: {
          S: "<div><p>What ventilation effectiveness number indicates that supply air mixes fully with room air before occupants breathe it in?</p><button id='a1' class='choices'>Zero</button><button id='a2' class='choices'>One</button><button id='a3' class='choices'>Ten</button><button id='a4' class='choices'>Infinity</button></div>",
        },
        rubric: {
          M: {
            a2: {
              N: "1",
            },
          },
        },
      },
    },
  },
  // q104
  {
    pk: {
      S: "qText104",
    },
    sk: {
      S: "qText104",
    },
    entityType: {
      S: "4Multichoice",
    },
    obj: {
      M: {
        markup: {
          S: "<div><p>What is the maximum average A-weighted sound pressure level in noise sensitive rooms, such as bedrooms and living rooms, allowed for ventilation systems?</p><button id='a1' class='choices'>25 dB L(Aeq,1 min)</button><button id='a2' class='choices'>30 dB L(Aeq,1 min)</button><button id='a3' class='choices'>35 dB L(Aeq,1 min)</button><button id='a4' class='choices'>40 dB L(Aeq,1 min)</button></div>",
        },
        rubric: {
          M: {
            a2: {
              N: "1",
            },
          },
        },
      },
    },
  },
  // q105
  {
    pk: {
      S: "qText105",
    },
    sk: {
      S: "qText105",
    },
    entityType: {
      S: "4Multichoice",
    },
    obj: {
      M: {
        markup: {
          S: "<div><p>According to UK government 2010 building regulations for whole dwelling ventilation rates, what is the recommended minimum ventilation rate per square metre of internal floor area?</p><button id='a1' class='choices'>0.1 l/s per m²</button><button id='a2' class='choices'>0.2 l/s per m²</button><button id='a3' class='choices'>0.3 l/s per m²</button><button id='a4' class='choices'>0.4 l/s per m²</button></div>",
        },
        rubric: {
          M: {
            a3: {
              N: "1",
            },
          },
        },
      },
    },
  },
  // q201
  {
    pk: {
      S: "qText201",
    },
    sk: {
      S: "qText201",
    },
    entityType: {
      S: "4Multichoice",
    },
    obj: {
      M: {
        markup: {
          S: "<div><p>Which is the lightest element?</p><button id='a1' class='choices'>Oxygen</button><button id='a2' class='choices'>Nitrogen</button><button id='a3' class='choices'>Hydrogen</button><button id='a4' class='choices'>Helium</button></div>",
        },
        rubric: {
          M: {
            a3: {
              N: "1",
            },
          },
        },
      },
    },
  },
  // q202
  {
    pk: {
      S: "qText202",
    },
    sk: {
      S: "qText202",
    },
    entityType: {
      S: "4Multichoice",
    },
    obj: {
      M: {
        markup: {
          S: "<div><p>Which planet orbits furthest from the sun?</p><button id='a1' class='choices'>Uranus</button><button id='a2' class='choices'>Neptune</button><button id='a3' class='choices'>Saturn</button><button id='a4' class='choices'>Jupiter</button></div>",
        },
        rubric: {
          M: {
            a2: {
              N: "1",
            },
          },
        },
      },
    },
  },
];
