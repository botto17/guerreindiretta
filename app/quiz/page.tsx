import Header from '@/components/Header'
import QuizFlow from '@/components/QuizFlow'

export const metadata = {
    title: 'Quiz di Geopolitica | GuerreInDiretta',
    description: 'Mettiti alla prova su alleanze strategiche, crisi militari e colli di bottiglia globali. 10 domande per scoprire il tuo reale grado di preparazione.',
}

export default function QuizPage() {
    return (
        <div className="min-h-screen bg-[#FDFBF7]">
            <Header />
            <main>
                <QuizFlow />
            </main>
        </div>
    )
}
