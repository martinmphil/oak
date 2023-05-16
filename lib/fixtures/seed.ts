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
    workflowTitle: {
      S: "Sustainable Energy",
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
      S: "workflowData",
    },
    workflowTitle: {
      S: "Basic Science",
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
  // worksheet001
  {
    pk: {
      S: "worksheet001",
    },
    sk: {
      S: "worksheet001",
    },
    entityType: {
      S: "multichoice",
    },
    worksheetObj: {
      M: {
        scenario: {
          S: "<div><p>Please answer every question.</p></div>",
        },
        choicesArr: {
          L: [
            {
              S: "Continue",
            },
          ],
        },
        rubricArr: {
          L: [
            {
              M: {
                answer: {
                  S: "intro",
                },
                mark: {
                  N: "0",
                },
              },
            },
          ],
        },
      },
    },
  },
  // worksheet099
  {
    pk: {
      S: "worksheet099",
    },
    sk: {
      S: "worksheet099",
    },
    entityType: {
      S: "multichoice",
    },
    worksheetObj: {
      M: {
        scenario: {
          S: "<div><p>Thank you for your participation.</p></div>",
        },
        choicesArr: {
          L: [
            {
              S: "OK",
            },
          ],
        },
        rubricArr: {
          L: [
            {
              M: {
                answer: {
                  S: "outro",
                },
                mark: {
                  N: "0",
                },
              },
            },
          ],
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
      S: "multichoice",
    },
    worksheetObj: {
      M: {
        scenario: {
          S: "<div><p>If you raise up a 100g apple through 1m from a low table to your mouth, how many people would need to raise up similar apples in 1s to expend power at a rate of 1 kilowatt? Where: Force due to gravity, F = 10 newtons per kilogram; x = distance in metres; Work done in joules, W = F.x; Power in watts, P= dW/dt</p></div>",
        },
        choicesArr: {
          L: [
            {
              S: "One",
            },
            {
              S: "Ten",
            },
            {
              S: "One hundred",
            },
            {
              S: "One thousand",
            },
          ],
        },
        rubricArr: {
          L: [
            {
              M: {
                answer: {
                  S: "a4",
                },
                mark: {
                  N: "1",
                },
              },
            },
          ],
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
      S: "multichoice",
    },
    worksheetObj: {
      M: {
        scenario: {
          S: "<div><p>For domestic ventilation systems, which of the following statements is NOT true?</p></div>",
        },
        choicesArr: {
          L: [
            {
              S: "Ventilation systems minimise energy consumption.",
            },
            {
              S: "Ventilation systems remove water vapour.",
            },
            {
              S: "Ventilation systems dilute pollutants.",
            },
            {
              S: "Ventilation systems minimise mould growth.",
            },
          ],
        },
        rubricArr: {
          L: [
            {
              M: {
                answer: {
                  S: "a1",
                },
                mark: {
                  N: "1",
                },
              },
            },
          ],
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
      S: "multichoice",
    },
    worksheetObj: {
      M: {
        scenario: {
          S: "<div><p>What ventilation effectiveness number indicates that supply air mixes fully with room air before occupants breathe it in?</p></div>",
        },
        choicesArr: {
          L: [
            {
              S: "Zero",
            },
            {
              S: "One",
            },
            {
              S: "Ten",
            },
            {
              S: "Infinity",
            },
          ],
        },
        rubricArr: {
          L: [
            {
              M: {
                answer: {
                  S: "a2",
                },
                mark: {
                  N: "1",
                },
              },
            },
          ],
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
      S: "multichoice",
    },
    worksheetObj: {
      M: {
        scenario: {
          S: "<div><p>What is the maximum average A-weighted sound pressure level in noise sensitive rooms, such as bedrooms and living rooms, allowed for ventilation systems?</p></div>",
        },
        choicesArr: {
          L: [
            {
              S: "25 dB L(Aeq,1 min)",
            },
            {
              S: "30 dB L(Aeq,1 min)",
            },
            {
              S: "35 dB L(Aeq,1 min)",
            },
            {
              S: "40 dB L(Aeq,1 min)",
            },
          ],
        },
        rubricArr: {
          L: [
            {
              M: {
                answer: {
                  S: "a2",
                },
                mark: {
                  N: "1",
                },
              },
            },
          ],
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
      S: "multichoice",
    },
    worksheetObj: {
      M: {
        scenario: {
          S: "<div><p>According to UK government 2010 building regulations for whole dwelling ventilation rates, what is the recommended minimum ventilation rate per square metre of internal floor area?</p></div>",
        },
        choicesArr: {
          L: [
            {
              S: "0.1 l/s per m²",
            },
            {
              S: "0.2 l/s per m²",
            },
            {
              S: "0.3 l/s per m²",
            },
            {
              S: "0.4 l/s per m²",
            },
          ],
        },
        rubricArr: {
          L: [
            {
              M: {
                answer: {
                  S: "a3",
                },
                mark: {
                  N: "1",
                },
              },
            },
          ],
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
      S: "multichoice",
    },
    worksheetObj: {
      M: {
        scenario: {
          S: "<div><p>Which is the lightest element?</p></div>",
        },
        choicesArr: {
          L: [
            {
              S: "Oxygen",
            },
            {
              S: "Nitrogen",
            },
            {
              S: "Hydrogen",
            },
            {
              S: "Helium",
            },
          ],
        },
        rubricArr: {
          L: [
            {
              M: {
                answer: {
                  S: "a3",
                },
                mark: {
                  N: "1",
                },
              },
            },
          ],
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
      S: "multichoice",
    },
    worksheetObj: {
      M: {
        scenario: {
          S: "<div><p>Which planet orbits furthest from the sun?</p></div>",
        },
        choicesArr: {
          L: [
            {
              S: "Uranus",
            },
            {
              S: "Neptune",
            },
            {
              S: "Saturn",
            },
            {
              S: "Jupiter",
            },
          ],
        },
        rubricArr: {
          L: [
            {
              M: {
                answer: {
                  S: "a2",
                },
                mark: {
                  N: "1",
                },
              },
            },
          ],
        },
      },
    },
  },
];
