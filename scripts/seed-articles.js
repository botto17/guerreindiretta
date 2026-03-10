const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  'https://nxyscpgjvdwwebzubrgk.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im54eXNjcGdqdmR3d2VienVicmdrIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MzA1MTU3NywiZXhwIjoyMDg4NjI3NTc3fQ.TrT_dq3vslb5Dgdl2YDnp7hz23IGlJ00mR3Ww-SaeJM'
);

function slugify(text) {
  return text.toLowerCase()
    .replace(/[àáâã]/g, 'a').replace(/[èéêë]/g, 'e').replace(/[ìíîï]/g, 'i')
    .replace(/[òóôõ]/g, 'o').replace(/[ùúûü]/g, 'u')
    .replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
    .slice(0, 80).replace(/-$/, '');
}

// Unsplash images per conflict theme
const imagePool = {
  'Guerra Israele-Gaza-Iran': [
    'https://images.unsplash.com/photo-1591696205602-2f950c417cb9?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1542820229-081e0c12af0b?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1580418827493-f2b22c0a76cb?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1569025743873-ea3a9ber?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1517732306149-e8f829eb588a?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1623857584158-23c769acbe33?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1551033541-6232de67e tried?w=1200&h=630&fit=crop',
  ],
  'Guerra Russia-Ucraina': [
    'https://images.unsplash.com/photo-1569974507005-6dc61f97fb5c?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1608637046089-1af53fc727c2?w=1200&h=630&fit=crop',
  ],
  'Tensione Taiwan': [
    'https://images.unsplash.com/photo-1470004914212-05527e49370b?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1508433957232-3107f5fd5995?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?w=1200&h=630&fit=crop',
  ],
  'Guerra Civile Myanmar': [
    'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1547036967-23d11aacaee0?w=1200&h=630&fit=crop',
  ],
  '_default': [
    'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1572949645841-094f3a9c4c94?w=1200&h=630&fit=crop',
    'https://images.unsplash.com/photo-1580128637471-1339ce9ca3fa?w=1200&h=630&fit=crop',
  ]
};

function getImage(conflictName, idx) {
  const pool = imagePool[conflictName] || imagePool['_default'];
  return pool[idx % pool.length];
}

// ========== ARTICOLI IN ITALIANO ==========

