'use server'

import { supabase } from '@/lib/supabase'

export async function subscribeToNewsletter(email: string) {
    try {
        // Validate email format basic check
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(email)) {
            return { success: false, error: 'Indirizzo email non valido.' }
        }

        // Insert into newsletter_subscribers
        const { error } = await supabase
            .from('newsletter_subscribers')
            .insert([{ email, source: 'quiz' }])

        if (error) {
            if (error.code === '23505') {
                // Unique violation (email already exists)
                return { success: true, message: 'Bentornato! Abbiamo aggiornato il tuo profilo.' }
            }
            console.error('Newsletter error:', error)
            return { success: false, error: 'Si è verificato un errore durante l\'iscrizione. Riprova più tardi.' }
        }

        return { success: true }
    } catch (err) {
        console.error('Newsletter exception:', err)
        return { success: false, error: 'Errore di connessione al database.' }
    }
}
