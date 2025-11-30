/*
  # Création du schéma utilisateurs et profils

  ## Nouvelles Tables
  
  ### `profiles`
  Table des profils utilisateurs étendue liée à auth.users
  - `id` (uuid, primary key) - Lié à auth.users.id
  - `first_name` (text) - Prénom de l'utilisateur
  - `last_name` (text) - Nom de l'utilisateur
  - `stream` (text) - Filière: 'S', 'D', ou 'L'
  - `level` (text) - Niveau d'études (par défaut: 'Terminale')
  - `avatar_url` (text, nullable) - URL de l'avatar
  - `bio` (text, nullable) - Biographie courte
  - `created_at` (timestamptz) - Date de création
  - `updated_at` (timestamptz) - Dernière mise à jour

  ## Sécurité
  
  1. RLS activé sur `profiles`
  2. Politiques:
     - Les utilisateurs peuvent lire leur propre profil
     - Les utilisateurs peuvent mettre à jour leur propre profil
     - Les utilisateurs peuvent insérer leur propre profil lors de l'inscription
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  first_name text NOT NULL,
  last_name text NOT NULL,
  stream text NOT NULL CHECK (stream IN ('S', 'D', 'L', 'M')),
  level text NOT NULL DEFAULT 'Terminale',
  avatar_url text,
  bio text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies for profiles
CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- Function to automatically update updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update updated_at on profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to create profile on user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, stream, level)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'first_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'last_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'stream', 'S'),
    COALESCE(NEW.raw_user_meta_data->>'level', 'Terminale')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile when user signs up
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
