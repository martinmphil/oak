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
    catalog: {
      L: [
        {
          S: "workflow101",
        },
        {
          S: "workflow102",
        },
      ],
    },
  },
  // workflow101
  {
    pk: {
      S: "workflow101",
    },
    sk: {
      S: "workflow101",
    },
    entityType: {
      S: "workflowData",
    },
    flowTitle: {
      S: "Sustainable energy",
    },
    workflow: {
      L: [
        {
          S: "worksheet001",
        },
        {
          S: "worksheet002",
        },
        {
          S: "worksheet003",
        },
        {
          S: "worksheet004",
        },
        {
          S: "worksheet005",
        },
        {
          S: "worksheet006",
        },
        {
          S: "worksheet099",
        },
      ],
    },
  },
  // workflow102
  {
    pk: {
      S: "workflow102",
    },
    sk: {
      S: "workflow102",
    },
    entityType: {
      S: "examData",
    },
    flowTitle: {
      S: "Basic science",
    },
    workflow: {
      L: [
        {
          S: "worksheet001",
        },
        {
          S: "worksheet010",
        },
        {
          S: "worksheet011",
        },
        {
          S: "worksheet099",
        },
      ],
    },
  },
  // intro worksheet001
  {
    pk: {
      S: "worksheet001",
    },
    sk: {
      S: "worksheet001",
    },
    entityType: {
      S: "intro",
    },
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
  // outro worksheet099
  {
    pk: {
      S: "worksheet099",
    },
    sk: {
      S: "worksheet099",
    },
    entityType: {
      S: "outro",
    },
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
  // worksheet002
  {
    pk: {
      S: "worksheet002",
    },
    sk: {
      S: "worksheet002",
    },
    entityType: {
      S: "4Multichoice",
    },
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
  // worksheet003
  {
    pk: {
      S: "worksheet003",
    },
    sk: {
      S: "worksheet003",
    },
    entityType: {
      S: "4Multichoice",
    },
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
  // worksheet004
  {
    pk: {
      S: "worksheet004",
    },
    sk: {
      S: "worksheet004",
    },
    entityType: {
      S: "4Multichoice",
    },
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
  // worksheet005
  {
    pk: {
      S: "worksheet005",
    },
    sk: {
      S: "worksheet005",
    },
    entityType: {
      S: "4Multichoice",
    },
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
  // worksheet006
  {
    pk: {
      S: "worksheet006",
    },
    sk: {
      S: "worksheet006",
    },
    entityType: {
      S: "4Multichoice",
    },
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
  // worksheet010
  {
    pk: {
      S: "worksheet010",
    },
    sk: {
      S: "worksheet010",
    },
    entityType: {
      S: "4Multichoice",
    },
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
  // worksheet011
  {
    pk: {
      S: "worksheet011",
    },
    sk: {
      S: "worksheet011",
    },
    entityType: {
      S: "4Multichoice",
    },
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
];
