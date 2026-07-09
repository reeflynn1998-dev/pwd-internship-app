import { supabase } from './supabaseClient';

// Public — anyone can submit an application (RLS: insert allowed for anon)
export async function submitApplication(record) {
  const { error } = await supabase.from('applications').insert([record]);
  if (error) throw error;
  return true;
}

// Admin-only — RLS restricts select to authenticated users
export async function fetchApplications() {
  const { data, error } = await supabase
    .from('applications')
    .select('*')
    .order('submitted_at', { ascending: false });
  if (error) throw error;
  return data || [];
}

// Admin-only — RLS restricts delete to authenticated users
export async function deleteAllApplications() {
  const { error } = await supabase
    .from('applications')
    .delete()
    .neq('id', '00000000-0000-0000-0000-000000000000');
  if (error) throw error;
}

// Admin-only — moves an applicant through the pipeline (new/accepted/active/graduate/hired/rejected)
export async function updateApplicationStatus(id, status) {
  const { error } = await supabase.from('applications').update({ status }).eq('id', id);
  if (error) throw error;
}
