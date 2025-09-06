import { supabase } from './supabase';

export interface Sentence {
  id: string;
  user_id: string;
  content: string;
  job: string;
  requirement?: string;
  created_at: string;
}

export async function getUserSentences(userId: string): Promise<Sentence[]> {
  const { data, error } = await supabase
    .from('sentences')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching sentences:', error);
    throw error;
  }

  return data || [];
}

export async function saveSentence(
  userId: string,
  content: string,
  job: string,
  requirement?: string
): Promise<Sentence> {
  const { data, error } = await supabase
    .from('sentences')
    .insert({
      user_id: userId,
      content,
      job,
      requirement
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving sentence:', error);
    throw error;
  }

  return data;
}

export async function deleteSentence(id: string, userId: string): Promise<void> {
  const { error } = await supabase
    .from('sentences')
    .delete()
    .eq('id', id)
    .eq('user_id', userId);

  if (error) {
    console.error('Error deleting sentence:', error);
    throw error;
  }
}

export async function getLatestSentence(userId: string): Promise<Sentence | null> {
  const { data, error } = await supabase
    .from('sentences')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .single();

  if (error) {
    if (error.code === 'PGRST116') {
      return null;
    }
    console.error('Error fetching latest sentence:', error);
    throw error;
  }

  return data;
}