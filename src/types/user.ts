export interface User {
  id: string;
  email: string;
  name?: string;
  color_scheme: 'light' | 'dark';
  created_at?: string;
  updated_at?: string;
}

export interface UserContextType {
  user: User | null;
  updateUser: (userData: User) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}