const articleTemplates = {
  'Guerra Israele-Gaza-Iran': [
    {
      title: 'Gaza sotto assedio: la crisi umanitaria raggiunge livelli senza precedenti',
      subtitle: "L'offensiva militare israeliana provoca una catastrofe umanitaria nella Striscia di Gaza",
      body: `La Striscia di Gaza sta vivendo quella che le Nazioni Unite hanno definito la peggiore crisi umanitaria dal 2023. I bombardamenti israeliani, iniziati dopo l'attacco di Hamas del 7 ottobre 2023, hanno ridotto interi quartieri in macerie, lasciando centinaia di migliaia di civili senza accesso ad acqua, cibo e cure mediche.

## La situazione sul campo

Secondo le ultime stime dell'UNRWA, oltre 1,9 milioni di persone — quasi l'intera popolazione della Striscia — sono state sfollate almeno una volta. Gli ospedali funzionano a capacità ridotta, con scorte di medicinali praticamente esaurite. I corridoi umanitari, quando aperti, permettono il passaggio di una frazione degli aiuti necessari.

Le forze di difesa israeliane (IDF) continuano le operazioni terrestri nel nord di Gaza e nella zona centrale, affermando di colpire infrastrutture di Hamas. I tunnel sotterranei, che secondo l'intelligence israeliana si estendono per centinaia di chilometri, restano uno degli obiettivi prioritari.

## La dimensione regionale

Il conflitto ha assunto una dimensione regionale con il coinvolgimento di Hezbollah dal Libano e degli Houthi dallo Yemen. L'Iran, principale sostenitore di Hamas e Hezbollah, ha lanciato attacchi diretti contro Israele con droni e missili balistici, segnando un'escalation storica nei rapporti tra i due paesi.

Gli analisti temono che un ulteriore deterioramento delle relazioni tra Tehran e Tel Aviv possa innescare un conflitto su larga scala in Medio Oriente, con conseguenze devastanti per la stabilità dell'intera regione.

## La diplomazia in stallo

I negoziati per un cessate il fuoco procedono a rilento. L'Egitto e il Qatar, tradizionali mediatori, faticano a trovare un terreno comune tra le richieste israeliane — la liberazione degli ostaggi e lo smantellamento di Hamas — e quelle palestinesi, che includono il ritiro completo delle forze israeliane e la fine dell'assedio.

La comunità internazionale resta divisa: gli Stati Uniti mantengono il loro sostegno a Israele, mentre crescono le pressioni europee e del Sud Globale per un cessate il fuoco immediato e duraturo.`
    },
    {
      title: "Iran e Israele: il Medio Oriente sull'orlo di una guerra aperta",
      subtitle: 'Lo scambio di attacchi diretti tra Tehran e Tel Aviv segna una svolta storica',
      body: `Il lancio di centinaia di missili balistici iraniani contro il territorio israeliano ha segnato un punto di non ritorno nelle relazioni tra i due paesi. Per la prima volta nella storia, l'Iran ha attaccato direttamente Israele, superando decenni di guerra per procura condotta attraverso gruppi alleati come Hezbollah e Hamas.

## La nuova architettura del conflitto

La risposta israeliana non si è fatta attendere: raid aerei contro installazioni militari iraniane hanno colpito siti legati al programma missilistico e, secondo fonti non confermate, strutture connesse al programma nucleare. Il sistema di difesa antimissile Iron Dome, supportato dagli intercettori americani THAAD, ha dimostrato un'efficacia notevole ma non assoluta.

La deterrenza reciproca, che per decenni ha impedito uno scontro diretto, sembra essersi indebolita. Entrambi i paesi calcolano che l'escalation controllata sia preferibile alla percezione di debolezza, creando una spirale potenzialmente catastrofica.

## Le implicazioni per lo shipping globale

Gli Houthi yemeniti, alleati dell'Iran, continuano a colpire il traffico marittimo nel Mar Rosso e nel Golfo di Aden. Le compagnie di navigazione hanno deviato le rotte, allungando i tempi di consegna e aumentando i costi del commercio internazionale. Il Canale di Suez, arteria vitale dell'economia globale, vede un calo significativo dei transiti.

## Il ruolo delle potenze globali

Gli Stati Uniti hanno schierato portaerei e sottomarini nel Mediterraneo orientale e nel Golfo Persico, in un duplice messaggio di deterrenza verso l'Iran e rassicurazione verso Israele. La Russia, impegnata in Ucraina, osserva con interesse strategico, mentre la Cina — principale importatore di petrolio iraniano — cerca un equilibrio tra i suoi interessi economici e il mantenimento della stabilità regionale.`
    },
    {
      title: 'Hezbollah e il fronte libanese: la guerra dimenticata del nord di Israele',
      subtitle: 'Il conflitto al confine con il Libano ha sfollato centinaia di migliaia di persone su entrambi i lati',
      body: `Mentre gli occhi del mondo sono puntati su Gaza, il fronte settentrionale di Israele è teatro di una guerra parallela che ha trasformato il sud del Libano in una zona di combattimento attivo. Hezbollah, il movimento sciita libanese armato e finanziato dall'Iran, ha aperto un secondo fronte in solidarietà con Hamas, lanciando migliaia di razzi e droni contro il nord di Israele.

## L'escalation progressiva

Quello che era iniziato come uno scambio di tiri sporadici si è trasformato in un'offensiva su vasta scala. Gli attacchi di Hezbollah con missili anti-carro e droni d'attacco hanno colpito basi militari e centri abitati nel nord della Galilea. Israele ha risposto con bombardamenti massicci, prendendo di mira i centri di comando di Hezbollah a Beirut e nel sud del Libano.

La morte del leader di Hezbollah e di diversi comandanti militari in raid mirati ha decapitato la leadership del movimento, ma non ha fermato le ostilità. Il gruppo mantiene un arsenale stimato in oltre 100.000 razzi e missili, molti dei quali a guida di precisione forniti dall'Iran.

## La catastrofe umanitaria libanese

Il Libano, già prostrato da una devastante crisi economica e politica, si trova ad affrontare una nuova emergenza. Oltre un milione di persone sono state sfollate dalle regioni meridionali. I sobborghi a sud di Beirut, roccaforte tradizionale di Hezbollah, sono stati pesantemente bombardati, causando vittime civili e distruzioni ingenti.

## I tentativi di mediazione

La diplomazia internazionale lavora per evitare che il conflitto si allarghi ulteriormente. L'inviato speciale degli Stati Uniti ha intensificato le visite nella regione, cercando di negoziare un cessate il fuoco separato per il fronte libanese. Ma Hezbollah ha legato la fine delle ostilità a un accordo complessivo che includa Gaza, complicando enormemente i negoziati.`
    },
    {
      title: 'La Corte Internazionale di Giustizia e il caso Gaza: le implicazioni giuridiche',
      subtitle: "I pronunciamenti dell'Aja ridefiniscono il quadro legale del conflitto",
      body: `Le decisioni della Corte Internazionale di Giustizia (CIG) hanno introdotto una dimensione giuridica senza precedenti nel conflitto a Gaza. Le ordinanze provvisorie, che includono misure per prevenire il genocidio e garantire l'accesso degli aiuti umanitari, rappresentano un momento cruciale nel diritto internazionale.

## Le misure provvisorie

La CIG ha ordinato a Israele di prendere tutte le misure necessarie per prevenire atti genocidari a Gaza, pur senza pronunciarsi in modo definitivo sull'accusa di genocidio. La Corte ha inoltre richiesto di garantire l'accesso alla popolazione civile di forniture essenziali, inclusi cibo, acqua e medicinali.

Parallelamente, la Corte Penale Internazionale (CPI) ha emesso mandati di arresto per leader di entrambe le parti, un'azione senza precedenti che ha provocato reazioni diplomatiche significative.

## Le reazioni internazionali

La comunità internazionale si è divisa nettamente. I paesi del Sud Globale hanno accolto favorevolmente le decisioni della CIG, vedendole come un passo verso la responsabilizzazione delle potenze militari. Gli Stati Uniti hanno contestato la giurisdizione della corte, mentre l'Unione Europea ha assunto posizioni sfumate, riconoscendo l'autorità della CIG ma evitando prese di posizione nette.

## Le conseguenze pratiche

Sul piano pratico, le ordinanze della CIG hanno avuto un impatto limitato sulle operazioni militari israeliane. Tuttavia, hanno contribuito a modificare il dibattito pubblico internazionale, rendendo più difficile per i governi occidentali sostenere incondizionatamente la campagna militare israeliana senza affrontare le questioni relative al diritto internazionale umanitario.`
    },
  ],

  'Guerra Russia-Ucraina': [
    {
      title: 'Ucraina: la guerra di logoramento entra nella sua fase più critica',
      subtitle: 'Due anni dopo, il fronte orientale rimane il teatro di combattimenti feroci',
      body: `L'invasione russa dell'Ucraina, che nel febbraio 2024 ha compiuto due anni, si è trasformata in una guerra di posizione che ricorda i conflitti del secolo scorso. La linea del fronte, che si estende per oltre 1.200 chilometri dall'oblast di Kharkiv al Mar d'Azov, si muove di pochi chilometri alla volta, ma il costo in vite umane e risorse rimane devastante.

## Il fronte orientale

La Russia ha concentrato le sue forze intorno a Bakhmut, Avdiivka e altre città del Donbass, impiegando tattiche di assalto frontale che hanno provocato perdite enormi su entrambi i fronti. Le forze ucraine, dotate di armamenti occidentali sempre più sofisticati, mantengono una difesa attiva che combina posizioni fortificate con contrattacchi localizzati.

I droni sono diventati l'arma determinante di questo conflitto: sia come strumenti di ricognizione che come munizioni guidate a basso costo. L'Ucraina ha sviluppato una produzione domestica di droni FPV (First Person View) che le permette di colpire obiettivi russi con precisione chirurgica.

## L'economia di guerra

L'economia russa si è adattata alle sanzioni occidentali attraverso il riorientamento delle esportazioni verso Cina, India e Turchia. Il rublo si è stabilizzato, ma l'inflazione e la fuga di capitali umani — centinaia di migliaia di professionisti hanno lasciato il paese — pesano sulle prospettive a lungo termine.

L'Ucraina, dal canto suo, dipende in modo critico dagli aiuti occidentali, sia militari che economici. Il sostegno dell'Unione Europea e degli Stati Uniti, pur confermato, deve fare i conti con le pressioni interne e i cambiamenti politici nei paesi donatori.

## Le prospettive di negoziato

Le prospettive diplomatiche restano remote. La Russia insiste sul riconoscimento delle annessioni territoriali; l'Ucraina sulla restituzione di tutti i territori occupati, inclusa la Crimea. La comunità internazionale cerca formule creative, ma la distanza tra le posizioni delle parti rende qualsiasi compromesso estremamente difficile.`
    },
    {
      title: "L'offensiva invernale russa: droni, missili e la battaglia per l'energia ucraina",
      subtitle: "Mosca intensifica gli attacchi contro le infrastrutture energetiche dell'Ucraina",
      body: `Con l'arrivo dell'inverno, la Russia ha intensificato la sua campagna aerea contro le infrastrutture energetiche ucraine. Centrali elettriche, sottostazioni di trasformazione e reti di distribuzione del gas sono diventate obiettivi sistematici di ondate di attacchi con missili da crociera e droni iraniani Shahed.

## La strategia del freddo

L'obiettivo di Mosca è duplice: demoralizzare la popolazione civile ucraina e sovraccaricare le difese antiaeree di Kiev, costringendola a consumare le preziose scorte di munizioni per intercettori. Ogni singolo missile da crociera russo costa una frazione di ciò che costano i sistemi Patriot o NASAMS usati per abbatterlo.

Le conseguenze per i civili sono drammatiche: blackout prolungati, interruzioni del riscaldamento in pieno inverno e la necessità di evacuare interi quartieri. La resilienza della società ucraina, pur notevole, viene messa alla prova in modo sempre più duro.

## La risposta occidentale

I paesi NATO hanno intensificato le forniture di sistemi di difesa aerea, con la Germania che ha consegnato batterie IRIS-T e gli Stati Uniti che hanno accelerato le consegne di intercettori Patriot. Ma la domanda supera costantemente l'offerta, lasciando parti del paese vulnerabili.

L'Ucraina ha risposto anche con attacchi in profondità nel territorio russo, usando droni a lungo raggio di produzione domestica per colpire raffinerie di petrolio e depositi militari. Questi attacchi, pur di entità limitata, hanno un valore strategico: dimostrano la capacità ucraina di portare la guerra sul suolo russo.

## Il ruolo della Cina

La posizione della Cina rimane ambigua. Pechino fornisce alla Russia componenti tecnologici che alimentano la sua industria bellica, pur mantenendo una facciata di neutralità. La comunità europea ha intensificato le pressioni diplomatiche su questo punto, ma senza risultati concreti.`
    },
    {
      title: 'Le sanzioni contro la Russia: cosa ha funzionato e cosa no',
      subtitle: "Dopo due anni, un bilancio dell'efficacia delle misure economiche occidentali",
      body: `Le sanzioni occidentali contro la Russia rappresentano il regime di restrizioni economiche più ampio mai imposto a una grande potenza. A distanza di anni dall'inizio dell'invasione, il quadro della loro efficacia è complesso e sfumato, lontano sia dalle previsioni ottimistiche che da quelle catastrofiste.

## Cosa ha funzionato

Il congelamento delle riserve valutarie della banca centrale russa — circa 300 miliardi di euro — ha privato Mosca di un essenziale cuscinetto finanziario. L'esclusione dal sistema SWIFT ha complicato i pagamenti internazionali. Il tetto al prezzo del petrolio, coordinato dal G7, ha limitato le entrate statali, costringendo la Russia a vendere il suo greggio a forte sconto.

Il settore tecnologico russo ha subito un colpo durissimo: la carenza di semiconduttori, componenti elettronici e software occidentali ha rallentato la modernizzazione militare e industriale. Le aziende occidentali che hanno lasciato la Russia hanno portato con sé know-how e investimenti.

## Cosa non ha funzionato

La Russia ha dimostrato una capacità di adattamento superiore alle attese. Le esportazioni di gas e petrolio sono state riorientate verso l'Asia, in particolare Cina e India. Una rete di intermediari in paesi terzi — Turchia, Emirati Arabi, Kazakhstan — è stata costruita per aggirare le restrizioni commerciali.

L'industria bellica russa ha aumentato la produzione, compensando in parte le perdite di equipaggiamento al fronte. La società russa, sottoposta a controllo informativo serrato, non ha mostrato segnali significativi di protesta contro la guerra.

## Le sfide future

La questione dell'utilizzo dei beni russi congelati resta uno dei temi più dibattuti. L'Unione Europea ha trovato un compromesso tecnico utilizzando gli interessi maturati su tali fondi per finanziare la ricostruzione ucraina, ma la questione legale resta complessa e controversa.`
    },
  ],

  'Tensione Taiwan': [
    {
      title: 'Taiwan: il punto di rottura del Pacifico',
      subtitle: 'Le esercitazioni militari cinesi nello Stretto segnalano una nuova fase di tensione',
      body: `Lo Stretto di Taiwan, largo appena 130 chilometri nel suo punto più stretto, è diventato il punto focale della rivalità strategica tra Stati Uniti e Cina. Le esercitazioni militari cinesi intorno all'isola sono diventate sempre più frequenti e aggressive, simulando blocchi navali e operazioni anfibie.

## La pressione militare cinese

L'Esercito Popolare di Liberazione (PLA) ha condotto una serie di esercitazioni su larga scala che hanno coinvolto flotte navali, aerei da combattimento e forze missilistiche. Queste manovre, definite da Pechino come "pattugliamenti di routine", rappresentano in realtà una pressione militare senza precedenti sull'isola.

La Cina ha schierato nel teatro operativo la sua flotta più moderna, inclusa la portaerei Fujian di ultima generazione, e missili balistici DF-21D e DF-26, progettati specificamente per colpire navi da guerra nemiche. La dottrina Anti-Access/Area Denial (A2/AD) cinese mira a rendere troppo rischioso per la marina americana intervenire nello Stretto.

## Il fattore semiconduttori

Taiwan produce circa il 90% dei semiconduttori più avanzati al mondo attraverso TSMC, un'azienda che è diventata una delle più strategiche del pianeta. Un conflitto che interrompesse questa produzione avrebbe conseguenze catastrofiche per l'economia globale, paralizzando la produzione di smartphone, automobili, server e sistemi d'arma.

Questa "deterrenza del silicio" è uno dei fattori che rendono un'invasione estremamente costosa per la stessa Cina, che dipende anch'essa dai chip taiwanesi per la sua industria tecnologica.

## L'ambiguità strategica americana

Gli Stati Uniti mantengono la politica di "ambiguità strategica": non si impegnano esplicitamente a difendere Taiwan militarmente, ma lasciano intendere che lo farebbero. Questa postura è stata messa alla prova dalle dichiarazioni del presidente americano e dal rafforzamento della cooperazione militare con Taipei, incluse vendite di armi e addestramento.

Il Giappone, la Corea del Sud e l'Australia osservano con crescente preoccupazione, consapevoli che un conflitto nello Stretto coinvolgerebbe inevitabilmente le loro economie e la loro sicurezza.`
    },
    {
      title: 'La corsa ai semiconduttori: come Taiwan è diventata il centro del mondo',
      subtitle: "Il ruolo strategico dell'industria dei chip nell'isola contesa",
      body: `In un edificio ultramoderno nella città di Hsinchu, migliaia di ingegneri lavorano in camere bianche dove l'aria è mille volte più pulita di quella di una sala operatoria. Qui, TSMC — Taiwan Semiconductor Manufacturing Company — produce i chip più avanzati al mondo, quelli che alimentano iPhone, server di intelligenza artificiale e sistemi d'arma.

## Il monopolio tecnologico

La posizione dominante di Taiwan nell'industria dei semiconduttori non è un caso: è il risultato di decenni di investimenti strategici, formazione di talenti e politiche industriali mirate. TSMC detiene oltre il 60% del mercato globale della produzione di semiconduttori a contratto, e una quota ancora più elevata per i chip più avanzati con processi a 3 e 5 nanometri.

Nessun'altra azienda al mondo — né Samsung, né Intel — ha la capacità di produrre chip con la stessa qualità e allo stesso volume. Questa concentrazione di capacità produttiva in un'area geografica di pochi chilometri quadrati rappresenta una delle maggiori vulnerabilità dell'economia globale.

## La geopolitica dei chip

La consapevolezza di questa vulnerabilità ha spinto gli Stati Uniti a varare il CHIPS Act, un pacchetto da 52 miliardi di dollari per incentivare la produzione domestica di semiconduttori. TSMC sta costruendo fabbriche in Arizona, ma gli esperti avvertono che ci vorranno anni prima che possano raggiungere livelli di produzione significativi.

La Cina, dal canto suo, investe massicciamente nella sua industria nazionale dei semiconduttori. Tuttavia, nonostante anni di sforzi e centinaia di miliardi di dollari investiti, il divario tecnologico con Taiwan resta significativo, specialmente per i nodi di produzione più avanzati.

## Il paradosso della deterrenza

L'importanza strategica dei semiconduttori taiwanesi crea un paradosso: un'invasione cinese distruggerebbe probabilmente le stesse fabbriche che Pechino vorrebbe controllare. Questo "scudo di silicio" rappresenta una forma di deterrenza non convenzionale, ma la sua efficacia dipende dalla percezione di Pechino dei costi di un conflitto rispetto ai suoi obiettivi geopolitici di lungo termine.`
    },
  ],

  'Guerra Civile Myanmar': [
    {
      title: 'Myanmar: la resistenza avanza, la giunta militare vacilla',
      subtitle: 'Le forze di opposizione ottengono vittorie strategiche significative',
      body: `Il Myanmar vive il più profondo sconvolgimento dalla sua indipendenza. A tre anni dal colpo di stato militare del febbraio 2021, le forze di resistenza — una coalizione eterogenea di milizie etniche e gruppi pro-democrazia — hanno ottenuto una serie di vittorie militari che hanno ridisegnato la mappa del potere nel paese.

## L'Operazione 1027

L'offensiva lanciata nell'ottobre 2023 da una coalizione di tre gruppi armati etnici nel nord dello Shan State ha segnato un punto di svolta. L'Alleanza delle Tre Fratellanze — composta dall'Arakan Army, dal Myanmar National Democratic Alliance Army e dal Ta'ang National Liberation Army — ha conquistato decine di basi militari e postazioni di confine, infliggendo alla giunta la peggiore sconfitta dal colpo di stato.

Il successo dell'Operazione 1027 ha avuto un effetto domino: in tutto il paese, altri gruppi armati hanno intensificato le loro offensive, approfittando della crescente debolezza della giunta. Il Chin National Front, il Kachin Independence Army e il Karen National Liberation Army hanno ampliato il territorio sotto il loro controllo.

## La crisi della giunta

Il Consiglio di Amministrazione dello Stato (SAC), nome ufficiale della giunta, controlla ormai meno della metà del territorio nazionale. Le forze armate, il Tatmadaw, soffrono di problemi di morale, diserzione e difficoltà di reclutamento. La coscrizione forzata, introdotta nel 2024, ha provocato ondate di fughe all'estero.

L'economia birmana è in caduta libera: il kyat ha perso oltre l'80% del suo valore, l'inflazione galoppa e le rimesse dall'estero — vitali per milioni di famiglie — sono ostacolate dal collasso del sistema bancario.

## La dimensione internazionale

L'ASEAN si è dimostrata incapace di mediare efficacemente, limitandosi a dichiarazioni di principio senza conseguenze. La Cina, preoccupata per l'instabilità al suo confine meridionale, ha tentato un inserimento diplomatico per proteggere i suoi interessi economici, in particolare i corridoi commerciali e le pipeline energetiche che attraversano il territorio birmano.`
    },
  ],
};

