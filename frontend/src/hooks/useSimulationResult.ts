import { useState, useEffect } from 'react';
import { EligibilityResult, ImpactResult } from '../lib/types';
import { getEligibility, getImpact } from '../lib/api';
import { useSimulationStore } from '../store/simulationStore';
import { useRouter } from 'next/navigation';

export function useSimulationResult() {
  const { input } = useSimulationStore();
  const router = useRouter();

  const [eligibility, setEligibility] = useState<EligibilityResult | null>(null);
  const [impact, setImpact] = useState<ImpactResult | null>(null);
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');

  useEffect(() => {
    if (!input) {
      router.push('/simulator');
      return;
    }

    Promise.all([getEligibility(input), getImpact(input)])
      .then(([e, i]) => {
        setEligibility(e);
        setImpact(i);
        setStatus('success');
      })
      .catch((err) => {
        console.error('Error fetching simulation result:', err);
        setStatus('error');
      });
  }, [input, router]);

  return { eligibility, impact, status };
}
