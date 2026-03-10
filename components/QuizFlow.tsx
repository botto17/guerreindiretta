'use client'

import { useState } from 'react'
import { geopoliticsQuiz, QuizQuestion } from '@/lib/quiz-data'
import { subscribeToNewsletter } from '@/app/actions/newsletter'
import Link from 'next/link'

type QuizState = 'intro' | 'question' | 'email-wall' | 'results'

export default function QuizFlow() {
    const [state, setState] = useState<QuizState>('intro')
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0)
    const [answers, setAnswers] = useState<number[]>([])
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [errorMsg, setErrorMsg] = useState('')

    const currentQuestion = geopoliticsQuiz[currentQuestionIdx]

    const startQuiz = () => setState('question')

    const handleAnswer = (optionIdx: number) => {
        const newAnswers = [...answers, optionIdx]
        setAnswers(newAnswers)

        if (currentQuestionIdx < geopoliticsQuiz.length - 1) {
            setCurrentQuestionIdx(prev => prev + 1)
        } else {
            setState('email-wall')
        }
    }

    const handleEmailSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email) {
            setErrorMsg('Inserisci un indirizzo email.')
            return
        }

        setIsSubmitting(true)
        setErrorMsg('')

        const result = await subscribeToNewsletter(email)

        setIsSubmitting(false)

        if (result.success) {
            setState('results')
        } else {
            setErrorMsg(result.error || 'Errore imprevisto.')
        }
    }

    const calculateScore = () => {
        let score = 0
        answers.forEach((ans, idx) => {
            if (ans === geopoliticsQuiz[idx].correctIndex) {
                score++
            }
        })
        return score
    }

    const getLevel = (score: number) => {
        if (score < 4) return "Cittadino Disinformato"
        if (score < 7) return "Attento Osservatore"
        if (score < 9) return "Studente di Relazioni Internazionali"
        return "Esperto Analista Geopolitico"
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-16 sm:py-24 min-h-[70vh] flex flex-col justify-center">

            {state === 'intro' && (
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <h1 className="font-serif text-5xl font-black text-black mb-6 tracking-tight">
                        Il Quiz di Geopolitica
                    </h1>
                    <p className="font-serif text-xl text-gray-600 mb-10 leading-relaxed max-w-2xl mx-auto">
                        Mettiti alla prova su alleanze strategiche, crisi militari e colli di bottiglia globali. 10 domande per scoprire il tuo reale grado di preparazione.
                    </p>
                    <button
                        onClick={startQuiz}
                        className="bg-accent text-white font-sans text-sm font-bold uppercase tracking-wider px-10 py-5 transition-transform hover:scale-105"
                    >
                        Inizia la simulazione
                    </button>
                </div>
            )}

            {state === 'question' && currentQuestion && (
                <div className="animate-in fade-in zoom-in-95 duration-500">
                    <div className="flex justify-between items-center mb-8 border-b border-gray-200 pb-4">
                        <span className="font-sans text-sm font-bold text-gray-400 uppercase tracking-widest">
                            Domanda {currentQuestionIdx + 1} di {geopoliticsQuiz.length}
                        </span>
                        <div className="flex gap-1">
                            {geopoliticsQuiz.map((_, i) => (
                                <div
                                    key={i}
                                    className={`h-1.5 w-6 transition-colors duration-500 ${i <= currentQuestionIdx ? 'bg-accent' : 'bg-gray-200'}`}
                                />
                            ))}
                        </div>
                    </div>

                    <h2 className="font-serif text-3xl font-bold text-gray-900 leading-snug mb-10">
                        {currentQuestion.question}
                    </h2>

                    <div className="grid grid-cols-1 gap-4">
                        {currentQuestion.options.map((option, idx) => (
                            <button
                                key={idx}
                                onClick={() => handleAnswer(idx)}
                                className="w-full text-left font-serif text-lg text-gray-800 bg-white border-2 border-gray-100 p-6 transition-all duration-200 hover:border-black hover:bg-gray-50 hover:-translate-y-1 focus:outline-none"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 flex items-center justify-center border border-gray-300 rounded-full font-sans text-xs text-gray-500">
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span>{option}</span>
                                </div>
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {state === 'email-wall' && (
                <div className="text-center animate-in fade-in slide-in-from-bottom-8 duration-700 bg-gray-50 p-12 border border-gray-200">
                    <div className="w-16 h-16 bg-accent text-white rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h2 className="font-serif text-4xl font-bold text-black mb-4">
                        Calcolo dei risultati...
                    </h2>
                    <p className="font-serif text-lg text-gray-600 mb-8 max-w-xl mx-auto">
                        Hai completato il test. Inserisci la tua email per scoprire immediatamente il tuo punteggio, la classifica e iscriverti ai nostri aggiornamenti settimanali gratuiti (niente spam).
                    </p>

                    <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
                        <div className="flex flex-col sm:flex-row gap-3">
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                placeholder="La tua email..."
                                required
                                className="flex-grow border border-gray-300 font-sans px-4 py-3 focus:outline-none focus:border-black focus:ring-1 focus:ring-black"
                                disabled={isSubmitting}
                            />
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="bg-black text-white font-sans text-sm font-bold uppercase tracking-wider px-8 py-3 hover:bg-gray-800 transition-colors disabled:opacity-50 whitespace-nowrap"
                            >
                                {isSubmitting ? 'Attendi...' : 'Sblocca'}
                            </button>
                        </div>
                        {errorMsg && <p className="text-accent text-sm font-sans mt-3 text-left">{errorMsg}</p>}
                    </form>
                    <p className="text-xs text-gray-400 font-sans mt-6">
                        Inserendo l'email accetti di ricevere la nostra newsletter geopolitica.
                    </p>
                </div>
            )}

            {state === 'results' && (
                <div className="animate-in fade-in zoom-in duration-700">
                    <div className="text-center mb-12">
                        <span className="font-sans text-sm font-bold text-accent uppercase tracking-widest block mb-4">
                            Risultati del Test
                        </span>
                        <div className="text-8xl font-black font-sans tracking-tighter text-black mb-4">
                            {calculateScore()}<span className="text-4xl text-gray-300">/10</span>
                        </div>
                        <h2 className="font-serif text-3xl font-bold text-gray-900 mb-4">
                            Profilo: <span className="underline decoration-accent">{getLevel(calculateScore())}</span>
                        </h2>
                    </div>

                    <div className="space-y-6 mt-12 border-t border-gray-200 pt-12">
                        <h3 className="font-serif text-2xl font-bold mb-6">Analisi delle Risposte</h3>
                        {geopoliticsQuiz.map((q, idx) => {
                            const userAnswer = answers[idx]
                            const isCorrect = userAnswer === q.correctIndex

                            return (
                                <div key={q.id} className={`p-6 border-l-4 ${isCorrect ? 'border-green-500 bg-green-50' : 'border-accent bg-red-50'}`}>
                                    <h4 className="font-serif text-xl font-bold mb-3">
                                        {idx + 1}. {q.question}
                                    </h4>
                                    <div className="font-sans text-sm mb-4">
                                        <p className={`${isCorrect ? 'text-green-700 font-semibold' : 'text-gray-500 line-through'}`}>
                                            La tua risposta: {q.options[userAnswer]}
                                        </p>
                                        {!isCorrect && (
                                            <p className="text-green-700 font-semibold mt-1">
                                                Risposta corretta: {q.options[q.correctIndex]}
                                            </p>
                                        )}
                                    </div>
                                    <p className="font-serif text-gray-700 text-sm leading-relaxed bg-white/50 p-4 border border-gray-200/50">
                                        <span className="font-bold">Fact Check:</span> {q.explanation}
                                    </p>
                                </div>
                            )
                        })}
                    </div>

                    <div className="mt-12 text-center">
                        <Link href="/" className="inline-block bg-black text-white font-sans text-sm font-bold uppercase tracking-wider px-10 py-4 hover:bg-gray-800 transition-colors">
                            Torna alla Homepage
                        </Link>
                    </div>
                </div>
            )}
        </div>
    )
}
