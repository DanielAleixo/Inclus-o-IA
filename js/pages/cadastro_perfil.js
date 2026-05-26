import { supabase } from '../supabase.js';

document.getElementById('cadastro-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const nome = document.getElementById('nome').value;
    const email = document.getElementById('email').value;
    const senha = document.getElementById('senha').value;
    const tipo_perfil = document.getElementById('tipo_perfil').value;
    const msg = document.getElementById('msg');

    const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: senha,
    });

    if (authError) {
        msg.style.color = 'red';
        msg.textContent = "Erro no Auth: " + authError.message;
        return;
    }

    const { error: dbError } = await supabase
        .from('perfis_usuarios')
        .insert([{ email, nome, tipo_perfil }]);

    if (dbError) {
        msg.style.color = 'red';
        msg.textContent = "Erro ao salvar perfil: " + dbError.message;
    } else {
        msg.style.color = 'green';
        msg.textContent = "Usuário cadastrado com sucesso! Prossiga para o Login.";
        document.getElementById('cadastro-form').reset();
        setTimeout(() => {
            window.location.href = 'index.html';
        }, 2000);
    }
});