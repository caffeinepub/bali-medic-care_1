import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { PatientSubmission } from '@/backend';

export function useGetAllPatientSubmissions() {
  const { actor, isFetching } = useActor();

  return useQuery<PatientSubmission[]>({
    queryKey: ['patientSubmissions'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllPatientSubmissions();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSubmitPatientForm() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submission: PatientSubmission) => {
      if (!actor) throw new Error('Actor not available');
      return actor.submitPatientForm(submission);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientSubmissions'] });
    },
  });
}

export function useUpdatePatientSubmission() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (submission: PatientSubmission) => {
      if (!actor) throw new Error('Actor not available');
      // Note: Backend doesn't have an update method, so we're using the context field
      // to store all the data. In a real app, you'd add an updatePatientSubmission method.
      return actor.submitPatientForm(submission);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['patientSubmissions'] });
    },
  });
}
