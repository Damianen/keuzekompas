# Keuzekompas - Requirements en Testplan

## 1. Projectoverzicht

Keuzekompas is een webapplicatie voor het beheren en selecteren van onderwijsmodules. Het systeem bestaat uit een React-gebaseerde frontend en een Node.js/Hono backend met MongoDB database.

### 1.1 Technische Stack
- **Frontend**: React 19, TypeScript, Vite, TailwindCSS, Radix UI
- **Backend**: Hono, Node.js, TypeScript, MongoDB (Mongoose)
- **Authenticatie**: JWT, bcrypt
- **Testing**: Vitest

---

## 2. Functionele Requirements

### 2.1 Gebruikersbeheer

#### FR-01: Gebruikersregistratie
**Beschrijving**: Nieuwe gebruikers moeten zich kunnen registreren in het systeem.

**Acceptatiecriteria**:
- Gebruiker kan registreren met email, naam, studie en wachtwoord
- Email moet uniek zijn in het systeem
- Wachtwoord moet veilig worden gehashed (bcrypt)
- Bij succesvolle registratie wordt een gebruikersaccount aangemaakt
- Gebruiker ontvangt passende feedback bij fouten

#### FR-02: Gebruikersauthenticatie
**Beschrijving**: Geregistreerde gebruikers moeten kunnen inloggen.

**Acceptatiecriteria**:
- Gebruiker kan inloggen met email en wachtwoord
- Bij succesvolle login wordt een JWT token uitgegeven
- Token bevat gebruikers-ID en rol
- Bij foutieve inloggegevens krijgt gebruiker een foutmelding
- Token wordt gebruikt voor authenticatie van vervolgverzoeken

#### FR-03: Gebruikersprofiel
**Beschrijving**: Gebruikers moeten hun profielgegevens kunnen bekijken en beheren.

**Acceptatiecriteria**:
- Gebruiker kan eigen profielgegevens inzien
- Profielgegevens tonen: naam, email, studie, favoriete modules
- Alleen ingelogde gebruikers hebben toegang tot profielpagina

#### FR-04: Gebruikersrollen
**Beschrijving**: Het systeem ondersteunt verschillende gebruikersrollen.

**Acceptatiecriteria**:
- Systeem kent minimaal twee rollen: normale gebruiker en beheerder
- Rolgebaseerde toegangscontrole wordt afgedwongen
- Beheerders hebben extra rechten voor modulebeheer

### 2.2 Modulebeheer

#### FR-05: Modules Overzicht
**Beschrijving**: Gebruikers moeten een overzicht kunnen zien van beschikbare modules.

**Acceptatiecriteria**:
- Alle modules worden getoond in een overzichtelijk format
- Per module wordt minimaal getoond: naam, locatie, periode, aanbieder, duur, taal, niveau
- Modules zijn klikbaar voor meer details

#### FR-06: Module Details
**Beschrijving**: Gebruikers moeten gedetailleerde informatie over een module kunnen bekijken.

**Acceptatiecriteria**:
- Detailpagina toont alle module-informatie inclusief beschrijving
- Module bevat: id, naam, locatie, periode, aanbieder, duur, taal, niveau, beschrijving, informatie, aanmaakdatum
- Navigatie terug naar overzicht is mogelijk

#### FR-07: Module Aanmaken (Admin)
**Beschrijving**: Beheerders moeten nieuwe modules kunnen aanmaken.

**Acceptatiecriteria**:
- Alleen beheerders hebben toegang tot module-aanmaakfunctie
- Alle verplichte velden moeten worden ingevuld
- Validatie op invoergegevens
- Bij succes wordt module opgeslagen in database
- Bevestiging wordt getoond aan gebruiker

#### FR-08: Module Bewerken (Admin)
**Beschrijving**: Beheerders moeten bestaande modules kunnen bewerken.

