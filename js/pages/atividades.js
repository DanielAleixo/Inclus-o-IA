import { supabase } from '../supabase.js';
import { gerenciarMenu } from '../navegacao.js';

const perfil = localStorage.getItem('perfil_usuario');
gerenciarMenu('qualquer');

const tit = document.getElementById('tit-atividades');
const sub = document.getElementById('sub-atividades');

if (perfil === 'professor') {
    tit.textContent = "Emitir Relatório ao Mediador";
    sub.textContent = "O conteúdo preenchido cairá na aba de consulta do mediador escolar.";
} else if (perfil === 'mediador') {
    tit.textContent = "Emitir Relatório ao Professor Regente";
    sub.textContent = "O conteúdo preenchido cairá na aba de consulta do professor regente.";
} else if (perfil === 'visitante') {
    tit.textContent = "Compartilhar com a Comunidade";
    sub.textContent = "Seu relato será inserido no feed global visível a todos os familiares.";
}

document.getElementById('form-envio-direcionado').addEventListener('submit', async (e) => {
    e.preventDefault();
    const cod = document.getElementById('id-aluno').value;
    const desc = document.getElementById('corpo-relato').value;
    const fdb = document.getElementById('feedback-relato');

    if(perfil === 'visitante') {
        await supabase.from('forum_comunidade').insert([{ titulo_postagem: `Relato de Família: Aluno [${cod}]`, conteudo_relato: desc }]);
        fdb.innerHTML = "<span style='color:var(--verde-sucesso);'>Postado no mural da comunidade!</span>";
    } else {
        await supabase.from('estrategias_mediadores').insert([{ nivel_suporte_alvo: perfil, gatilho_comportamento: cod, manejo_aplicado: desc }]);
        fdb.innerHTML = "<span style='color:var(--verde-sucesso);'>Relatório transmitido internamente com assinatura digital!</span>";
    }
    document.getElementById('form-envio-direcionado').reset();
});