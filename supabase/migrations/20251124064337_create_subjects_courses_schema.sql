/*
  # Création du schéma matières et cours

  ## Nouvelles Tables
  
  ### `subjects`
  Table des matières par filière (Maths, Physique, Chimie, Français, etc.)
  - `id` (uuid, primary key)
  - `name` (text) - Nom de la matière (ex: "Mathématiques")
  - `slug` (text, unique) - Identifiant URL-friendly (ex: "mathematiques")
  - `description` (text) - Description de la matière
  - `icon` (text) - Nom de l'icône Lucide React
  - `stream` (text[]) - Filières concernées: ['S'], ['D'], ['L'], ou ['S', 'D', 'L']
  - `order_index` (int) - Ordre d'affichage
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `topics`
  Table des chapitres/thèmes au sein de chaque matière
  - `id` (uuid, primary key)
  - `subject_id` (uuid) - Référence vers subjects
  - `title` (text) - Titre du chapitre
  - `slug` (text) - Identifiant URL-friendly
  - `description` (text) - Description du chapitre
  - `order_index` (int) - Ordre dans la matière
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ### `lessons`
  Table des leçons au sein de chaque chapitre
  - `id` (uuid, primary key)
  - `topic_id` (uuid) - Référence vers topics
  - `title` (text) - Titre de la leçon
  - `slug` (text) - Identifiant URL-friendly
  - `content` (text) - Contenu de la leçon (markdown/HTML)
  - `duration_minutes` (int) - Durée estimée en minutes
  - `difficulty` (text) - 'facile', 'moyen', 'difficile'
  - `order_index` (int) - Ordre dans le chapitre
  - `created_at` (timestamptz)
  - `updated_at` (timestamptz)

  ## Sécurité
  
  1. RLS activé sur toutes les tables
  2. Politiques:
     - Lecture publique pour tous les utilisateurs authentifiés
     - Pas d'insertion/modification pour les utilisateurs (géré par admin uniquement)

  ## Notes
  
  - Les matières sont configurables par filière
  - Structure hiérarchique: Matière → Chapitre → Leçon
*/

-- Create subjects table
CREATE TABLE IF NOT EXISTS subjects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  slug text UNIQUE NOT NULL,
  description text NOT NULL DEFAULT '',
  icon text NOT NULL DEFAULT 'BookOpen',
  stream text[] NOT NULL DEFAULT '{"S", "D", "L"}',
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create topics table
CREATE TABLE IF NOT EXISTS topics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  subject_id uuid NOT NULL REFERENCES subjects(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL DEFAULT '',
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(subject_id, slug)
);

-- Create lessons table
CREATE TABLE IF NOT EXISTS lessons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  topic_id uuid NOT NULL REFERENCES topics(id) ON DELETE CASCADE,
  title text NOT NULL,
  slug text NOT NULL,
  content text NOT NULL DEFAULT '',
  duration_minutes int DEFAULT 15,
  difficulty text NOT NULL DEFAULT 'moyen' CHECK (difficulty IN ('facile', 'moyen', 'difficile')),
  order_index int NOT NULL DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(topic_id, slug)
);

-- Enable RLS
ALTER TABLE subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE topics ENABLE ROW LEVEL SECURITY;
ALTER TABLE lessons ENABLE ROW LEVEL SECURITY;

-- Policies for subjects (read-only for authenticated users)
CREATE POLICY "Authenticated users can read subjects"
  ON subjects
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for topics (read-only for authenticated users)
CREATE POLICY "Authenticated users can read topics"
  ON topics
  FOR SELECT
  TO authenticated
  USING (true);

-- Policies for lessons (read-only for authenticated users)
CREATE POLICY "Authenticated users can read lessons"
  ON lessons
  FOR SELECT
  TO authenticated
  USING (true);

-- Triggers for updated_at
CREATE TRIGGER update_subjects_updated_at
  BEFORE UPDATE ON subjects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_topics_updated_at
  BEFORE UPDATE ON topics
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_lessons_updated_at
  BEFORE UPDATE ON lessons
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_subjects_stream ON subjects USING GIN (stream);
CREATE INDEX IF NOT EXISTS idx_subjects_order ON subjects(order_index);
CREATE INDEX IF NOT EXISTS idx_topics_subject ON topics(subject_id);
CREATE INDEX IF NOT EXISTS idx_topics_order ON topics(subject_id, order_index);
CREATE INDEX IF NOT EXISTS idx_lessons_topic ON lessons(topic_id);
CREATE INDEX IF NOT EXISTS idx_lessons_order ON lessons(topic_id, order_index);