**Acceptatiecriteria**:
- Alleen beheerders kunnen modules bewerken
- Formulier wordt vooraf ingevuld met huidige gegevens
- Wijzigingen worden opgeslagen in database
- Validatie op invoergegevens

#### FR-09: Module Verwijderen (Admin)
**Beschrijving**: Beheerders moeten modules kunnen verwijderen.

**Acceptatiecriteria**:
- Alleen beheerders kunnen modules verwijderen
- Bevestiging wordt gevraagd voor verwijdering
- Module wordt permanent verwijderd uit database
- Gebruiker krijgt feedback over succesvolle verwijdering

### 2.3 Favorieten Functionaliteit

#### FR-10: Modules Favoriet Maken
**Beschrijving**: Gebruikers moeten modules als favoriet kunnen markeren.

**Acceptatiecriteria**:
- Ingelogde gebruikers kunnen modules toevoegen aan favorieten
- Favorieten worden gekoppeld aan gebruikersprofiel
- Visuele indicatie van favoriete status
- Gebruiker kan favoriet weer verwijderen

#### FR-11: Favorieten Overzicht
**Beschrijving**: Gebruikers moeten hun favoriete modules kunnen bekijken.

**Acceptatiecriteria**:
- Overzicht van alle favoriete modules in gebruikersprofiel
- Snelle toegang tot favoriete modules
- Modules kunnen uit favorieten worden verwijderd

---

## 3. Niet-Functionele Requirements

### 3.1 Beveiliging

#### NFR-01: Wachtwoordbeveiliging
- Wachtwoorden worden gehashed met bcrypt
- Minimale wachtwoordsterkte wordt afgedwongen
- Wachtwoorden worden nooit in plaintext opgeslagen

#### NFR-02: Authenticatie & Autorisatie
- JWT tokens voor sessie management
- Token expiratie wordt geïmplementeerd
- Rolgebaseerde toegangscontrole (RBAC)
- Protected routes voor gevoelige functionaliteit

#### NFR-03: Data Validatie
- Input validatie op client en server side
- Gebruik van Zod voor schema validatie
- Bescherming tegen SQL/NoSQL injection
- Sanitisatie van gebruikersinvoer

### 3.2 Prestaties

#### NFR-04: Responstijd
- Pagina's laden binnen 2 seconden onder normale omstandigheden
- API endpoints reageren binnen 500ms
- Database queries zijn geoptimaliseerd

#### NFR-05: Schaalbaarheid
- Applicatie kan minimaal 100 gelijktijdige gebruikers aan
- Database kan groeien tot 10.000+ modules
- Efficiënte paginering voor grote datasets

### 3.3 Gebruiksvriendelijkheid

#### NFR-06: Responsive Design
- Applicatie is bruikbaar op desktop, tablet en mobiel
- Gebruik van responsive TailwindCSS
- Touch-friendly interface op mobiele apparaten

#### NFR-07: Toegankelijkheid
- WCAG 2.1 niveau AA compliance
- Keyboard navigatie mogelijk
- Screen reader compatible
- Voldoende kleurcontrast

### 3.4 Onderhoudbaarheid

#### NFR-08: Code Kwaliteit
- TypeScript voor type safety
- ESLint voor code quality
- Consistent code formatting (Prettier)
- Modulaire architectuur (Clean Architecture)

#### NFR-09: Testing
- Minimaal 70% code coverage
- Unit tests voor business logic
- Integration tests voor API endpoints
- Component tests voor UI

#### NFR-10: Documentatie
- Code is voorzien van JSDoc comments
- API endpoints zijn gedocumenteerd
- README met installatie-instructies
- Architecture Decision Records (ADR)

---

## 4. Testplan

### 4.1 Teststrategie

Het testen van Keuzekompas volgt een multi-layer benadering:
1. **Unit Tests**: Testen van individuele functies en componenten
2. **Integration Tests**: Testen van API endpoints en database interacties
3. **Component Tests**: Testen van React componenten
4. **End-to-End Tests**: Testen van complete gebruikersflows
5. **Manual Testing**: Exploratory testing en UX validatie

