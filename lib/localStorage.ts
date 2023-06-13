import { ResourceItemProps } from "@/components/ResourceItem";

const MAX_RECENT_ITEMS = 10;

export const getRecentResources = (): ResourceItemProps[] => {
  if (typeof window === "undefined") {
    console.log("failure");
    return [];
  }
  const recentString = localStorage.getItem("recentResources");
  return recentString ? JSON.parse(recentString) : [];
};

export const addRecentResource = (parentProps: ResourceItemProps): void => {
  let recentResources = getRecentResources();

  // Remove the resource if it already exists
  recentResources = recentResources.filter(
    (resource) => resource.resourceId !== parentProps.resourceId
  );

  // Add the resource to the front of the list
  recentResources.unshift(parentProps);

  // Remove the last item if the list is too long
  if (recentResources.length > MAX_RECENT_ITEMS) {
    recentResources.pop();
  }

  // Save the list
  localStorage.setItem("recentResources", JSON.stringify(recentResources));
};
