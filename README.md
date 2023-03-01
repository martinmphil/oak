# Oak

Assessing candidates online

## Amazon Web Services (AWS) Cloud Development Kit (CDK) TypeScript project

The `cdk.json` file tells the CDK Toolkit how to execute this app.

## Useful commands

- `npm run test` perform jest unit tests
- `cdk deploy` deploy this stack to default AWS account/region
- `cdk diff` compare deployed stack with current state
- `cdk synth` emits synthesised CloudFormation template

## Naming conventions

- `specialism` eg discipline or subject
- `catalog` eg list of specialisms
- `worksheet` eg exam question or instruction
- `workflow` eg list of worksheets
- `achieved` eg completed workflow with marks and grade

## Candidate APIs

### /candidate-email

Returns `candidate email address`

### /catalog

Returns `specialisms` (upcoming, ongoing and achieved)

### /workbook/{workflowId}

Returns either `achieved` or next `worksheet`