### 4.2 Unit Tests

#### UT-01: User Entity
**Doel**: Valideren van User entity structuur en validatie

**Testgevallen**:
- User object kan worden aangemaakt met geldige data
- Verplichte velden worden gevalideerd
- Email formaat validatie
- Password hash wordt correct opgeslagen
- Default role wordt correct toegewezen

#### UT-02: Module Entity
**Doel**: Valideren van Module entity structuur

**Testgevallen**:
- Module object met alle vereiste velden
- Validatie van periode (numeriek)
- Validatie van duur (numeriek)
- Validatie van niveau (toegestane waarden)
- Validatie van taal codes

#### UT-03: Password Hasher Service
**Doel**: Testen van wachtwoord hashing functionaliteit

**Testgevallen**:
- Wachtwoord wordt correct gehashed
- Hash is verschillend van origineel wachtwoord
- Zelfde wachtwoord produceert verschillende hashes (salt)
- Wachtwoord verificatie werkt correct
- Foutieve wachtwoorden worden geweigerd

#### UT-04: JWT Service
**Doel**: Testen van JWT token generatie en verificatie

**Testgevallen**:
- Token wordt correct gegenereerd met payload
- Token kan worden geverifieerd
- Verlopen token wordt gedetecteerd
- Ongeldige token wordt geweigerd
- Token bevat correcte claims (userId, role)

### 4.3 Integration Tests

#### IT-01: User Registration Flow
**Doel**: Testen van complete registratie flow

**Testgevallen**:
1. POST /api/users/register met geldige data
   - Verwacht: 201 Created, user in database
2. POST /api/users/register met bestaande email
   - Verwacht: 409 Conflict
3. POST /api/users/register met ongeldige email
   - Verwacht: 400 Bad Request
4. POST /api/users/register zonder verplichte velden
   - Verwacht: 400 Bad Request

#### IT-02: User Login Flow
**Doel**: Testen van authenticatie proces

**Testgevallen**:
1. POST /api/users/login met correcte credentials
   - Verwacht: 200 OK, JWT token in response
2. POST /api/users/login met fout wachtwoord
   - Verwacht: 401 Unauthorized
3. POST /api/users/login met onbekende email
   - Verwacht: 401 Unauthorized
4. Gebruik van verkregen token voor protected endpoint
   - Verwacht: Toegang verleend

#### IT-03: Module CRUD Operations
**Doel**: Testen van module beheer endpoints

**Testgevallen**:
1. GET /api/modules - Ophalen alle modules
   - Verwacht: 200 OK, array van modules
2. GET /api/modules/:id - Ophalen specifieke module
   - Verwacht: 200 OK, module details
3. POST /api/modules - Aanmaken module (als admin)
   - Verwacht: 201 Created
4. POST /api/modules - Aanmaken zonder admin rechten
   - Verwacht: 403 Forbidden
5. PUT /api/modules/:id - Update module (als admin)
   - Verwacht: 200 OK
6. DELETE /api/modules/:id - Verwijderen module (als admin)
   - Verwacht: 204 No Content

#### IT-04: Favorites Management
**Doel**: Testen van favorieten functionaliteit

**Testgevallen**:
1. POST /api/users/favorites - Toevoegen favoriet
   - Verwacht: Module toegevoegd aan user.favorites
2. GET /api/users/profile - Favorieten in profiel
   - Verwacht: Lijst met favoriete modules
3. DELETE /api/users/favorites/:id - Verwijderen favoriet
   - Verwacht: Module verwijderd uit favorites

### 4.4 Component Tests

#### CT-01: LoginPage Component
**Doel**: Testen van login formulier interactie

**Testgevallen**:
- Formulier rendert correct
- Email en wachtwoord velden zijn aanwezig
- Submit button activeert login functie
- Validatie errors worden getoond
- Bij succesvolle login: redirect naar home
- Loading state tijdens API call

