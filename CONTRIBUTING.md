# Contributing to Doctic Medical OS

Merci de votre intérêt pour contribuer à Doctic Medical OS ! 🎉

## 📋 Code of Conduct

En participant à ce projet, vous acceptez de respecter notre code de conduite :
- Respectueux et professionnel
- Constructif dans les critiques
- Focus sur la qualité du code
- Respect de la vie privée des patients (HIPAA/RGPD)

## 🚀 Comment Contribuer

### 1. Fork & Clone

```bash
# Fork sur GitHub puis :
git clone https://github.com/VOTRE-USERNAME/doctic-care.git
cd doctic-care

# Ajouter upstream
git remote add upstream https://github.com/beniich/doctic-care.git
```

### 2. Créer une Branche

```bash
git checkout -b feature/ma-nouvelle-fonctionnalite
# ou
git checkout -b fix/correction-bug
```

**Conventions noms de branches :**
- `feature/` - Nouvelle fonctionnalité
- `fix/` - Correction bug
- `docs/` - Documentation
- `refactor/` - Refactoring
- `test/` - Ajout tests
- `perf/` - Optimisation performance

### 3. Développer

```bash
# Installer dépendances
npm install

# Lancer dev
npm run dev  # Frontend
npm start    # Backend

# Tests en continu
npm run test:watch
```

### 4. Commit

**Format commits (Conventional Commits) :**

```bash
<type>(<scope>): <description>

[optional body]

[optional footer]
```

**Types :**
- `feat` - Nouvelle fonctionnalité
- `fix` - Correction bug
- `docs` - Documentation
- `style` - Formatage (pas de changement code)
- `refactor` - Refactoring
- `test` - Ajout/modification tests
- `chore` - Maintenance (deps, config)
- `perf` - Performance

**Exemples :**
```bash
git commit -m "feat(patients): add export CSV functionality"
git commit -m "fix(auth): resolve token refresh race condition"
git commit -m "docs(readme): update installation instructions"
```

### 5. Tests

```bash
# Tests unitaires
npm test

# Lint
npm run lint

# Validation .env
npm run validate:env

# Tests de charge (optionnel)
k6 run --vus 10 --duration 1m tests/load/k6-full-scenario.js
```

✅ **Tous les tests doivent passer avant PR !**

### 6. Push & Pull Request

```bash
git push origin feature/ma-nouvelle-fonctionnalite
```

Puis ouvrir Pull Request sur GitHub avec :
- **Titre clair** : "feat: Add patient export CSV"
- **Description** :
  - Qu'est-ce qui change ?
  - Pourquoi ?
  - Comment tester ?
  - Screenshots (si UI)

**Template PR :**
```markdown
## Description
Brève description des changements

## Type de changement
- [ ] Bug fix
- [ ] Nouvelle fonctionnalité
- [ ] Breaking change
- [ ] Documentation

## Comment tester
1. Lancer `npm run dev`
2. Naviguer vers /patients
3. Cliquer sur "Export CSV"
4. Vérifier le fichier téléchargé

## Checklist
- [ ] Tests ajoutés/mis à jour
- [ ] Documentation mise à jour
- [ ] Pas de régression
- [ ] Code review demandé
- [ ] RGPD/HIPAA respecté (si applicable)
```

---

## 🎯 Directives

### Code Style

- **TypeScript** : Types stricts, pas de `any`
- **React** : Functional components + hooks
- **Naming** : 
  - Components : `PascalCase`
  - Functions : `camelCase`
  - Constants : `UPPER_SNAKE_CASE`
- **Fichiers** : `kebab-case.tsx`

### Sécurité

⚠️ **CRITIQUE - Données Médicales** :
- ❌ Jamais commit `.env` ou secrets
- ❌ Jamais commit vraies données patients
- ✅ Toujours utiliser mock data pour tests
- ✅ Validation inputs (Zod)
- ✅ Sanitization XSS systématique

### Performance

- Lazy loading pour composants lourds
- Memoization (React.memo, useMemo, useCallback)
- Optimisation images (WebP, lazy)
- Bundle size < 500KB

### Tests

**Coverage minimum : 70%**

```bash
# Vérifier coverage
npm test -- --coverage

# Doit afficher :
# Statements   : 70% ( xxx/yyy )
# Branches     : 70% ( xxx/yyy )
# Functions    : 70% ( xxx/yyy )
# Lines        : 70% ( xxx/yyy )
```

---

## 🐛 Rapporter un Bug

Utiliser [GitHub Issues](https://github.com/beniich/doctic-care/issues/new) avec ce template :

```markdown
**Describe the bug**
Description claire du bug

**To Reproduce**
1. Go to '...'
2. Click on '....'
3. Scroll down to '....'
4. See error

**Expected behavior**
Comportement attendu

**Screenshots**
Si applicable

**Environment:**
 - OS: [e.g. Windows 11]
 - Browser [e.g. chrome, safari]
 - Version [e.g. 22]

**Additional context**
Contexte additionnel
```

---

## 💡 Proposer une Fonctionnalité

Utiliser [GitHub Discussions](https://github.com/beniich/doctic-care/discussions) :

```markdown
**Is your feature request related to a problem?**
Ex: Je suis toujours frustré quand [...]

**Describe the solution you'd like**
Description claire de ce que vous voulez

**Describe alternatives you've considered**
Alternatives considérées

**Additional context**
Mockups, exemples, etc.
```

---

## 📝 Documentation

Si vous modifiez/ajoutez des fonctionnalités :

1. **README.md** - Vue d'ensemble
2. **docs/** - Documentation détaillée
3. **Code comments** - JSDoc pour fonctions complexes
4. **CHANGELOG.md** - Ajouter entrée avec date

---

## 🎓 Ressources

### Apprendre le Stack

- **React** : https://react.dev
- **TypeScript** : https://typescriptlang.org
- **Prisma** : https://prisma.io/docs
- **Tailwind** : https://tailwindcss.com

### Standards Médicaux

- **HIPAA** : https://www.hhs.gov/hipaa
- **RGPD** : https://gdpr.eu
- **HL7 FHIR** : https://hl7.org/fhir

---

## 🆘 Besoin d'Aide ?

- 💬 [Discord](https://discord.gg/doctic)
- 📧 Email : dev@doctic.fr
- 📚 [Documentation](./docs)

---

## ✅ Processus Review

1. **Automated checks** : Tests, lint, security scan
2. **Code review** : 1+ reviewer approuve
3. **QA** : Tests manuels sur staging
4. **Merge** : Squash & merge vers main
5. **Deploy** : Automatic vers production

**Délai moyen review : 2-3 jours**

---

## 🎉 Contributors

Merci à tous nos contributeurs !

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

---

**Questions ?** Ouvrir une [Discussion](https://github.com/beniich/doctic-care/discussions/new) !
