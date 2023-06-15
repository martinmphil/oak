import { getWorkflowProgress } from "./getWorkflowProgress";
import { getWorkflowTitle } from "../getWorkflowTitle";

type TProgress = "achieved" | "ongoing" | "upcoming";

interface IListingsObj {
  workflowId: string;
  title: string;
  progress: TProgress;
}

export async function listingsMarkup(candidateId: string, catalog: string[]) {
  if (
    candidateId === undefined ||
    candidateId === null ||
    typeof candidateId != "string" ||
    candidateId.length < 1
  ) {
    return "";
  }

  const listingsArr = await Promise.all(
    catalog.map(async (workflowId) => {
      const title = await getWorkflowTitle(workflowId);
      const progress: TProgress = await getWorkflowProgress(
        candidateId,
        workflowId
      );
      return { workflowId, title, progress };
    })
  ).catch((err) => {
    throw new Error(
      ` ListingsMarkup(${candidateId}, ${catalog}) failed to create listings array:- ${err} `
    );
  });

  function buttonMarkup(workflowId: string, title: string) {
    return `<p><button type="button" data-workflow-id="${workflowId}">${title}</button></p>`;
  }

  function ongoing(arr: IListingsObj[]) {
    const articleArr = arr.filter((x) => x?.progress === "ongoing");
    if (articleArr.length === 0) {
      return "";
    }
    const buttonsArr = articleArr.map((el) => {
      return buttonMarkup(el?.workflowId, el?.title);
    });
    return `<article class="ongoing"><h2>Onging</h2>${buttonsArr.join(
      " "
    )}</article><hr />
    `;
  }

  function upcoming(arr: IListingsObj[]) {
    const articleArr = arr.filter((x) => x?.progress === "upcoming");
    if (articleArr.length === 0) {
      return "";
    }
    const buttonsArr = articleArr.map((el) => {
      return buttonMarkup(el?.workflowId, el?.title);
    });
    return `<article class="upcoming"><h2>Upcoming</h2>${buttonsArr.join(
      " "
    )}</article><hr />
    `;
  }

  function achieved(arr: IListingsObj[]) {
    const articleArr = arr.filter((x) => x?.progress === "achieved");
    if (articleArr.length === 0) {
      return "";
    }
    const buttonsArr = articleArr.map((el) => {
      return buttonMarkup(el?.workflowId, el?.title);
    });
    return `<article class="achieved"><h2>Achieved</h2>${buttonsArr.join(
      " "
    )}</article><hr />
    `;
  }

  return ongoing(listingsArr) + upcoming(listingsArr) + achieved(listingsArr);
}