#### CT-02: RegisterPage Component
**Doel**: Testen van registratie formulier

**Testgevallen**:
- Alle formuliervelden renderen
- Formulier validatie werkt
- Submit activeert registratie
- Success message bij succesvolle registratie
- Error handling bij API fouten

#### CT-03: ModulesPage Component
**Doel**: Testen van modules overzicht

**Testgevallen**:
- Modules lijst wordt geladen en getoond
- Loading state tijdens data fetch
- Error state bij API fouten
- Modules zijn klikbaar naar detail pagina
- Zoek/filter functionaliteit (indien aanwezig)

#### CT-04: ModuleFormPage Component
**Doel**: Testen van module aanmak/bewerk formulier

**Testgevallen**:
- Formulier rendert met alle velden
- Validatie op verplichte velden
- Create mode: leeg formulier
- Edit mode: vooringevulde data
- Submit slaat data op
- Alleen toegankelijk voor admins

#### CT-05: ProfilePage Component
**Doel**: Testen van gebruikersprofiel

**Testgevallen**:
- Gebruikersgegevens worden getoond
- Favoriete modules lijst wordt gerenderd
- Protected route: redirect als niet ingelogd

### 4.5 End-to-End Tests

#### E2E-01: Complete User Journey - Student
**Scenario**: Nieuwe student registreert, zoekt modules en markeert favorieten

**Stappen**:
1. Open applicatie
2. Navigeer naar registratie
3. Vul registratieformulier in
4. Bevestig succesvolle registratie
5. Login met nieuwe credentials
6. Bekijk modules overzicht
7. Open module detail pagina
8. Markeer module als favoriet
9. Ga naar profiel
10. Verifieer favoriet is toegevoegd
11. Logout

**Verwacht resultaat**: Complete flow werkt zonder errors

#### E2E-02: Admin Module Management
**Scenario**: Admin beheert modules

**Stappen**:
1. Login als admin
2. Navigeer naar module beheer
3. Klik "Nieuwe Module"
4. Vul module formulier in
5. Sla module op
6. Verifieer module in lijst
7. Bewerk module
8. Sla wijzigingen op
9. Verifieer updates
10. Verwijder module
11. Bevestig verwijdering

**Verwacht resultaat**: Alle CRUD operaties werken correct

#### E2E-03: Authorization Flow
**Scenario**: Toegangscontrole wordt afgedwongen

**Stappen**:
1. Probeer admin pagina te openen zonder login
   - Verwacht: Redirect naar login
2. Login als normale gebruiker
3. Probeer admin pagina te openen
   - Verwacht: Access denied / redirect
4. Logout en login als admin
5. Open admin pagina
   - Verwacht: Toegang verleend

### 4.6 Security Tests

#### ST-01: Authentication Security
**Testgevallen**:
- Wachtwoord is niet zichtbaar in responses
- JWT token bevat geen gevoelige data
- Expired tokens worden geweigerd
- Brute force protection (rate limiting)

#### ST-02: Authorization Security
**Testgevallen**:
- Normale gebruiker kan geen admin endpoints aanroepen
- Gebruiker kan alleen eigen profiel bekijken
- CORS is correct geconfigureerd
- XSS protection is actief

#### ST-03: Input Validation
**Testgevallen**:
- SQL/NoSQL injection poging wordt geblokkeerd
- XSS scripts in input worden gesanitized
- Oversized payloads worden geweigerd
- Malformed JSON wordt correct afgehandeld

### 4.7 Performance Tests

#### PT-01: Load Testing
**Doel**: Valideren van systeem onder belasting

**Testgevallen**:
- 50 gelijktijdige gebruikers kunnen inloggen
- Modules lijst laadt binnen 2 seconden bij 1000 modules
- Database queries zijn geoptimaliseerd (geen N+1 queries)
- Memory leaks test bij langdurig gebruik

