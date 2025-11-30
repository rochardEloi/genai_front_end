/*
  # Création du schéma de suivi de progression

  ## Nouvelles Tables
  
  ### `user_subject_progress`
  Progression globale de l'utilisateur par matière
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Référence vers auth.users
  - `subject_id` (uuid) - Référence vers subjects
  - `level` (text) - Niveau actuel: 'debutant', 'intermediaire', 'avance', 'expert'
  - `total_lessons_completed` (int) - Nombre de leçons complétées
  - `total_quizzes_completed` (int) - Nombre de quiz complétés
  - `average_score` (decimal) - Score moyen (0-100)
  - `total_time_minutes` (int) - Temps total passé
  - `last_activity_at` (timestamptz) - Dernière activité
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `lesson_progress`
  Progression détaillée par leçon
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Référence vers auth.users
  - `lesson_id` (uuid) - Référence vers lessons
  - `status` (text) - Statut: 'not_started', 'in_progress', 'completed'
  - `progress_percentage` (int) - Progression en pourcentage (0-100)
  - `time_spent_minutes` (int) - Temps passé
  - `completed_at` (timestamptz, nullable) - Date de complétion
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `daily_goals`
  Objectifs quotidiens de l'utilisateur
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Référence vers auth.users
  - `goal_date` (date) - Date de l'objectif
  - `target_minutes` (int) - Objectif de minutes
  - `actual_minutes` (int) - Minutes effectuées
  - `target_quizzes` (int) - Objectif de quiz
  - `actual_quizzes` (int) - Quiz effectués
  - `is_achieved` (boolean) - Objectif atteint ou non
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `user_achievements`
  Badges et accomplissements
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Référence vers auth.users
  - `achievement_type` (text) - Type: 'streak', 'score', 'completion', 'time'
  - `achievement_name` (text) - Nom du badge
  - `description` (text) - Description
  - `icon` (text) - Icône
  - `earned_at` (timestamptz) - Date d'obtention
  - `created_at` (timestamptz)

  ## Sécurité
  
  1. RLS activé sur toutes les tables
  2. Politiques:
     - Chaque utilisateur peut lire et modifier uniquement ses propres données
     - Insertion automatique permise pour l'utilisateur

  ## Notes
  
  - Système de progression granulaire
  - Gamification avec badges
  - Suivi temporel détaillé
*/

-- Create user_subject_progress table
CREATE TABLE IF NOT EXISTS user_subject_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  level text NOT NULL DEFAULT 'debutant' CHECK (level IN ('debutant', 'intermediaire', 'avance', 'expert')),
  total_lessons_completed int DEFAULT 0,
  total_quizzes_completed int DEFAULT 0,
  average_score decimal(5,2) DEFAULT 0,
  total_time_minutes int DEFAULT 0,
  last_activity_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, subject_id)
);

-- Create lesson_progress table
CREATE TABLE IF NOT EXISTS lesson_progress (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  lesson_id uuid NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  status text NOT NULL DEFAULT 'not_started' CHECK (status IN ('not_started', 'in_progress', 'completed')),
  progress_percentage int DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
  time_spent_minutes int DEFAULT 0,
  completed_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, lesson_id)
);

-- Create daily_goals table
CREATE TABLE IF NOT EXISTS daily_goals (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  goal_date date NOT NULL,
  target_minutes int DEFAULT 30,
  actual_minutes int DEFAULT 0,
  target_quizzes int DEFAULT 2,
  actual_quizzes int DEFAULT 0,
  is_achieved boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id, goal_date)
);

-- Create user_achievements table
CREATE TABLE IF NOT EXISTS user_achievements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type text NOT NULL CHECK (achievement_type IN ('streak', 'score', 'completion', 'time')),
  achievement_name text NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'Award',
  earned_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE user_subject_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE lesson_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_achievements ENABLE ROW LEVEL SECURITY;

-- Policies for user_subject_progress
CREATE POLICY "Users can read own subject progress"
  ON user_subject_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own subject progress"
  ON user_subject_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own subject progress"
  ON user_subject_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for lesson_progress
CREATE POLICY "Users can read own lesson progress"
  ON lesson_progress
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own lesson progress"
  ON lesson_progress
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own lesson progress"
  ON lesson_progress
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for daily_goals
CREATE POLICY "Users can read own daily goals"
  ON daily_goals
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own daily goals"
  ON daily_goals
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own daily goals"
  ON daily_goals
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Policies for user_achievements
CREATE POLICY "Users can read own achievements"
  ON user_achievements
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own achievements"
  ON user_achievements
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_user_subject_progress_updated_at
  BEFORE UPDATE ON user_subject_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lesson_progress_updated_at
  BEFORE UPDATE ON lesson_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_daily_goals_updated_at
  BEFORE UPDATE ON daily_goals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_user_subject_progress_user ON user_subject_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_user_subject_progress_subject ON user_subject_progress(subject_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_user ON lesson_progress(user_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_lesson ON lesson_progress(lesson_id);
CREATE INDEX IF NOT EXISTS idx_lesson_progress_status ON lesson_progress(user_id, status);
CREATE INDEX IF NOT EXISTS idx_daily_goals_user_date ON daily_goals(user_id, goal_date);
CREATE INDEX IF NOT EXISTS idx_user_achievements_user ON user_achievements(user_id);
CREATE INDEX IF NOT EXISTS idx_user_achievements_type ON user_achievements(user_id, achievement_type);
