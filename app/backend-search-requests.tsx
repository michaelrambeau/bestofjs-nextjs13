export function getHotProjectsRequest() {
  return {
    criteria: {
      tags: { $nin: ["meta", "learning"] },
    },
    sort: {
      "trends.daily": -1,
    },
    limit: 5,
  };
}

export function getLatestProjects() {
  return {
    criteria: {},
    sort: {}, // TODO sort by `addedAt` when it's available in data instead of relying on the default sort
    limit: 5,
  };
}
