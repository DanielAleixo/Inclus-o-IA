import { supabase } from '../supabase.js';

async function checarSessao() {
    const info = document.getElementById('user-details');
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
        info.innerHTML = `
            <p><strong>Usuário Autenticado:</strong> ${user.email}</p>
            <p><strong>ID do Token de Segurança:</strong> ${user.id}</p>
            <p><strong>Último Acesso Registrado:</strong> ${new Date(user.last_sign_in_at).toLocaleString('pt-BR')}</p>
        `;
    } else {
        info.innerHTML = "<p style='color:red;'>Nenhuma sessão segura detectada no front-end.</p>";
    }
}

checarSessao();