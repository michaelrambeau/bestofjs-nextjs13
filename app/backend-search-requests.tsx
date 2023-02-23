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
    limit: 5,
  };
}