// Articoli generici per conflitti senza template specifico
function generateGenericArticle(conflict, idx) {
  const templates = [
    {
      title: `${conflict.name}: aggiornamento sulla situazione attuale`,
      subtitle: `Analisi degli ultimi sviluppi nella crisi in ${conflict.region}`,
      body: `La situazione nella regione ${conflict.region} continua a evolversi rapidamente. Il conflitto ${conflict.name}, classificato con un livello di intensità "${conflict.intensity}", presenta dinamiche complesse che richiedono un'analisi approfondita.

## Gli sviluppi recenti

Le ultime settimane hanno visto un'intensificazione delle attività militari e diplomatiche legate al conflitto. Le fonti internazionali riportano movimenti significativi sul terreno che potrebbero ridefinire gli equilibri di forza nella regione.

La popolazione civile continua a pagare il prezzo più alto di questa crisi. Gli sfollamenti forzati, l'interruzione dei servizi essenziali e l'insicurezza alimentare rappresentano le emergenze più urgenti da affrontare.

## Il quadro diplomatico

I tentativi di mediazione internazionale proseguono, ma le distanze tra le parti in conflitto restano significative. Le organizzazioni regionali e le Nazioni Unite mantengono canali di comunicazione aperti, cercando di creare le condizioni per un dialogo costruttivo.

## Le prospettive

Gli analisti concordano nel ritenere che la risoluzione del conflitto richiederà un approccio multilaterale che tenga conto delle legittime esigenze di sicurezza di tutte le parti coinvolte, nonché dei diritti fondamentali della popolazione civile.`
    },
    {
      title: `Crisi ${conflict.region}: le dinamiche geopolitiche dietro il conflitto`,
      subtitle: `Un'analisi delle forze in gioco e degli interessi internazionali`,
      body: `Il conflitto in ${conflict.region} non può essere compreso senza analizzare le complesse dinamiche geopolitiche che lo alimentano. Dietro le linee del fronte si intrecciano interessi regionali e globali che rendono la situazione particolarmente intricata.

## Gli attori coinvolti

Le parti direttamente coinvolte nel conflitto rappresentano solo la superficie di una rete di alleanze e rivalità che si estende ben oltre i confini della regione. Le potenze regionali e globali sostengono, direttamente o indirettamente, le diverse fazioni, rendendo ogni tentativo di soluzione più complesso.

## Le risorse in gioco

Al centro di molti conflitti moderni ci sono questioni di accesso alle risorse naturali, controllo delle rotte commerciali e proiezione di influenza geopolitica. La regione ${conflict.region} non fa eccezione, con la sua posizione strategica e le sue risorse che attraggono l'attenzione di molteplici attori internazionali.

## La dimensione umanitaria

Nonostante la complessità geopolitica, è fondamentale non perdere di vista la dimensione umana del conflitto. Le comunità locali, intrappolate tra le linee del fronte, vivono in condizioni sempre più precarie, con un accesso limitato ai servizi essenziali e una costante minaccia alla propria sicurezza.`
    }
  ];
  return templates[idx % templates.length];
}

