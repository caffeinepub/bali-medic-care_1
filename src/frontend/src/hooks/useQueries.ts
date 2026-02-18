import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';

// This file is intentionally minimal as all queries are now in feature-specific hooks
// (useSubmissions.ts, useUserProfile.ts, useClinicTeam.ts)

export function useActorQuery() {
  const { actor, isFetching } = useActor();
  return { actor, isFetching };
}
