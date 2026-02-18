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
    refetchOnMount: 'always',
    staleTime: 0,
  });
}

export function useSubmitPatientForm() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  return useMutation<bigint, Error, PatientSubmission>({
    mutationFn: async (submission: PatientSubmission) => {
      if (!actor) {
        throw new Error('Actor not available - backend connection not initialized');
      }
      if (actorFetching) {
        throw new Error('Actor is still initializing - please wait');
      }
      
      const submissionId = await actor.submitPatientForm(submission);
      return submissionId;
    },
    onSuccess: (submissionId) => {
      console.log('✅ Patient form submitted successfully with ID:', submissionId.toString());
      queryClient.invalidateQueries({ queryKey: ['patientSubmissions'] });
    },
    onError: (error) => {
      console.error('❌ useSubmitPatientForm mutation error:', {
        message: error.message,
        name: error.name,
        actorAvailable: !!actor,
        actorFetching,
      });
    },
  });
}

export function useUpdatePatientSubmission() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, PatientSubmission>({
    mutationFn: async (submission: PatientSubmission) => {
      if (!actor) {
        throw new Error('Actor not available - backend connection not initialized');
      }
      if (actorFetching) {
        throw new Error('Actor is still initializing - please wait');
      }
      
      await actor.updatePatientSubmission(submission.id, submission);
    },
    onSuccess: (_, variables) => {
      console.log('✅ Patient submission updated successfully with ID:', variables.id.toString());
      queryClient.invalidateQueries({ queryKey: ['patientSubmissions'] });
    },
    onError: (error) => {
      console.error('❌ useUpdatePatientSubmission mutation error:', {
        message: error.message,
        name: error.name,
        actorAvailable: !!actor,
        actorFetching,
      });
    },
  });
}
