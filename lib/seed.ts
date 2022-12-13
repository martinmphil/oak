// see
// https://dynobase.dev/dynamodb-json-converter-tool/

export const seedArr = [
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
              S: "qText1",
            },
            {
              S: "qText101",
            },
            {
              S: "qText102",
            },
            {
              S: "qText99",
            },
          ],
        },
      },
    },
  },
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
              S: "qText1",
            },
            {
              S: "qText201",
            },
            {
              S: "qText202",
            },
            {
              S: "qText99",
            },
          ],
        },
      },
    },
  },
];

// export const seedArr = [
//   {
//     pk: { S: "exam1" },
//     sk: { S: "exam1" },
//   },
//   {
//     pk: { S: "exam2" },
//     sk: { S: "exam1" },
//   },
// ];
