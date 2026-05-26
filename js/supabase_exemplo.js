// EXEMPLO - Copie este conteúdo para supabase.js
// e adicione sua chave API localmente

import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://zijftchlcklcqjaelwed.supabase.co';
const supabaseKey = 'sb_publishable_Idxi5EPot74T54_5DqJz8g_evYzUSkL';

export const supabase = createClient(supabaseUrl, supabaseKey);

// ⚠️ IMPORTANTE: Coloque sua chave REAL apenas no arquivo supabase.js
// Este é apenas um exemplo!
const GEMINI_API_KEY = 'COLE_SUA_CHAVE_AQUI';
const MODELO = 'gemini-2.5-flash';

export async function chamarGemini(prompt, temperatura = 0.7) {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODELO}:generateContent?key=${GEMINI_API_KEY}`;
    
    const payload = {
        contents: [{
            parts: [{ text: prompt }]
        }],
        generationConfig: {
            temperature: temperatura,
            maxOutputTokens: 60000,
            topP: 0.95,
            topK: 40
        }
    };
    
    try {
        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            throw new Error(erro.error?.message || `Erro ${resposta.status}`);
        }
        
        const dados = await resposta.json();
        return dados.candidates[0].content.parts[0].text;
        
    } catch (erro) {
        console.error('Erro Gemini:', erro);
        throw new Error(`Gemini: ${erro.message}`);
    }
}

export async function testarIA() {
    try {
        const resposta = await chamarGemini("Diga 'Gemini funcionando' em português", 0.5);
        return { sucesso: true, resposta: resposta.substring(0, 100) };
    } catch (erro) {
        return { sucesso: false, erro: erro.message };
    }
}