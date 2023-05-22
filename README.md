# Oak

Assessing candidates online

![sun_and_cloud_dev_kit](https://github.com/martinmphil/oak/assets/37618836/305f650f-0ba0-4206-ac07-b8cb5e4feebe)

## Amazon Web Services (AWS) Cloud Development Kit (CDK) TypeScript project

The `cdk.json` file tells the CDK Toolkit how to execute this app.

## Useful commands

- `npm run test` perform jest unit tests
- `cdk deploy` deploy this stack to default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits synthesised CloudFormation template
- `npx jest [file_name].test.ts` run one test file

## Naming conventions

- `specialism` discipline or subject
- `listings` list of specialisms
- `worksheet` eg multiple choice question or instruction
- `workflow` list of worksheets
- `achieved` completed workflow with grade

## Candidate APIs

In general endpoints return `{body:'string'}`

### /candidate-email

Returns `candidate email address`

### /listings

Returns `specialisms` (upcoming, ongoing and achieved)

### /workbook/{workflowId}

Returns either `achieved` or next `worksheet`

## User interface state diagram
![oak_ui_state_chart](https://github.com/martinmphil/oak/assets/37618836/8bbd85fa-2f84-48ea-adcb-35b15eb9b75d)

