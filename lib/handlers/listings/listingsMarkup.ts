import { getWorkflowProgress } from "./getWorkflowProgress";
import { getWorkflowTitle } from "./getWorkflowTitle";

interface IListingsObj {
  workflowId: string;
  title: string;
  progress: number;
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
      let title = workflowId;
      const workflowTitle = await getWorkflowTitle(workflowId);
      if (workflowTitle) {
        title = workflowTitle;
      }
      let progress = 0;
      const workflowProgress = await getWorkflowProgress(
        candidateId,
        workflowId
      );
      if (typeof workflowProgress === "number") {
        progress = workflowProgress;
      }
      return { workflowId, title, progress };
    })
  ).catch((err) => {
    throw new Error(
      `Listings-markup function failed to create listings array:- ${err} `
    );
  });

  function buttonMarkup(workflowId: string, title: string) {
    return `<button type="button" data-workflow-id="${workflowId}">${title}</button>`;
  }

  function ongoing(arr: IListingsObj[]) {
    const articleArr = arr.filter((x) => x?.progress > 0);
    if (articleArr.length === 0) {
      return "";
    }
    const buttonsArr = articleArr.map((el) => {
      return buttonMarkup(el?.workflowId, el?.title);
    });
    return `<article class="ongoing"><h1>Onging</h1>${buttonsArr.join(
      " "
    )}</article><hr />
    `;
  }

  function upcoming(arr: IListingsObj[]) {
    const articleArr = arr.filter((x) => x?.progress === 0);
    if (articleArr.length === 0) {
      return "";
    }
    const buttonsArr = articleArr.map((el) => {
      return buttonMarkup(el?.workflowId, el?.title);
    });
    return `<article class="upcoming"><h1>Upcoming</h1>${buttonsArr.join(
      " "
    )}</article><hr />
    `;
  }

  function achieved(arr: IListingsObj[]) {
    const articleArr = arr.filter((x) => x?.progress < 0);
    if (articleArr.length === 0) {
      return "";
    }
    const buttonsArr = articleArr.map((el) => {
      return buttonMarkup(el?.workflowId, el?.title);
    });
    return `<article class="achieved"><h1>Achieved</h1>${buttonsArr.join(
      " "
    )}</article><hr />
    `;
  }

  return ongoing(listingsArr) + upcoming(listingsArr) + achieved(listingsArr);
}
