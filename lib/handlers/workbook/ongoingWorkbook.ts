export async function ongoingWorkbook(
  assessmentData: string | Record<string, any> | undefined,
  answer: string
) {
  return `
This will be the ongoing workbook markup from ongoingWorkbook 
assessmentData:- ${JSON.stringify(assessmentData)} 
and answer:- ${answer}
`;
}
