import { create } from "zustand";

interface RenderJob {
  id: string;
  status: "pending" | "processing" | "completed" | "failed";
  resolution: string;
  engine: string;
  format: string;
  createdAt: string;
  completedAt?: string;
}

interface RenderStore {
  jobs: RenderJob[];
  addToQueue: (job: Omit<RenderJob, "id" | "createdAt">) => string;
  updateStatus: (jobId: string, status: RenderJob["status"]) => void;
  getJob: (jobId: string) => RenderJob | undefined;
}

export const useRenderStore = create<RenderStore>((set, get) => ({
  jobs: [],
  addToQueue: (job) => {
    const jobId = `render_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const newJob: RenderJob = {
      ...job,
      id: jobId,
      createdAt: new Date().toISOString(),
    };
    set((state) => ({ jobs: [...state.jobs, newJob] }));
    return jobId;
  },
  updateStatus: (jobId, status) => {
    set((state) => ({
      jobs: state.jobs.map((job) =>
        job.id === jobId
          ? {
              ...job,
              status,
              completedAt: status === "completed" ? new Date().toISOString() : job.completedAt,
            }
          : job
      ),
    }));
  },
  getJob: (jobId) => {
    return get().jobs.find((job) => job.id === jobId);
  },
}));

export type { RenderJob, RenderStore };
