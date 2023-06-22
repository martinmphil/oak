export function formatAchieved(assessmentData?: any) {
  const date = assessmentData?.updatedAt
    ? new Date(assessmentData?.updatedAt).toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : new Date().toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

  const person = assessmentData?.candidateEmailAdrr
    ? assessmentData?.candidateEmailAdrr
    : "you";

  const achivement = assessmentData?.grade
    ? assessmentData?.grade
    : "completion";

  const subject = assessmentData?.workflowTitle
    ? assessmentData?.workflowTitle
    : "this subject";

  return `<div style="text-align: center;">
<hr>
<p>On ${date}, </p>
<p>${person} </p>
<p>achieved ${achivement} </p>
<p>in ${subject}. </p>
<hr>
<p><button onclick="location.reload(true)">Next</button></p>
</div>`;
}
