export type QuizQuestion = {
    id: number
    question: string
    options: string[]
    correctIndex: number
    explanation: string
}

export const geopoliticsQuiz: QuizQuestion[] = [
    {
        id: 1,
        question: "Quale stretto strategico è spesso bloccato dalla milizia Houthi, con enormi impatti sul commercio globale?",
        options: [
            "Lo Stretto di Hormuz",
            "Il Canale di Panama",
            "Lo Stretto di Bab el-Mandeb",
            "Lo Stretto di Malacca"
        ],
        correctIndex: 2,
        explanation: "Bab el-Mandeb collega il Mar Rosso all'Oceano Indiano. È stato bersaglio degli Houthi dopo lo scoppio della guerra a Gaza nel 2023."
    },
    {
        id: 2,
        question: "Che cos'è la \"Nine-Dash Line\" (Linea dei Nove Tratti)?",
        options: [
            "Il confine smilitarizzato tra Corea del Nord e del Sud",
            "La rivendicazione territoriale della Cina sul Mar Cinese Meridionale",
            "Il trattato commerciale tra USA e Messico",
            "La linea di faglia geopolitica tra NATO e Russia"
        ],
        correctIndex: 1,
        explanation: "La Linea dei Nove Tratti è usata da Pechino per reclamare gran parte del Mar Cinese Meridionale, un'area ricca di risorse e cruciale per il commercio."
    },
    {
        id: 3,
        question: "Qual è il ruolo principale di TSMC, l'azienda taiwanese, nella geopolitica globale?",
        options: [
            "Costruisce navi da guerra per la marina del Pacifico",
            "Gestisce tutti i porti commerciali dell'Asia orientale",
            "È il principale estrattore mondiale di Terre Rare",
            "Produce la maggior parte dei microchip avanzati (semiconduttori) del mondo"
        ],
        correctIndex: 3,
        explanation: "TSMC ha un quasi-monopolio sui chip più avanzati (sotto i 5nm). Taiwan usa questo 'Scudo di Silicio' come deterrente per un'invasione."
    },
    {
        id: 4,
        question: "Quale Paese non fa parte dell'Alleanza 'AUKUS'?",
        options: [
            "Stati Uniti",
            "Giappone",
            "Regno Unito",
            "Australia"
        ],
        correctIndex: 1,
        explanation: "L'AUKUS (Australia, UK, US) è un'alleanza militare focalizzata sul Pacifico (per arginare la Cina), ma il Giappone non ne fa ufficialmente parte pur essendo alleato."
    },
    {
        id: 5,
        question: "Dopo il colpo di stato in Myanmar del 2021, chi guida politicamente l'opposizione e la resistenza civile?",
        options: [
            "Il Tatmadaw",
            "Il Governo di Unità Nazionale (NUG)",
            "L'Alleanza delle Tre Fratellanze",
            "L'ASEAN"
        ],
        correctIndex: 1,
        explanation: "Il NUG è stato formato dai parlamentari eletti destituiti dalla giunta militare ed è il braccio politico della ribellione."
    },
    {
        id: 6,
        question: "Quale regione africana ha vissuto un'ondata senza precedenti di colpi di stato militari anti-francesi negli ultimi anni?",
        options: [
            "Corno d'Africa",
            "Il Sahel",
            "Regione dei Grandi Laghi",
            "Maghreb"
        ],
        correctIndex: 1,
        explanation: "Il Sahel (Mali, Burkina Faso, Niger) ha visto giunte militari destituire governi civili e cacciare truppe occidentali, avvicinandosi spesso alla Russia."
    },
    {
        id: 7,
        question: "L'articolo 5 della carta della NATO stabilisce che...",
        options: [
            "I membri devono dedicare il 2% del PIL alla Difesa",
            "L'Alleanza non può operare in teatri extra-europei",
            "Hanno l'obbligo di possedere armi nucleari",
            "Un attacco armato contro un membro è un attacco contro tutti"
        ],
        correctIndex: 3,
        explanation: "L'Articolo 5 è il cuore della NATO: la difesa collettiva. È stato invocato una sola volta nella storia: dopo gli attacchi dell'11 settembre."
    },
    {
        id: 8,
        question: "Quale gruppo paramilitare russo, scioltosi/assorbito dallo stato, ha garantito operazioni di sicurezza per regimi in Africa?",
        options: [
            "Spetsnaz",
            "Gruppo Wagner",
            "FSB",
            "Battaglioni Ceceni"
        ],
        correctIndex: 1,
        explanation: "Il Gruppo Wagner (guidato dal defunto Prigozhin) è intervenuto in Siria, Libia, Repubblica Centrafricana e Mali."
    },
    {
        id: 9,
        question: "Cosa si intende per 'Ambiguità Strategica' della politica estera americana?",
        options: [
            "L'indecisione sul ritiro delle truppe dall'Afghanistan",
            "La riluttanza a supportare direttamente Israele o la Palestina",
            "L'uso di droni anonimi senza rivendicazione in Medio Oriente",
            "Il non dichiarare esplicitamente se difenderanno o meno Taiwan da un'invasione"
        ],
        correctIndex: 3,
        explanation: "Gli Stati Uniti vendono armi a Taiwan ma rimangono volontariamente 'ambigui' sull'invio di soldati americani in caso di guerra, per dissuadere sia Pechino che Taipei da mosse avventate."
    },
    {
        id: 10,
        question: "Nel contesto dei cartelli messicani, che cos'è specialmente letale e al centro dei rapporti diplomatici Messico-USA di oggi?",
        options: [
            "Il traffico del Fentanil",
            "Il Cartello di Medellin",
            "Il furto di petrolio governativo (huachicoleros)",
            "La privatizzazione delle armi"
        ],
        correctIndex: 0,
        explanation: "Il fentanil, oppiode sintetico, è la causa principale delle morti da overdose americane; quasi tutto viene trafficato dai cartelli messicani con precursori chimici cinesi."
    }
]
