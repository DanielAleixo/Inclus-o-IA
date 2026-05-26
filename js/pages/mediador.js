import { chamarGemini, testarIA } from '../supabase.js';
import { gerenciarMenu } from '../navegacao.js';

gerenciarMenu('mediador');

const box = document.getElementById('box-chat-mediador');
const btn = document.getElementById('btn-mediador-ia');

async function testarConexaoIA() {
    const resultado = await testarIA();
    if (resultado.sucesso) {
        box.innerHTML += `<div style="margin: 5px 0; padding: 8px; background: #d4edda; border-radius: 5px;"><strong>✅ Sistema:</strong> Gemini conectado e pronto para ajudar!</div>`;
    } else {
        box.innerHTML += `<div style="margin: 5px 0; padding: 8px; background: #f8d7da; border-radius: 5px;"><strong>❌ Sistema:</strong> ${resultado.erro}</div>`;
    }
    box.scrollTop = box.scrollHeight;
}

testarConexaoIA();

async function chamarGeminiMediador(crise) {
    const promptSistema = `Você é um Analista do Comportamento Aplicada (ABA) especializado em ambiente escolar. Forneça orientações de manejo de crise e suporte imediatas, curtas, calmas e fáceis de aplicar em sala de aula para a seguinte situação de crise ou comportamento: ${crise}`;
    
    return await chamarGemini(promptSistema, 0.7);
}

document.getElementById('form-busca-inteligente').addEventListener('submit', async (e) => {
    e.preventDefault();
    const inp = document.getElementById('query-mediador');
    const txt = inp.value;

    box.innerHTML += `<p><strong>Você (Mediador):</strong> ${txt}</p>`;
    box.scrollTop = box.scrollHeight;
    inp.value = "";

    btn.disabled = true;
    btn.textContent = "Buscando Conduta...";

    try {
        const condutaABA = await chamarGeminiMediador(txt);
        box.innerHTML += `<p style="color: var(--roxo-foco);"><strong>InclusãoIA (Gemini - Manejo ABA):</strong><br>${condutaABA.replace(/\n/g, '<br>')}</p>`;
    } catch (erro) {
        console.error(erro);
        box.innerHTML += `<p style="color: var(--vermelho-alerta);"><strong>Erro na IA:</strong> ${erro.message}</p>`;
    } finally {
        btn.disabled = false;
        btn.textContent = "Consultar";
        box.scrollTop = box.scrollHeight;
    }
});