
import { ProjectTask, ProjectTaskAttachment } from "@/types/project";

export const getStatusBadgeColor = (status: string) => {
  switch (status) {
    case "completed": return "bg-green-100 text-green-800 hover:bg-green-200";
    case "in_progress": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "pending": return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case "blocked": return "bg-red-100 text-red-800 hover:bg-red-200";
    default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export const getPriorityBadgeColor = (priority: string) => {
  switch (priority) {
    case "urgent": return "bg-red-100 text-red-800 hover:bg-red-200";
    case "high": return "bg-orange-100 text-orange-800 hover:bg-orange-200";
    case "medium": return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "low": return "bg-green-100 text-green-800 hover:bg-green-200";
    default: return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

export const formatStatus = (status: string) => {
  switch (status) {
    case "in_progress": return "In Progress";
    default: return status.charAt(0).toUpperCase() + status.slice(1);
  }
};

export const createNewDocument = (): ProjectTaskAttachment => {
  return {
    id: `doc-${Date.now()}`,
    name: "New Document.pdf",
    type: "pdf",
    url: "#",
    uploadedAt: new Date().toISOString().split('T')[0],
    uploadedBy: "Current User"
  };
};