#### PT-02: API Performance
**Testgevallen**:
- GET /api/modules response tijd < 500ms
- POST /api/users/login response tijd < 300ms
- Database connection pooling werkt correct

### 4.8 Usability Tests

#### UT-01: User Experience
**Doel**: Valideren van gebruiksvriendelijkheid

**Testgevallen**:
- Nieuwe gebruiker kan registreren zonder hulp
- Navigatie is intuïtief
- Error messages zijn duidelijk
- Success feedback is zichtbaar
- Mobile experience is gebruiksvriendelijk

#### UT-02: Accessibility
**Testgevallen**:
- Keyboard navigatie werkt volledig
- Screen reader kan pagina's voorlezen
- Kleurcontrast voldoet aan WCAG 2.1 AA
- Focus indicators zijn zichtbaar
- Alt teksten zijn aanwezig bij afbeeldingen

### 4.9 Browser Compatibility Tests

**Browsers om te testen**:
- Chrome (laatste 2 versies)
- Firefox (laatste 2 versies)
- Safari (laatste 2 versies)
- Edge (laatste 2 versies)

**Mobiele browsers**:
- Safari iOS (laatste versie)
- Chrome Android (laatste versie)

### 4.10 Test Deliverables

#### Documentatie
- Test reports per test suite
- Code coverage reports (minimaal 70%)
- Bug reports en fixes
- Test automation scripts

#### Tools
- Vitest voor unit en integration tests
- Testing Library voor component tests
- Coverage reports (Vitest Coverage)
- CI/CD pipeline met automated tests

### 4.11 Test Schedule

**Fase 1 - Unit Tests** (Week 1-2)
- Implementatie van alle unit tests
- Target: 80% coverage voor business logic

**Fase 2 - Integration Tests** (Week 2-3)
- API endpoint tests
- Database integration tests
- Target: Alle endpoints getest

**Fase 3 - Component Tests** (Week 3-4)
- React component tests
- User interaction tests
- Target: Alle pages en components getest

**Fase 4 - E2E Tests** (Week 4-5)
- Critical user journeys
- Cross-browser testing
- Performance testing

**Fase 5 - Security & Manual Testing** (Week 5-6)
- Security audit
- Manual exploratory testing
- Usability testing
- Bug fixing

### 4.12 Acceptance Criteria

Het systeem wordt geaccepteerd als:
1. Alle functionele requirements zijn geïmplementeerd
2. Minimaal 70% code coverage is bereikt
3. Alle kritieke bugs zijn opgelost
4. Security tests zijn geslaagd
5. Performance eisen worden gehaald
6. Usability tests tonen positieve resultaten
7. Browser compatibility is gevalideerd

### 4.13 Risk Management

**Hoge Risico's**:
- Database performance bij grote datasets
  - Mitigatie: Indexing, paginering, caching
- Security vulnerabilities
  - Mitigatie: Security audit, automated scanning
- Browser incompatibiliteit
  - Mitigatie: Early cross-browser testing

**Medium Risico's**:
- API response tijden
  - Mitigatie: Performance monitoring, optimization
- User adoption
  - Mitigatie: Usability testing, user feedback

---

## 5. Conclusie

Dit document definieert de requirements en testplan voor de Keuzekompas applicatie. Door systematisch alle functionele en niet-functionele requirements te testen, waarborgen we een kwalitatief hoogstaand, veilig en gebruiksvriendelijk systeem voor het beheren en selecteren van onderwijsmodules.

De test-driven benadering zorgt voor:
- Hoge code kwaliteit
- Vroege detectie van bugs
- Betere onderhoudbaarheid
- Vertrouwen in deployments
- Documentatie van verwacht gedrag

Bij vragen of aanpassingen aan dit document, neem contact op met het ontwikkelteam.

---

**Document Versie**: 1.0
**Datum**: 19 oktober 2025
**Status**: Definitief
