import { supabase } from '../supabase.js';
import { gerenciarMenu } from '../navegacao.js';

gerenciarMenu('qualquer');

const feed = document.getElementById('mural-posts-reddit');

async function montarMural() {
    const { data } = await supabase.from('forum_comunidade').select('*').order('id', { ascending: false });
    if (!data || data.length === 0) {
        feed.innerHTML = "<p style='color: var(--texto-suave);'>Sem novidades no mural da comunidade.</p>";
        return;
    }
    feed.innerHTML = "";
    data.forEach(p => {
        const upvotes = Math.floor(Math.random() * 20) + 1;
        feed.innerHTML += `
            <div style="background:#fff; border:1px solid var(--borda); padding:20px; margin-bottom:16px; border-radius:8px; box-shadow:var(--sombra)">
                <h4>📌 ${p.titulo_postagem}</h4>
                <p style="margin:10px 0; color:var(--texto-escuro);">${p.conteudo_relato.replace(/\n/g, '<br>')}</p>
                <div style="display:flex; gap:15px; font-size:0.85rem; color:var(--texto-suave); align-items:center;">
                    <button onclick="alert('Upvoted!')" style="padding:4px 8px; background:#f1f5f9; font-size:0.8rem; color:var(--texto-escuro)">🔼 Upvote (${upvotes})</button>
                    <span style="cursor:pointer;" onclick="this.nextElementSibling.style.display='block'">💬 Comentar</span>
                </div>
                <div style="display:none; margin-top:10px; border-top:1px dashed var(--borda); padding-top:10px;">
                    <input type="text" placeholder="Escreva uma resposta..." style="padding:6px; font-size:0.85rem; width:75%;">
                    <button onclick="alert('Comentário enviado!'); this.previousElementSibling.value='';" style="padding:6px 12px; font-size:0.85rem;">Enviar</button>
                </div>
            </div>`;
    });
}
montarMural();