import { supabase } from '../supabase.js';

document.getElementById('aluno-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const codigo_identificador = document.getElementById('codigo_identificador').value;
    const nivel_suporte_tea = document.getElementById('nivel_suporte').value;
    const hiperfoco_interesses = document.getElementById('hiperfoco').value;
    const statusMsg = document.getElementById('status-msg');

    const { error } = await supabase
        .from('alunos_anonimos')
        .insert([{ codigo_identificador, nivel_suporte_tea, hiperfoco_interesses }]);

    if (error) {
        statusMsg.style.color = 'red';
        statusMsg.textContent = "Erro ao cadastrar aluno: " + error.message;
    } else {
        statusMsg.style.color = 'green';
        statusMsg.textContent = "Aluno cadastrado com sucesso!";
        document.getElementById('aluno-form').reset();
        setTimeout(() => {
            statusMsg.textContent = "";
        }, 3000);
    }
});