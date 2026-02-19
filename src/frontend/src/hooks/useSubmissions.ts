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
      console.log('🔄 useSubmitPatientForm mutation starting...');
      console.log('📊 Actor state:', { 
        actorExists: !!actor, 
        actorFetching,
        timestamp: new Date().toISOString()
      });

      if (!actor) {
        const error = new Error('Actor not available - backend connection not initialized');
        console.error('❌ Actor check failed:', error.message);
        throw error;
      }
      
      if (actorFetching) {
        const error = new Error('Actor is still initializing - please wait');
        console.error('❌ Actor fetching check failed:', error.message);
        throw error;
      }

      console.log('📤 Calling actor.submitPatientForm...');
      console.log('📋 Submission data structure:', {
        id: submission.id.toString(),
        clinicId: submission.clinicId,
        hasPersonalInfo: !!submission.personalInfo,
        personalInfoFields: submission.personalInfo ? Object.keys(submission.personalInfo) : [],
        fullName: submission.personalInfo?.fullName,
        country: submission.personalInfo?.country,
        roomNumber: submission.personalInfo?.roomNumber,
        whatsappNumber: submission.personalInfo?.whatsappNumber,
      });

      try {
        const submissionId = await actor.submitPatientForm(submission);
        console.log('✅ Backend returned submission ID:', submissionId.toString());
        return submissionId;
      } catch (backendError: any) {
        console.error('❌ Backend call failed:', backendError);
        console.error('🔍 Backend error details:', {
          message: backendError?.message,
          name: backendError?.name,
          stack: backendError?.stack,
          errorType: typeof backendError,
          errorKeys: backendError ? Object.keys(backendError) : [],
        });
        
        // Try to extract more meaningful error information
        if (backendError?.message?.includes('trap')) {
          console.error('🚨 Backend trap detected - this usually indicates a runtime error in the canister');
        }
        
        throw backendError;
      }
    },
    onSuccess: (submissionId) => {
      console.log('✅ Patient form submitted successfully with ID:', submissionId.toString());
      queryClient.invalidateQueries({ queryKey: ['patientSubmissions'] });
    },
    onError: (error: Error) => {
      console.error('❌ useSubmitPatientForm mutation error:', {
        message: error.message,
        name: error.name,
        stack: error.stack,
        actorAvailable: !!actor,
        actorFetching,
        timestamp: new Date().toISOString(),
      });
      
      // Log the full error object with all properties
      console.error('📊 Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error), 2));
      
      // Categorize the error
      if (error.message.includes('Actor not available')) {
        console.error('🏷️ Error category: ACTOR_INITIALIZATION');
      } else if (error.message.includes('Actor is still initializing')) {
        console.error('🏷️ Error category: ACTOR_LOADING');
      } else if (error.message.includes('network') || error.message.includes('fetch')) {
        console.error('🏷️ Error category: NETWORK_ERROR');
      } else if (error.message.includes('trap')) {
        console.error('🏷️ Error category: BACKEND_TRAP');
      } else if (error.message.includes('Unauthorized') || error.message.includes('permission')) {
        console.error('🏷️ Error category: AUTHORIZATION_ERROR');
      } else {
        console.error('🏷️ Error category: UNKNOWN_ERROR');
      }
    },
  });
}

export function useUpdatePatientSubmission() {
  const { actor, isFetching: actorFetching } = useActor();
  const queryClient = useQueryClient();

  return useMutation<void, Error, PatientSubmission>({
    mutationFn: async (submission: PatientSubmission) => {
      console.log('🔄 useUpdatePatientSubmission mutation starting...');
      
      if (!actor) {
        const error = new Error('Actor not available - backend connection not initialized');
        console.error('❌ Actor check failed:', error.message);
        throw error;
      }
      
      if (actorFetching) {
        const error = new Error('Actor is still initializing - please wait');
        console.error('❌ Actor fetching check failed:', error.message);
        throw error;
      }

      console.log('📤 Calling actor.updatePatientSubmission for ID:', submission.id.toString());
      
      try {
        await actor.updatePatientSubmission(submission.id, submission);
        console.log('✅ Backend update successful');
      } catch (backendError: any) {
        console.error('❌ Backend update failed:', backendError);
        console.error('🔍 Backend error details:', {
          message: backendError?.message,
          name: backendError?.name,
          submissionId: submission.id.toString(),
        });
        throw backendError;
      }
    },
    onSuccess: (_, variables) => {
      console.log('✅ Patient submission updated successfully with ID:', variables.id.toString());
      queryClient.invalidateQueries({ queryKey: ['patientSubmissions'] });
    },
    onError: (error: Error, variables) => {
      console.error('❌ useUpdatePatientSubmission mutation error:', {
        message: error.message,
        name: error.name,
        submissionId: variables.id.toString(),
        actorAvailable: !!actor,
        actorFetching,
      });
    },
  });
}
