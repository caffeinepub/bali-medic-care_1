import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import type { ClinicMember } from '@/backend';

export function useGetClinicMembers(clinicId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<ClinicMember[]>({
    queryKey: ['clinicMembers', clinicId],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getClinicMembers(clinicId);
    },
    enabled: !!actor && !isFetching,
  });
}

export function useUpdateClinicMembers() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ clinicId, members }: { clinicId: string; members: ClinicMember[] }) => {
      if (!actor) throw new Error('Actor not available');
      return actor.updateClinicMembers(clinicId, members);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['clinicMembers', variables.clinicId] });
    },
  });
}
