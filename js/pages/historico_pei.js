import { supabase } from '../supabase.js';

async function renderizarHistorico() {
    const container = document.getElementById('lista-peis-db');
    
    const { data, error } = await supabase
        .from('peis_gerados')
        .select(`
            id,
            relato_inicial_simples,
            pei_tecnico_ia,
            data_criacao,
            alunos_anonimos ( codigo_identificador, nivel_suporte_tea )
        `)
        .order('data_criacao', { ascending: false });

    if (error) {
        container.innerHTML = `<p style="color:red;">Erro na varredura: ${error.message}</p>`;
        return;
    }

    if (data.length === 0) {
        container.innerHTML = "<p>Nenhum documento arquivado até o momento.</p>";
        return;
    }

    container.innerHTML = "";
    data.forEach(pei => {
        const div = document.createElement('div');
        div.style.border = "1px solid #444";
        div.style.padding = "15px";
        div.style.marginBottom = "15px";
        div.style.background = "#f9f9f9";
        div.style.borderRadius = "8px";
        
        div.innerHTML = `
            <h3>Estudante: ${pei.alunos_anonimos?.codigo_identificador || 'Anonimizado'}</h3>
            <p><strong>Classificação de Suporte:</strong> ${pei.alunos_anonimos?.nivel_suporte_tea || 'Não mapeado'}</p>
            <p><strong>Origem do Registro:</strong> <em>"${pei.relato_inicial_simples}"</em></p>
            <div style="background: #fff; padding: 10px; border: 1px solid #ccc; max-height:200px; overflow-y:scroll; border-radius: 5px;">${pei.pei_tecnico_ia.replace(/\n/g, '<br>')}</div>
            <br>
            <small>Data de Registro: ${new Date(pei.data_criacao).toLocaleString('pt-BR')}</small>
        `;
        container.appendChild(div);
    });
}

renderizarHistorico();