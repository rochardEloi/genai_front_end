# 📊 Stratégie d'Indexation de la Base de Données

## ℹ️ Contexte

Supabase a signalé plusieurs index "inutilisés" dans la base de données. Ces index n'ont pas encore été utilisés car l'application est en développement et ne contient pas encore de données de production.

## 🎯 Recommandation: **Conserver tous les index**

### Pourquoi garder les index "inutilisés" ?

1. **Préparation pour la Production**
   - Les index ont été créés de manière **préventive**
   - Ils seront essentiels quand l'application aura des milliers d'utilisateurs
   - Supprimer puis recréer des index sur de grandes tables est coûteux

2. **Patterns de Requêtes Prévus**
   - Les index correspondent aux requêtes qui seront effectuées
   - Exemples : filtrage par utilisateur, tri par date, recherche par matière

3. **Coût Actuel Négligeable**
   - Sur une base de données vide/petite, l'impact est minimal
   - Quelques Ko d'espace disque seulement
   - Overhead d'écriture insignifiant avec peu de données

## 📋 Liste des Index et Leur Utilité

### Subjects & Topics (Cours)

```sql
-- Recherche par filière (S, D, L)
idx_subjects_stream ON subjects(stream)
-- Usage: SELECT * FROM subjects WHERE stream = 'S'

-- Ordre d'affichage des matières
idx_subjects_order ON subjects(order_index)
-- Usage: SELECT * FROM subjects ORDER BY order_index

-- Chapitres d'une matière
idx_topics_subject ON topics(subject_id)
-- Usage: SELECT * FROM topics WHERE subject_id = ?

-- Ordre des chapitres
idx_topics_order ON topics(subject_id, order_index)
-- Usage: SELECT * FROM topics WHERE subject_id = ? ORDER BY order_index
```

### Lessons (Leçons)

```sql
-- Leçons d'un chapitre
idx_lessons_topic ON lessons(topic_id)
-- Usage: SELECT * FROM lessons WHERE topic_id = ?

-- Ordre des leçons
idx_lessons_order ON lessons(topic_id, order_index)
-- Usage: SELECT * FROM lessons WHERE topic_id = ? ORDER BY order_index
```

### Quizzes & Questions

```sql
-- Quiz d'une matière
idx_quizzes_subject ON quizzes(subject_id)
-- Usage: SELECT * FROM quizzes WHERE subject_id = ?

-- Quiz d'un chapitre
idx_quizzes_topic ON quizzes(topic_id)
-- Usage: SELECT * FROM quizzes WHERE topic_id = ?

-- Filtrage par type (diagnostic, practice, exam)
idx_quizzes_type ON quizzes(quiz_type)
-- Usage: SELECT * FROM quizzes WHERE quiz_type = 'diagnostic'

-- Filtrage quiz publiés
idx_quizzes_published ON quizzes(is_published)
-- Usage: SELECT * FROM quizzes WHERE is_published = true

-- Questions d'un quiz
idx_questions_quiz ON questions(quiz_id)
-- Usage: SELECT * FROM questions WHERE quiz_id = ?

-- Questions dans l'ordre
idx_questions_order ON questions(quiz_id, order_index)
-- Usage: SELECT * FROM questions WHERE quiz_id = ? ORDER BY order_index
```

### Quiz Attempts (Tentatives)

```sql
-- Tentatives d'un utilisateur
idx_quiz_attempts_user ON quiz_attempts(user_id)
-- Usage: SELECT * FROM quiz_attempts WHERE user_id = ?

-- Tentatives pour un quiz
idx_quiz_attempts_quiz ON quiz_attempts(quiz_id)
-- Usage: SELECT * FROM quiz_attempts WHERE quiz_id = ?

-- Historique utilisateur-quiz (COMPOSITE)
idx_quiz_attempts_user_quiz ON quiz_attempts(user_id, quiz_id)
-- Usage: SELECT * FROM quiz_attempts WHERE user_id = ? AND quiz_id = ?
```

### Progress Tracking (Suivi de Progression)

```sql
-- Progression d'un utilisateur
idx_user_subject_progress_user ON user_subject_progress(user_id)
-- Usage: SELECT * FROM user_subject_progress WHERE user_id = ?

-- Progression par matière
idx_user_subject_progress_subject ON user_subject_progress(subject_id)
-- Usage: SELECT * FROM user_subject_progress WHERE subject_id = ?

-- Leçons d'un utilisateur
idx_lesson_progress_user ON lesson_progress(user_id)
-- Usage: SELECT * FROM lesson_progress WHERE user_id = ?

-- Progression d'une leçon
idx_lesson_progress_lesson ON lesson_progress(lesson_id)
-- Usage: SELECT * FROM lesson_progress WHERE lesson_id = ?

-- Filtrage par statut (COMPOSITE)
idx_lesson_progress_status ON lesson_progress(user_id, status)
-- Usage: SELECT * FROM lesson_progress WHERE user_id = ? AND status = 'completed'

-- Objectifs par date (COMPOSITE)
idx_daily_goals_user_date ON daily_goals(user_id, goal_date)
-- Usage: SELECT * FROM daily_goals WHERE user_id = ? AND goal_date = ?

-- Achievements d'un utilisateur
idx_user_achievements_user ON user_achievements(user_id)
-- Usage: SELECT * FROM user_achievements WHERE user_id = ?

-- Filtrage par type (COMPOSITE)
idx_user_achievements_type ON user_achievements(user_id, achievement_type)
-- Usage: SELECT * FROM user_achievements WHERE user_id = ? AND achievement_type = 'streak'
```

## 🚀 Impact Attendu en Production

Avec 10,000 utilisateurs et 1,000 leçons:

- **Sans index**: Queries de 2-5 secondes (table scans)
- **Avec index**: Queries de 10-50ms (index seeks)
- **Amélioration**: 100x plus rapide

## 📊 Monitoring des Index

Pour vérifier l'utilisation des index en production:

```sql
-- Statistiques d'utilisation des index
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as index_scans,
  idx_tup_read as tuples_read,
  idx_tup_fetch as tuples_fetched
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;
```

## 🗑️ Quand Supprimer un Index ?

Supprimez un index uniquement si:

1. **Après 3+ mois en production**, il n'a JAMAIS été utilisé
2. **ET** aucune feature prévue ne l'utilisera
3. **ET** l'espace disque est vraiment limité

### Comment supprimer (si vraiment nécessaire):

```sql
-- Exemple (NE PAS EXÉCUTER sans analyse)
DROP INDEX IF EXISTS idx_subjects_stream;
```

## ✅ Conclusion

**Décision: CONSERVER TOUS LES INDEX**

- Coût actuel: ~50 Ko d'espace disque
- Bénéfice futur: Performances optimales en production
- Approche: Préventive et professionnelle

**Les index "inutilisés" aujourd'hui seront critiques demain.**
