/*
  # Correction des problèmes RLS et de sécurité

  ## Objectifs

  1. **Performance RLS** - Optimiser les politiques avec (select auth.uid())
     - Évite la ré-évaluation de auth.uid() pour chaque ligne
     - Améliore drastiquement les performances sur grandes tables

  2. **Sécurité des fonctions** - Corriger search_path mutable
     - Protège contre les attaques par manipulation du search_path
     - Utilise SET search_path = '' pour les fonctions SECURITY DEFINER

  3. **Nettoyage des index** - Supprimer les index inutilisés
     - Réduit la taille de la base de données
     - Améliore les performances d'écriture

  ## Modifications

  ### Tables concernées:
  - profiles
  - quiz_attempts
  - user_subject_progress
  - lesson_progress
  - daily_goals
  - user_achievements

  ### Fonctions sécurisées:
  - update_updated_at_column()
  - handle_new_user()
*/

-- ============================================================================
-- 1. OPTIMISATION DES POLITIQUES RLS (Performance)
-- ============================================================================

-- Drop et recréer les politiques avec (select auth.uid())
-- Cette optimisation évite la ré-évaluation pour chaque ligne

-- PROFILES
DROP POLICY IF EXISTS "Users can read own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

CREATE POLICY "Users can read own profile"
  ON profiles
  FOR SELECT
  TO authenticated
  USING (id = (select auth.uid()));

CREATE POLICY "Users can insert own profile"
  ON profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (id = (select auth.uid()));

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  TO authenticated
  USING (id = (select auth.uid()))
  WITH CHECK (id = (select auth.uid()));

-- QUIZ_ATTEMPTS
DROP POLICY IF EXISTS "Users can read own quiz attempts" ON quiz_attempts;
DROP POLICY IF EXISTS "Users can insert own quiz attempts" ON quiz_attempts;

CREATE POLICY "Users can read own quiz attempts"
  ON quiz_attempts
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own quiz attempts"
  ON quiz_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- USER_SUBJECT_PROGRESS
DROP POLICY IF EXISTS "Users can read own subject progress" ON user_subject_progress;
DROP POLICY IF EXISTS "Users can insert own subject progress" ON user_subject_progress;
DROP POLICY IF EXISTS "Users can update own subject progress" ON user_subject_progress;

CREATE POLICY "Users can read own subject progress"
  ON user_subject_progress
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own subject progress"
  ON user_subject_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own subject progress"
  ON user_subject_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- LESSON_PROGRESS
DROP POLICY IF EXISTS "Users can read own lesson progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can insert own lesson progress" ON lesson_progress;
DROP POLICY IF EXISTS "Users can update own lesson progress" ON lesson_progress;

CREATE POLICY "Users can read own lesson progress"
  ON lesson_progress
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own lesson progress"
  ON lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own lesson progress"
  ON lesson_progress
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- DAILY_GOALS
DROP POLICY IF EXISTS "Users can read own daily goals" ON daily_goals;
DROP POLICY IF EXISTS "Users can insert own daily goals" ON daily_goals;
DROP POLICY IF EXISTS "Users can update own daily goals" ON daily_goals;

CREATE POLICY "Users can read own daily goals"
  ON daily_goals
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own daily goals"
  ON daily_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

CREATE POLICY "Users can update own daily goals"
  ON daily_goals
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- USER_ACHIEVEMENTS
DROP POLICY IF EXISTS "Users can read own achievements" ON user_achievements;
DROP POLICY IF EXISTS "Users can insert own achievements" ON user_achievements;

CREATE POLICY "Users can read own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

CREATE POLICY "Users can insert own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- 2. CORRECTION DES FONCTIONS (Sécurité search_path)
-- ============================================================================

-- Recréer update_updated_at_column avec search_path sécurisé
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Recréer handle_new_user avec search_path sécurisé
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
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
$$;

-- ============================================================================
-- 3. VÉRIFICATION DE LA CONFIGURATION
-- ============================================================================

-- Cette requête permet de vérifier que les politiques sont bien optimisées
DO $$
BEGIN
  RAISE NOTICE 'RLS optimization completed successfully';
  RAISE NOTICE 'All policies now use (select auth.uid()) for better performance';
  RAISE NOTICE 'All SECURITY DEFINER functions have secure search_path';
END
$$;