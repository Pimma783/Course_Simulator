import { Course, SimulationInput, EligibilityResult, ImpactResult } from './types';
import coursesData from './data/courses-data.json';
import { checkEligibility } from './algorithms/eligibility';
import { computeImpact } from './algorithms/impact';

// Fallback to localhost if env is missing, point to backend (5000)
const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export class ApiError extends Error {
  public response?: { data: any };
  constructor(public status: number, message: string) {
    let parsedMessage = message;
    let data = null;
    try {
      data = JSON.parse(message);
      if (data && data.message) {
        parsedMessage = Array.isArray(data.message) ? data.message[0] : data.message;
      }
    } catch (e) {
      // not json
    }
    super(parsedMessage);
    this.name = 'ApiError';
    this.response = { data };
  }
}

// Local mock data loaded from JSON
const allCourses: Course[] = coursesData as unknown as Course[];

export const login = async (username: string, password: string): Promise<{ access_token: string }> => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('token', 'local-mock-token');
    localStorage.setItem('studentId', username);
  }
  return { access_token: 'local-mock-token' };
};

export const register = async (username: string, password: string): Promise<{ access_token: string }> => {
  return login(username, password);
};

export async function getCourses(): Promise<Course[]> {
  return allCourses;
}

export async function getEligibility(input: SimulationInput): Promise<EligibilityResult> {
  return checkEligibility(allCourses, input);
}

export async function getImpact(input: SimulationInput): Promise<ImpactResult> {
  return computeImpact(allCourses, input);
}

export async function uploadTranscript(file: File): Promise<{ success: boolean; data: any[] }> {
  // Stub for local testing without backend
  console.log("Mock transcript upload for file:", file.name);
  return { success: true, data: [] };
}

export async function saveStudyPlan(studentId: string, academicYear: number, semester: number, courseCodes: string[]) {
  // Stub
  console.log("Mock save study plan for", studentId, courseCodes);
  return { success: true };
}

export async function saveSimulation(data: { failedCourses: string[]; expectedGraduationSemester: number; delaySemesters: number; isDismissed: boolean }) {
  if (typeof window !== 'undefined') {
    const history = JSON.parse(localStorage.getItem('simHistory') || '[]');
    const record = { id: Date.now().toString(), createdAt: new Date().toISOString(), ...data };
    history.push(record);
    localStorage.setItem('simHistory', JSON.stringify(history));
    return record;
  }
  return data;
}

export async function getSimulationHistory(): Promise<any[]> {
  if (typeof window !== 'undefined') {
    return JSON.parse(localStorage.getItem('simHistory') || '[]');
  }
  return [];
}

export async function deleteSimulation(id: string) {
  if (typeof window !== 'undefined') {
    let history = JSON.parse(localStorage.getItem('simHistory') || '[]');
    history = history.filter((r: any) => r.id !== id);
    localStorage.setItem('simHistory', JSON.stringify(history));
  }
  return { success: true };
}