function generateSummary(conflict, newsItems) {
  const headlines = newsItems.slice(0, 10).map(n => n.title).join('; ');

  const summaryMap = {
    'Guerra Israele-Gaza-Iran': `Il conflitto tra Israele e Hamas, iniziato con l'attacco del 7 ottobre 2023, ha assunto dimensioni regionali con il coinvolgimento dell'Iran e di Hezbollah in Libano. L'offensiva militare israeliana a Gaza ha causato una devastante crisi umanitaria, con migliaia di vittime civili e lo sfollamento di oltre un milione di persone.\n\nLe trattative per un cessate il fuoco procedono a fasi alterne, con la mediazione di Egitto, Qatar e Stati Uniti. La tensione tra Israele e Iran ha raggiunto livelli critici, con scambi di attacchi diretti e indiretti che rischiano di trascinare l'intera regione in un conflitto più ampio.\n\nLa comunità internazionale è divisa: mentre gli Stati Uniti continuano a sostenere Israele, cresce la pressione diplomatica per una soluzione che tuteli la popolazione civile di Gaza. La Corte Internazionale di Giustizia ha emesso ordinanze provvisorie, segno della gravità della crisi.`,
    'Guerra Russia-Ucraina': `L'invasione russa dell'Ucraina, iniziata nel febbraio 2022, è entrata in una fase di stallo operativo con combattimenti intensi lungo la linea del fronte orientale. Le forze ucraine mantengono le posizioni difensive mentre conducono operazioni di contrattacco mirate.\n\nIl supporto occidentale all'Ucraina continua sotto forma di armamenti, addestramento e sostegno economico, anche se cresce il dibattito sulla sostenibilità a lungo termine. Le sanzioni contro la Russia hanno avuto un impatto significativo ma non decisivo sull'economia di Mosca.\n\nLe prospettive diplomatiche rimangono limitate, con entrambe le parti che mantengono posizioni ferme sui territori occupati. L'evoluzione del conflitto dipenderà dalla capacità delle forze ucraine di mantenere il momentum e dal livello di supporto internazionale.`,
    'Tensione Taiwan': `Le tensioni nello Stretto di Taiwan rimangono uno dei principali punti di attrito geopolitico a livello globale. La Cina continua ad aumentare la pressione militare sull'isola attraverso esercitazioni navali e aeree sempre più frequenti.\n\nGli Stati Uniti mantengono la politica di "ambiguità strategica" mentre rafforzano il supporto militare a Taiwan. Le recenti visite di funzionari americani e la vendita di armamenti hanno provocato reazioni dure da Pechino.\n\nIl rischio di un'escalation rimane concreto, con implicazioni potenzialmente devastanti per l'economia globale dato il ruolo cruciale di Taiwan nella produzione di semiconduttori.`,
    'Guerra Civile Myanmar': `Il Myanmar è in preda alla guerra civile dal colpo di stato militare del febbraio 2021. Le forze di resistenza, composte da milizie etniche e dal Governo di Unità Nazionale in esilio, hanno ottenuto significativi guadagni territoriali.\n\nLa junta militare perde progressivamente il controllo del territorio, mentre la popolazione civile continua a subire le conseguenze del conflitto con sfollamenti di massa e crisi umanitaria.`,
  };

  const keyFactsMap = {
    'Guerra Israele-Gaza-Iran': {
      parties: ['Israele (IDF)', 'Hamas', 'Hezbollah', 'Iran', 'Houthi'],
      startDate: '7 ottobre 2023',
      region: 'Medio Oriente (Gaza, Libano, Iran)',
      estimatedCasualties: 'Oltre 40.000 morti a Gaza, 1.200 in Israele',
      internationalActors: ['Stati Uniti', 'Egitto', 'Qatar', 'ONU', 'Corte Internazionale di Giustizia'],
      latestDevelopment: headlines.slice(0, 200)
    },
    'Guerra Russia-Ucraina': {
      parties: ['Russia', 'Ucraina', 'Repubbliche separatiste del Donbass'],
      startDate: '24 febbraio 2022',
      region: 'Europa Orientale (Ucraina)',
      estimatedCasualties: 'Centinaia di migliaia tra militari e civili',
      internationalActors: ['NATO', 'Stati Uniti', 'UE', 'Cina', 'Turchia'],
      latestDevelopment: headlines.slice(0, 200)
    },
    'Tensione Taiwan': {
      parties: ['Cina (PLA)', 'Taiwan (ROC)', 'Stati Uniti'],
      startDate: 'Tensione cronica, escalation dal 2022',
      region: 'Stretto di Taiwan, Pacifico occidentale',
      estimatedCasualties: 'Nessuna (tensione militare)',
      internationalActors: ['Stati Uniti', 'Giappone', 'Australia', 'AUKUS'],
      latestDevelopment: headlines.slice(0, 200)
    },
    'Guerra Civile Myanmar': {
      parties: ['Junta SAC', 'NUG/PDF', 'Milizie etniche (KIA, KNLA, AA)'],
      startDate: '1 febbraio 2021 (colpo di stato)',
      region: 'Sud-Est Asiatico (Myanmar)',
      estimatedCasualties: 'Oltre 5.000 morti, milioni di sfollati',
      internationalActors: ['ASEAN', 'Cina', 'India', 'ONU'],
      latestDevelopment: headlines.slice(0, 200)
    },
  };

  return {
    summary: summaryMap[conflict.name] || `Il conflitto ${conflict.name} nella regione ${conflict.region} continua a evolversi. L'intensità attuale è classificata come "${conflict.intensity}". Le fonti internazionali monitorano costantemente gli sviluppi.`,
    keyFacts: keyFactsMap[conflict.name] || {
      parties: ['In corso di identificazione'],
      startDate: 'Da determinare',
      region: conflict.region,
      estimatedCasualties: 'Dati non disponibili',
      internationalActors: ['ONU'],
      latestDevelopment: headlines.slice(0, 200) || 'Monitoraggio in corso'
    }
  };
}

