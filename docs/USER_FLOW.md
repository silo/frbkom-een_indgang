# FLOW for users creating a new event application

1. User login via MitID (OIDC authentication)
2. After login user is redirected to a welcome page with "Create New Event" button and list of "My Events"
3. User clicks "Create New Event" button and is taken to the multi-step form
4. There is 5 steps in the form, user can navigate back and forth between steps freely and data is auto saved on each action
5. On the last step user can review all data and confirm submission, if there is missing some fields it shows on the summary page so the user can go back and fill the rest out, until all is complete then user on summary page can confirm and review the data.
6. Then user is taken to a confirmation page showing that the event has been submitted and what the next steps are. User also get an email confirmation.



There is 5 steps:

### 1. Step : Kontaktoplysninger

#### 1.1 Generelle oplysninger
- CVR/CPR nummer - required ( input )
- Fulde navn - required ( input )
- Telefon - required ( input )
- Email - required ( input )
- Radio - Ja / Nej - "Arrangementet er kommercielt?" ( radiogroup )

### 1.2 Kontaktperson
- Fulde navn - required ( input )
- Telefon - required ( input )


### 2. Eventoplysninger

#### 2.1 Tidspunkt for event

- Dato og tid fra - required ( datepicker )
- Dato og tid til - required ( datepicker )
- Vælg sted (location) - required ( label + input/autocomplete)
  - Checkbox - "Egen adresse"
    - Input with autocomplete for address - required if "Egen adresse" is checked
  - Auto complete dropdown with list of predefined locations - required if "Egen adresse" is not checked

#### 2.2 Type af event
- List of badges - required - Multiple selection possible ( badges )
  - Festival
  - Cirkus
  - Motionsløb/cykelløb
  - Koncert
  - Mad- og loppemarked
  - Vejfest
  - Filmoptagelse
  - Optræden
  - Sport
  - Udstilling
  - Andet

#### 2.3 Om arrangementet
- Titel - required ( input)
- Formål - required ( textarea )
- Forventet antal deltagere - required ( Dropdown )
  - 0-50
  - 51-200
  - 201-500
  - 501-1000
  - 1001-5000
  - 5001+
- Vedhæft evt. relevant information ( PDF upload, max 5MB ) ( file upload )

#### 2.4 Tidspunkt for opsætning og nedtagning
- Dato og tid fra - required ( datepicker )
- Dato og tid til - required ( datepicker )

### 2.5 Er eventet tilbagevendende?
- Radio - Ja / Nej - required ( radiogroup )
  - If Ja: 
    - Hvor ofte? - Dropdown - required ( dropdown )
      - Dagligt
      - Ugentligt
      - Månedligt
      - Årligt
  - If Nej: No additional fields


### 3. Praktiske forhold og sikkerhed

#### 3.1 Brandforhold og midlertidige konstruktioner
- Hvor mange personer forventes samtidigt? - required ( dropdown )
  - 0-50
  - 51-200
  - 201-500
  - 501-1000
  - 1001-5000
  - 5001+
- Skal der opstilles midlertidige konstruktioner eller andet på pladsen? - required ( radiogroup )
  - Ja
    - Beskriv venligst hvilke konstruktioner og deres formål - required ( textarea )
    - Upload certifikat til din(e) konstruktion(er) her ( PDF upload, max 5MB ) - required ( file upload )
  - Nej
    - No additional fields

#### 3.2 Andre opmærksomhedspunkter
- Jeg tilkendegiver, at jeg har læst og forstået bilag 11 i BR18. - required ( radiogroup )
  - Ja
  - Nej
- Andre særlig hensyn - optional ( textarea )

#### 3.3 Arrangementsplan
- Vil du uploade din egen plan? - required ( radiogroup )
  - Ja
    - Upload din arrangementsplan her ( PDF upload, max 5MB ) - required ( file upload )
  - Nej
    - Map Grid planner vises her ( custom Vue 3 map planner component )

#### 3.4 Glade naboer - retningslinjer for lyd
- Afspilles der lyd fra højtalere eller lignende under arrangementet? - required ( radiogroup )
  - Ja
    - Beskriv type og lydstyrke (dB) - required ( textarea )
    - Kontaktoplysninger på lydansvarlig
      - Fulde navn - required ( input )
      - Telefonnummer - required ( input )
  - Nej
    - No additional fields


### 4. Tilladelser og drift

#### 4.1 Informationer om afspærring
- Forudsætter arrangementet afspærring af veje, fortov eller pladser, eller skal der opstilles container eller læsses af og på i forbindelse med arrangementet? - required ( radiogroup )
  - Ja
    - Oplys hvilke veje/fortov/pladser - required ( textarea )
  - Nej
    - No additional fields
- Er der søgt tilladelse hos Politi? - required ( radiogroup )
  - Ja
    - Upload godkendelse ( PDF upload, max 5MB ) - required ( file upload )
  - Nej
    - No additional fields

#### 4.2 Håndtering af affald
- Forventer du, at der er behov for affaldshåndtering under dit arrangement? - required ( radiogroup )
  - Ja
    - Beskriv, hvordan affaldet håndteres - required ( textarea )
  - Nej
    - No additional fields
- Er der salg/udlevering af mad- og drikkevarer? - required ( radiogroup )
  - Ja
    - Beskriv, hvad der sælges/udleveres så detaljeret som muligt - required ( textarea )
  - Nej
    - No additional fields


### 5. Opsummering og bekræftelse
If all fields are filled correctly, user can confirm and submit the event application.

### 5.1 Kontaktoplysninger
- Viser alle oplysninger fra Step 1 ( read-only summary )
### 5.2 Eventoplysninger
- Viser alle oplysninger fra Step 2 ( read-only summary )
### 5.3 Praktiske forhold og sikkerhed
- Viser alle oplysninger fra Step 3 ( read-only summary )
### 5.4 Tilladelser og drift
- Viser alle oplysninger fra Step 4 ( read-only summary )

if any required fields are missing or invalid, show error messages and do not allow submission until all is correct.
It shows which steps have missing/invalid fields so user can go back and fix them.
User can see how many percentage of the form is completed of each step.
