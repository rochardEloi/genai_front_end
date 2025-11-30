# 📁 Supabase Database Documentation

Documentation complète de la base de données Horizon Learning Platform.

---

## 📋 Table des Matières

1. [Migrations](#migrations)
2. [Schéma de Base de Données](#schéma)
3. [Sécurité et Performance](#sécurité)
4. [Guides et Références](#guides)

---

## 🔄 Migrations

### Ordre d'Application

Les migrations sont appliquées dans l'ordre chronologique:

| # | Fichier | Description |
|---|---------|-------------|
| 1 | `20251124064250_create_users_profiles_schema.sql` | Profils utilisateurs et auth |
| 2 | `20251124064337_create_subjects_courses_schema.sql` | Matières, chapitres, leçons |
| 3 | `20251124064406_create_quizzes_exercises_schema.sql` | Quiz et questions |
| 4 | `20251124064439_create_progress_tracking_schema.sql` | Suivi progression |
| 5 | `20251128033646_fix_rls_performance_and_security.sql` | ✅ Corrections sécurité |

### Comment Appliquer une Migration

```bash
# Via Supabase CLI (si configuré)
supabase db push

# Via code TypeScript
import { applyMigration } from '@/lib/supabase-admin'
await applyMigration('migration_name', 'SQL_CONTENT')
```

---

## 🗄️ Schéma de Base de Données

### Tables Principales

#### Authentification et Profils
- **`auth.users`** - Gestion Supabase (automatique)
- **`profiles`** - Profils utilisateurs étendus

#### Contenu Pédagogique
- **`subjects`** - Matières (Math, Physique, etc.)
- **`topics`** - Chapitres/Thèmes
- **`lessons`** - Leçons individuelles

#### Évaluations
- **`quizzes`** - Quiz et examens
- **`questions`** - Questions individuelles
- **`quiz_attempts`** - Tentatives utilisateurs

#### Progression
- **`user_subject_progress`** - Progression globale par matière
- **`lesson_progress`** - Progression par leçon
- **`daily_goals`** - Objectifs quotidiens
- **`user_achievements`** - Badges et accomplissements

### Relations

```
auth.users (1) ─────── (1) profiles
     │
     ├── (1:N) quiz_attempts
     ├── (1:N) user_subject_progress
     ├── (1:N) lesson_progress
     ├── (1:N) daily_goals
     └── (1:N) user_achievements

subjects (1) ─────── (N) topics (1) ─────── (N) lessons
     │
     └── (1:N) quizzes (1) ─────── (N) questions
```

---

## 🔒 Sécurité et Performance

### Row Level Security (RLS)

**Toutes les tables ont RLS activé.**

#### Pattern Standard
```sql
-- Lecture: utilisateur voit uniquement ses données
CREATE POLICY "Users can read own data"
  ON table_name
  FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

-- Écriture: utilisateur modifie uniquement ses données
CREATE POLICY "Users can update own data"
  ON table_name
  FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));
```

#### ⚡ Optimisation

**Important:** Toujours utiliser `(select auth.uid())` au lieu de `auth.uid()`

```sql
-- ❌ MAUVAIS - Ré-évalue pour chaque ligne
USING (user_id = auth.uid())

-- ✅ BON - Évalue une seule fois
USING (user_id = (select auth.uid()))
```

### Fonctions Sécurisées

Toutes les fonctions `SECURITY DEFINER` utilisent `SET search_path = ''`:

```sql
CREATE FUNCTION my_function()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''  -- ✅ Protection obligatoire
AS $$ ... $$;
```

### Index

24 index créés pour optimiser les performances:

- Filtrage par utilisateur (`user_id`)
- Filtrage par matière/chapitre (`subject_id`, `topic_id`)
- Tri et ordre (`order_index`)
- Recherche composite (`user_id, status`)

**Voir:** [`INDEX_STRATEGY.md`](./INDEX_STRATEGY.md) pour détails complets.

---

## 📚 Guides et Références

### Documentation Interne

| Fichier | Description |
|---------|-------------|
| [`SECURITY_FIXES.md`](./SECURITY_FIXES.md) | ✅ Corrections sécurité appliquées |
| [`INDEX_STRATEGY.md`](./INDEX_STRATEGY.md) | Stratégie d'indexation |
| [`VERIFICATION_REPORT.md`](./VERIFICATION_REPORT.md) | Rapport de tests et validation |

### Ressources Externes

- [Supabase RLS Docs](https://supabase.com/docs/guides/database/postgres/row-level-security)
- [PostgreSQL Security](https://www.postgresql.org/docs/current/ddl-rowsecurity.html)
- [Function Security](https://wiki.postgresql.org/wiki/A_Guide_to_CVE-2018-1058%3A_Protect_Your_Search_Path)

---

## 🛠️ Maintenance

### Requêtes Utiles

#### Vérifier RLS

```sql
-- Lister toutes les politiques
SELECT schemaname, tablename, policyname
FROM pg_policies
WHERE schemaname = 'public'
ORDER BY tablename;

-- Vérifier tables avec RLS
SELECT schemaname, tablename, rowsecurity
FROM pg_tables
WHERE schemaname = 'public';
```

#### Analyser Performance

```sql
-- Statistiques des index
SELECT
  schemaname,
  tablename,
  indexname,
  idx_scan as scans,
  idx_tup_read as tuples_read
FROM pg_stat_user_indexes
WHERE schemaname = 'public'
ORDER BY idx_scan DESC;

-- Taille des tables
SELECT
  schemaname,
  tablename,
  pg_size_pretty(pg_total_relation_size(schemaname||'.'||tablename)) as size
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY pg_total_relation_size(schemaname||'.'||tablename) DESC;
```

#### Vérifier Fonctions

```sql
-- Lister fonctions avec leur sécurité
SELECT
  p.proname,
  p.prosecdef as security_definer,
  p.proconfig as config
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public';
```

### Backup

```bash
# Backup complet
pg_dump -h db.xxx.supabase.co -U postgres > backup.sql

# Backup schema uniquement
pg_dump -h db.xxx.supabase.co -U postgres --schema-only > schema.sql

# Backup données uniquement
pg_dump -h db.xxx.supabase.co -U postgres --data-only > data.sql
```

---

## 🚀 Déploiement

### Environnements

| Env | URL | Base |
|-----|-----|------|
| Development | Local | Supabase local |
| Staging | staging.horizon.app | Supabase project staging |
| Production | horizon.app | Supabase project prod |

### Checklist Déploiement

- [ ] Backup base de données actuelle
- [ ] Vérifier migrations à appliquer
- [ ] Appliquer migrations en staging
- [ ] Tests complets en staging
- [ ] Appliquer migrations en production
- [ ] Monitoring post-déploiement

---

## 🐛 Troubleshooting

### RLS Bloque les Requêtes

**Symptôme:** Requêtes retournent 0 résultat

**Solution:**
```sql
-- Vérifier le JWT actuel
SELECT auth.uid();

-- Désactiver RLS temporairement (dev seulement!)
ALTER TABLE table_name DISABLE ROW LEVEL SECURITY;

-- Vérifier la politique
SELECT * FROM pg_policies WHERE tablename = 'table_name';
```

### Fonction Trigger ne Fonctionne Pas

**Symptôme:** `updated_at` ne se met pas à jour

**Solution:**
```sql
-- Vérifier le trigger existe
SELECT tgname, tgenabled
FROM pg_trigger
WHERE tgrelid = 'table_name'::regclass;

-- Recréer le trigger
DROP TRIGGER IF EXISTS update_table_updated_at ON table_name;
CREATE TRIGGER update_table_updated_at
  BEFORE UPDATE ON table_name
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
```

### Performance Lente

**Solutions:**
1. Vérifier utilisation index: `EXPLAIN ANALYZE SELECT ...`
2. Optimiser RLS avec `(select auth.uid())`
3. Ajouter index manquants
4. Analyser plans de requêtes

---

## 📞 Support

### Contacts

- **Dev Team:** dev@horizon.app
- **Database Admin:** dba@horizon.app
- **Supabase Support:** support@supabase.io

### Ressources

- [Horizon Wiki](https://wiki.horizon.app)
- [Supabase Dashboard](https://app.supabase.com)
- [GitHub Issues](https://github.com/horizon/platform/issues)

---

**Dernière mise à jour:** 2024-11-28
**Version base de données:** 5 (migrations)
**Status:** ✅ Production ready