async function seed() {
  console.log('--- CLEARING OLD ARTICLES ---');
  await supabase.from('articles').delete().neq('id', '00000000-0000-0000-0000-000000000000');
  console.log('Old articles deleted.\n');

  console.log('--- SEEDING ITALIAN ARTICLES WITH IMAGES ---\n');

  const { data: conflicts } = await supabase
    .from('conflicts')
    .select('*')
    .eq('active', true);

  if (!conflicts) { console.log('No conflicts'); return; }

  let totalArticles = 0;

  for (const conflict of conflicts) {
    const { data: news } = await supabase
      .from('news_items')
      .select('*')
      .eq('conflict_id', conflict.id)
      .order('published_at', { ascending: false });

    if (!news || news.length === 0) {
      console.log(`${conflict.name}: no news, skipping`);
      continue;
    }

    console.log(`\n${conflict.name}: ${news.length} news items`);

    // Get specific Italian articles or generate generic ones
    const specificArticles = articleTemplates[conflict.name] || [];
    const articlesToInsert = [];

    // Use specific Italian templates
    for (let i = 0; i < specificArticles.length; i++) {
      const art = specificArticles[i];
      // Spread dates across the news timeframe
      const dateIdx = Math.min(i * 3, news.length - 1);
      articlesToInsert.push({
        ...art,
        published_at: news[dateIdx]?.published_at || new Date().toISOString(),
        image_url: getImage(conflict.name, i),
        sources: news.slice(i * 2, i * 2 + 3).map(n => n.url).filter(Boolean),
      });
    }

    // Add generic if fewer than 2 specific articles
    if (specificArticles.length < 2) {
      for (let i = 0; i < 2; i++) {
        const generic = generateGenericArticle(conflict, i);
        const dateIdx = Math.min(i + specificArticles.length, news.length - 1);
        articlesToInsert.push({
          ...generic,
          published_at: news[dateIdx]?.published_at || new Date().toISOString(),
          image_url: getImage(conflict.name, specificArticles.length + i),
          sources: news.slice(i * 3, i * 3 + 3).map(n => n.url).filter(Boolean),
        });
      }
    }

    // Insert articles
    for (const art of articlesToInsert) {
      const slug = slugify(art.title) + '-' + Date.now().toString(36);
      const insertData = {
        conflict_id: conflict.id,
        title: art.title,
        subtitle: art.subtitle,
        body: art.body,
        sources: art.sources,
        published_at: art.published_at,
        slug,
      };
      // Try with image_url, if column doesn't exist it'll fail gracefully
      const { error } = await supabase.from('articles').insert({
        ...insertData,
        image_url: art.image_url,
      });

      if (error && error.message.includes('image_url')) {
        // Column doesn't exist, insert without it
        console.log('  (image_url column not available, inserting without)');
        const { error: err2 } = await supabase.from('articles').insert(insertData);
        if (err2) {
          console.log(`  ERR: ${err2.message}`);
        } else {
          console.log(`  OK: "${art.title.slice(0, 60)}..."`);
          totalArticles++;
        }
      } else if (error) {
        console.log(`  ERR: ${error.message}`);
      } else {
        console.log(`  OK: "${art.title.slice(0, 60)}..."`);
        totalArticles++;
      }

      await new Promise(r => setTimeout(r, 50));
    }

    // Update conflict summary and key_facts
    const { summary, keyFacts } = generateSummary(conflict, news);
    const { error: updateErr } = await supabase
      .from('conflicts')
      .update({ summary, key_facts: keyFacts, last_summary_update: new Date().toISOString() })
      .eq('id', conflict.id);

    if (updateErr) {
      console.log(`  ERR updating summary: ${updateErr.message}`);
    } else {
      console.log(`  Summary + key_facts updated`);
    }

    // Mark news as curated
    const ids = news.map(n => n.id);
    await supabase.from('news_items').update({ curated: true }).in('id', ids);
  }

  console.log(`\n--- DONE: ${totalArticles} articles created ---`);
}

seed();
