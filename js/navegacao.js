import { supabase } from './supabase.js';

export async function gerenciarMenu(perfilEsperado) {
    const perfilLogado = localStorage.getItem('perfil_usuario');
    const userEmail = localStorage.getItem('user_email');
    
    if (!perfilLogado || !userEmail) {
        window.location.href = 'index.html';
        return;
    }
    
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        localStorage.removeItem('perfil_usuario');
        localStorage.removeItem('user_email');
        localStorage.removeItem('user_id');
        window.location.href = 'index.html';
        return;
    }

    if (perfilEsperado && perfilEsperado !== 'qualquer' && perfilLogado !== perfilEsperado) {
        alert("Acesso negado para o seu nível de perfil.");
        if (perfilLogado === 'professor') window.location.href = 'professor.html';
        else if (perfilLogado === 'mediador') window.location.href = 'mediador.html';
        else window.location.href = 'comunidade.html';
        return;
    }

    const menuContainer = document.getElementById('menu-navegacao');
    if (!menuContainer) return;

    const links = {
        comunidade: '<a href="comunidade.html" id="nav-comunidade">🌍 Comunidade</a>',
        fazerPei: '<a href="professor.html" id="nav-pei">📝 Fazer PEI</a>',
        consultarMediador: '<a href="insights.html" id="nav-consultar">🔍 Consultar Mediador</a>',
        consultarProfessor: '<a href="insights.html" id="nav-consultar">🔍 Consultar Professor</a>',
        relatar: '<a href="atividades.html" id="nav-relatar">📢 Relatar Ocorrência</a>',
        cadastrarAluno: '<a href="cadastrar_aluno.html" id="nav-cadastrar-aluno">➕ Cadastrar Aluno</a>',
        historicoPei: '<a href="historico_pei.html" id="nav-historico-pei">📚 Histórico PEI</a>',
        configuracoes: '<a href="configuracoes.html" id="nav-configuracoes">⚙️ Configurações</a>',
        sair: '<a href="#" style="color: var(--vermelho-alerta); float: right;" id="btn-logout-sistema">🚪 Sair</a>'
    };

    if (perfilLogado === 'professor') {
        menuContainer.innerHTML = `${links.comunidade} | ${links.fazerPei} | ${links.consultarMediador} | ${links.relatar} | ${links.cadastrarAluno} | ${links.historicoPei} | ${links.configuracoes} ${links.sair}`;
    } else if (perfilLogado === 'mediador') {
        menuContainer.innerHTML = `${links.comunidade} | ${links.consultarProfessor} | ${links.relatar} | ${links.configuracoes} ${links.sair}`;
    } else if (perfilLogado === 'visitante') {
        menuContainer.innerHTML = `${links.comunidade} | ${links.relatar} | ${links.configuracoes} ${links.sair}`;
    }

    const paginaAtual = window.location.pathname.split("/").pop();
    
    const destaques = {
        'professor.html': 'nav-pei',
        'insights.html': 'nav-consultar',
        'atividades.html': 'nav-relatar',
        'comunidade.html': 'nav-comunidade',
        'cadastrar_aluno.html': 'nav-cadastrar-aluno',
        'historico_pei.html': 'nav-historico-pei',
        'configuracoes.html': 'nav-configuracoes'
    };
    
    if (destaques[paginaAtual]) {
        const el = document.getElementById(destaques[paginaAtual]);
        if (el) {
            el.style.background = "var(--azul-suporte)";
            el.style.color = "white";
        }
    }

    const btnSair = document.getElementById('btn-logout-sistema');
    if (btnSair) {
        btnSair.addEventListener('click', async (e) => {
            e.preventDefault();
            await supabase.auth.signOut();
            localStorage.removeItem('perfil_usuario');
            localStorage.removeItem('user_email');
            localStorage.removeItem('user_id');
            window.location.href = 'index.html';
        });
    }
}