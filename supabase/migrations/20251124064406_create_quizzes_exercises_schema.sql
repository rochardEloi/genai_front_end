/*
  # Création du schéma quizzes et exercices

  ## Nouvelles Tables
  
  ### `quizzes`
  Table des quiz de diagnostic et d'évaluation
  - `id` (uuid, primary key)
  - `title` (text) - Titre du quiz
  - `description` (text) - Description
  - `subject_id` (uuid, nullable) - Matière associée (null = diagnostic général)
  - `topic_id` (uuid, nullable) - Chapitre associé (null = quiz général)
  - `quiz_type` (text) - Type: 'diagnostic', 'practice', 'exam'
  - `difficulty` (text) - Niveau: 'facile', 'moyen', 'difficile'
  - `time_limit_minutes` (int, nullable) - Temps limite (null = pas de limite)
  - `passing_score` (int) - Score minimum pour réussir (sur 100)
  - `is_published` (boolean) - Publié ou brouillon
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `questions`
  Table des questions individuelles
  - `id` (uuid, primary key)
  - `quiz_id` (uuid) - Référence vers quizzes
  - `question_text` (text) - Texte de la question
  - `question_type` (text) - Type: 'multiple_choice', 'true_false', 'short_answer'
  - `options` (jsonb) - Options de réponse pour QCM
  - `correct_answer` (text) - Réponse correcte
  - `explanation` (text) - Explication de la réponse
  - `points` (int) - Points attribués
  - `order_index` (int) - Ordre dans le quiz
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `quiz_attempts`
  Table des tentatives de quiz par utilisateur
  - `id` (uuid, primary key)
  - `user_id` (uuid) - Référence vers auth.users
  - `quiz_id` (uuid) - Référence vers quizzes
  - `score` (int) - Score obtenu (sur 100)
  - `correct_answers` (int) - Nombre de bonnes réponses
  - `total_questions` (int) - Nombre total de questions
  - `time_spent_minutes` (int) - Temps passé
  - `answers` (jsonb) - Réponses de l'utilisateur
  - `completed_at` (timestamptz) - Date de complétion
  - `created_at` (timestamptz)

  ## Sécurité
  
  1. RLS activé sur toutes les tables
  2. Politiques:
     - Quizzes et questions: lecture pour tous les utilisateurs authentifiés
     - Quiz attempts: lecture et insertion uniquement pour l'utilisateur propriétaire

  ## Notes
  
  - Structure JSONB pour flexibilité des options et réponses
  - Support de différents types de questions
  - Historique complet des tentatives
*/

-- Create quizzes table
CREATE TABLE IF NOT EXISTS quizzes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  description text NOT NULL DEFAULT '',
  subject_id uuid REFERENCES subjects(id) ON DELETE CASCADE,
  topic_id uuid REFERENCES topics(id) ON DELETE CASCADE,
  quiz_type text NOT NULL DEFAULT 'practice' CHECK (quiz_type IN ('diagnostic', 'practice', 'exam')),
  difficulty text NOT NULL DEFAULT 'moyen' CHECK (difficulty IN ('facile', 'moyen', 'difficile')),
  time_limit_minutes int,
  passing_score int NOT NULL DEFAULT 60,
  is_published boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create questions table
CREATE TABLE IF NOT EXISTS questions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  question_text text NOT NULL,
  question_type text NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer')),
  options jsonb DEFAULT '[]'::jsonb,
  correct_answer text NOT NULL,
  explanation text NOT NULL DEFAULT '',
  points int NOT NULL DEFAULT 1,
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create quiz_attempts table
CREATE TABLE IF NOT EXISTS quiz_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  quiz_id uuid NOT NULL REFERENCES quizzes(id) ON DELETE CASCADE,
  score int NOT NULL DEFAULT 0,
  correct_answers int NOT NULL DEFAULT 0,
  total_questions int NOT NULL,
  time_spent_minutes int DEFAULT 0,
  answers jsonb DEFAULT '{}'::jsonb,
  completed_at timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE quiz_attempts ENABLE ROW LEVEL SECURITY;

-- Policies for quizzes
CREATE POLICY "Authenticated users can read published quizzes"
  ON quizzes
  FOR SELECT
  TO authenticated
  USING (is_published = true);

-- Policies for questions
CREATE POLICY "Authenticated users can read questions"
  ON questions
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM quizzes
      WHERE quizzes.id = questions.quiz_id
      AND quizzes.is_published = true
    )
  );

-- Policies for quiz_attempts
CREATE POLICY "Users can read own quiz attempts"
  ON quiz_attempts
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own quiz attempts"
  ON quiz_attempts
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Triggers for updated_at
CREATE TRIGGER update_quizzes_updated_at
  BEFORE UPDATE ON quizzes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_questions_updated_at
  BEFORE UPDATE ON questions
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_quizzes_subject ON quizzes(subject_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_topic ON quizzes(topic_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_type ON quizzes(quiz_type);
CREATE INDEX IF NOT EXISTS idx_quizzes_published ON quizzes(is_published);
CREATE INDEX IF NOT EXISTS idx_questions_quiz ON questions(quiz_id);
CREATE INDEX IF NOT EXISTS idx_questions_order ON questions(quiz_id, order_index);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user ON quiz_attempts(user_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_quiz ON quiz_attempts(quiz_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id);
