import { supabase } from '../supabase.js';
import { gerenciarMenu } from '../navegacao.js';

const perfil = localStorage.getItem('perfil_usuario') || 'visitante';
gerenciarMenu('qualquer');

const tit = document.getElementById('tit-consulta');
const sub = document.getElementById('sub-consulta');
const container = document.getElementById('caixa-mensagens-recebidas');

let alvoOrigem = perfil === 'professor' ? 'mediador' : 'professor';

if(perfil === 'professor') {
    tit.textContent = "Consulta de Feedbacks do Mediador";
    sub.textContent = "Histórico de comportamentos e manejos anotados pelo mediador em sala:";
} else {
    tit.textContent = "Consulta de Diretrizes do Professor Regente";
    sub.textContent = "Histórico de orientações e flexibilizações postadas pelo docente:";
}

async function carregarCaixa() {
    const { data } = await supabase.from('estrategias_mediadores').select('*').eq('nivel_suporte_alvo', alvoOrigem).order('id', {ascending: false});
    if(!data || data.length === 0) {
        container.innerHTML = "<p style='color:var(--texto-suave);'>Nenhuma mensagem nova nesta categoria.</p>";
        return;
    }
    container.innerHTML = "";
    data.forEach((item, idx) => {
        container.innerHTML += `
            <div style="background:#fff; border:1px solid var(--borda); padding:16px; margin-bottom:12px; border-radius:8px; box-shadow:var(--sombra)">
                <strong>Estudante Alvo: ${item.gatilho_comportamento}</strong>
                <p style="margin-top:5px;">${item.manejo_aplicado}</p>
                <br>
                <button class="btn-aprovar" style="background:var(--verde-sucesso); color:white; font-size:0.8rem; padding:6px 12px;">Aprovar e Publicar na Comunidade 🌍</button>
            </div>`;
    });

    document.querySelectorAll('.btn-aprovar').forEach((btn, idx) => {
        btn.addEventListener('click', async () => {
            await supabase.from('forum_comunidade').insert([{ titulo_postagem: `Compartilhado por Profissional — Aluno ${data[idx].gatilho_comportamento}`, conteudo_relato: data[idx].manejo_aplicado }]);
            alert("Aprovado e publicado na comunidade!");
        });
    });
}
carregarCaixa();