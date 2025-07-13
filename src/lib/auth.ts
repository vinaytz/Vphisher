
import { supabase } from './supabase';
import { User } from '@supabase/supabase-js';

export const signup = async (email: string, password: string, name: string): Promise<User> => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        full_name: name,
      },
    },
  });

  if (error) {
    console.error('Signup API Error:', error);
    throw new Error(error.message || 'Failed to sign up');
  }

  if (!data.user) {
    throw new Error('User not created');
  }

  return data.user;
};

export const login = async (email: string, password: string): Promise<User> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Login API Error:', error);
    throw new Error(error.message || 'Failed to log in');
  }

  if (!data.user) {
    throw new Error('User not found');
  }

  return data.user;
};

export const logout = async (): Promise<void> => {
  const { error } = await supabase.auth.signOut();
  if (error) {
    console.error('Logout API Error:', error);
    throw new Error(error.message || 'Failed to log out');
  }
};

export const getCurrentUser = async (): Promise<User | null> => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};
