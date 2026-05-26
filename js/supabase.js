import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm'

const supabaseUrl = 'https://zijftchlcklcqjaelwed.supabase.co';
const supabaseKey = 'sb_publishable_Idxi5EPot74T54_5DqJz8g_evYzUSkL';

export const supabase = createClient(supabaseUrl, supabaseKey);

const GEMINI_API_KEY = 'AIzaSyDKRZFkysNrjL_kFXGshMEMyRiv-ndeRbs';
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
        console.log(`Chamando Gemini API (modelo: ${MODELO})...`);
        
        const resposta = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        
        if (!resposta.ok) {
            const erro = await resposta.json();
            console.error('Erro detalhado:', erro);
            
            let mensagemErro = '';
            if (erro.error && erro.error.message) {
                mensagemErro = erro.error.message;
            } else {
                mensagemErro = `HTTP ${resposta.status}: ${resposta.statusText}`;
            }
            
            throw new Error(mensagemErro);
        }
        
        const dados = await resposta.json();
        
        if (dados.candidates && dados.candidates[0] && dados.candidates[0].content) {
            const textoCompleto = dados.candidates[0].content.parts[0].text;
            console.log(`Resposta recebida com aproximadamente ${textoCompleto.length} caracteres`);
            return textoCompleto;
        } else {
            throw new Error('Resposta inválida da API');
        }
        
    } catch (erro) {
        console.error('Erro Gemini:', erro);
        throw new Error(`Gemini: ${erro.message}`);
    }
}

export async function testarIA() {
    try {
        const resposta = await chamarGemini("Diga 'Gemini funcionando' em português", 0.5);
        console.log('Teste bem sucedido:', resposta);
        return { sucesso: true, resposta: resposta.substring(0, 100) };
    } catch (erro) {
        console.error('Teste falhou:', erro);
        return { sucesso: false, erro: erro.message };
    }
}