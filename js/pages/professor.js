import { supabase, chamarGemini, testarIA } from '../supabase.js';
import { gerenciarMenu } from '../navegacao.js';

gerenciarMenu('professor');

const selectAlunos = document.getElementById('aluno-select');
const chatBox = document.getElementById('historico-chat');
const peiView = document.getElementById('visualizacao-pei-live');
const btnGravar = document.getElementById('btn-gravar-resultado');
const btnVerCompleto = document.getElementById('btn-ver-completo');
const btnDownloadDocx = document.getElementById('btn-download-docx');
const btnDownloadTxt = document.getElementById('btn-download-txt');
const btnEnviar = document.getElementById('btn-enviar');
let rascunhoTECO = "";
let alunoNomeAtual = "";
let alunoNivelAtual = "";
let alunoHiperfocoAtual = "";

function limparHTMLdoTexto(texto) {
    const temporario = document.createElement('div');
    temporario.innerHTML = texto;
    return temporario.textContent || temporario.innerText || texto;
}

function abrirJanelaCompleta() {
    if (!rascunhoTECO) {
        alert("⚠️ Nenhum PEI gerado para visualizar!");
        return;
    }
    
    const htmlCompleto = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <title>PEI - ${alunoNomeAtual}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background: #f5f7fa;
            padding: 40px 20px;
            line-height: 1.6;
        }
        
        .container {
            max-width: 1000px;
            margin: 0 auto;
            background: white;
            border-radius: 16px;
            box-shadow: 0 10px 40px rgba(0,0,0,0.1);
            overflow: hidden;
        }
        
        .cabecalho {
            background: linear-gradient(135deg, #4f46e5, #3b82f6, #10b981);
            padding: 30px;
            color: white;
        }
        
        .cabecalho h1 {
            font-size: 28px;
            margin-bottom: 10px;
        }
        
        .cabecalho p {
            opacity: 0.9;
            font-size: 14px;
        }
        
        .info-aluno {
            background: #f0f4f8;
            padding: 20px 30px;
            border-left: 4px solid #3b82f6;
            margin: 20px;
            border-radius: 8px;
        }
        
        .info-aluno p {
            margin: 5px 0;
        }
        
        .info-aluno strong {
            color: #1e3a5f;
        }
        
        .conteudo {
            padding: 20px 30px;
        }
        
        .conteudo h1, .conteudo h2, .conteudo h3 {
            color: #1e3a5f;
            margin-top: 25px;
            margin-bottom: 15px;
        }
        
        .conteudo h3 {
            color: #3b82f6;
            border-bottom: 2px solid #e2e8f0;
            padding-bottom: 8px;
        }
        
        .conteudo strong {
            color: #1e3a5f;
            display: block;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 16px;
        }
        
        .conteudo ul, .conteudo ol {
            margin-left: 25px;
            margin-bottom: 15px;
        }
        
        .conteudo li {
            margin-bottom: 8px;
        }
        
        .conteudo p {
            margin-bottom: 12px;
        }
        
        .rodape {
            background: #f8fafc;
            padding: 20px 30px;
            text-align: center;
            border-top: 1px solid #e2e8f0;
            font-size: 12px;
            color: #64748b;
        }
        
        .botoes {
            display: flex;
            gap: 15px;
            padding: 20px 30px;
            background: #f8fafc;
            border-top: 1px solid #e2e8f0;
        }
        
        .btn {
            padding: 12px 24px;
            border: none;
            border-radius: 8px;
            cursor: pointer;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .btn-word {
            background: #2d6a4f;
            color: white;
        }
        
        .btn-word:hover {
            background: #1b4d3e;
        }
        
        .btn-txt {
            background: #1e6091;
            color: white;
        }
        
        .btn-txt:hover {
            background: #0f4a6e;
        }
        
        .btn-imprimir {
            background: #6c757d;
            color: white;
        }
        
        .btn-imprimir:hover {
            background: #545b62;
        }
        
        @media print {
            .botoes {
                display: none;
            }
            body {
                padding: 0;
                background: white;
            }
            .container {
                box-shadow: none;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="cabecalho">
            <h1>📋 Plano de Ensino Individualizado (PEI)</h1>
            <p>Documento gerado pelo sistema InclusãoIA</p>
        </div>
        
        <div class="info-aluno">
            <p><strong>👤 Aluno:</strong> ${alunoNomeAtual}</p>
            <p><strong>📊 Nível de Suporte:</strong> ${alunoNivelAtual}</p>
            <p><strong>🎯 Hiperfoco/Interesses:</strong> ${alunoHiperfocoAtual}</p>
            <p><strong>📅 Data de Geração:</strong> ${new Date().toLocaleString('pt-BR')}</p>
        </div>
        
        <div class="conteudo">
            ${rascunhoTECO.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
        </div>
        
        <div class="rodape">
            <p>Documento gerado pelo sistema InclusãoIA - Plataforma de Apoio à Educação Inclusiva</p>
            <p>Este documento é uma sugestão de plano e deve ser adaptado conforme a realidade do aluno e da escola.</p>
        </div>
        
        <div class="botoes">
            <button class="btn btn-word" onclick="baixarWord()">📥 Baixar como Word</button>
            <button class="btn btn-txt" onclick="baixarTxt()">📄 Baixar como Texto</button>
            <button class="btn btn-imprimir" onclick="window.print()">🖨️ Imprimir / Salvar PDF</button>
        </div>
    </div>
    
    <script>
        function baixarWord() {
            const conteudo = document.querySelector('.container').cloneNode(true);
            conteudo.querySelector('.botoes').remove();
            
            const html = \`<!DOCTYPE html>
            <html>
            <head>
                <meta charset="UTF-8">
                <title>PEI - ${alunoNomeAtual}</title>
                <style>
                    body {
                        font-family: 'Times New Roman', Arial, sans-serif;
                        margin: 2.54cm;
                        line-height: 1.5;
                        font-size: 12pt;
                    }
                    h1 { color: #1e3a5f; text-align: center; }
                    .info-aluno { background: #f0f4f8; padding: 10px; margin-bottom: 20px; }
                    .rodape { margin-top: 50px; text-align: center; font-size: 10pt; }
                </style>
            </head>
            <body>
                \${conteudo.innerHTML}
            </body>
            </html>\`;
            
            const blob = new Blob([html], { type: 'application/msword' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = 'PEI_${alunoNomeAtual.replace(/[^a-zA-Z0-9]/g, '_')}.doc';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
        
        function baixarTxt() {
            let texto = '';
            texto += '========================================\\n';
            texto += 'PLANO DE ENSINO INDIVIDUALIZADO (PEI)\\n';
            texto += '========================================\\n\\n';
            texto += 'Aluno: ${alunoNomeAtual}\\n';
            texto += 'Nível de Suporte: ${alunoNivelAtual}\\n';
            texto += 'Hiperfoco: ${alunoHiperfocoAtual}\\n';
            texto += 'Data: ${new Date().toLocaleString('pt-BR')}\\n';
            texto += '\\n----------------------------------------\\n\\n';
            
            const textoConteudo = document.querySelector('.conteudo').innerText;
            texto += textoConteudo;
            texto += '\\n\\n========================================\\n';
            texto += 'Documento gerado pelo sistema InclusãoIA\\n';
            texto += '========================================';
            
            const blob = new Blob([texto], { type: 'text/plain;charset=utf-8' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);
            link.href = url;
            link.download = 'PEI_${alunoNomeAtual.replace(/[^a-zA-Z0-9]/g, '_')}.txt';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        }
    </script>
</body>
</html>`;
    
    const novaJanela = window.open();
    novaJanela.document.write(htmlCompleto);
    novaJanela.document.close();
}

function gerarDocumentoWord() {
    const titulo = `PLANO DE ENSINO INDIVIDUALIZADO (PEI)`;
    const aluno = `Aluno: ${alunoNomeAtual}`;
    const data = `Data de Geração: ${new Date().toLocaleString('pt-BR')}`;
    const rodape = `Documento gerado pelo sistema InclusãoIA - Plataforma de Apoio à Educação Inclusiva`;
    
    let conteudoTexto = limparHTMLdoTexto(rascunhoTECO);
    
    const htmlCompleto = `<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>PEI - ${alunoNomeAtual}</title>
    <style>
        body {
            font-family: 'Times New Roman', Arial, sans-serif;
            margin: 2.54cm;
            line-height: 1.5;
            font-size: 12pt;
        }
        h1 {
            color: #1e3a5f;
            text-align: center;
            font-size: 18pt;
            margin-bottom: 30px;
        }
        .cabecalho {
            margin-bottom: 30px;
            border-bottom: 2px solid #3b82f6;
            padding-bottom: 10px;
        }
        .aluno-info {
            background: #f0f4f8;
            padding: 10px;
            margin-bottom: 20px;
            border-left: 4px solid #3b82f6;
        }
        .conteudo {
            margin-top: 20px;
        }
        .conteudo strong {
            color: #1e3a5f;
            font-size: 13pt;
            display: block;
            margin-top: 15px;
            margin-bottom: 10px;
        }
        .rodape {
            margin-top: 50px;
            text-align: center;
            font-size: 10pt;
            color: #666;
            border-top: 1px solid #ccc;
            padding-top: 20px;
        }
        ul, ol {
            margin-left: 20px;
        }
        li {
            margin-bottom: 5px;
        }
    </style>
</head>
<body>
    <h1>${titulo}</h1>
    <div class="cabecalho"></div>
    <div class="aluno-info">
        <strong>${aluno}</strong><br>
        ${data}
    </div>
    <div class="conteudo">
        ${rascunhoTECO.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')}
    </div>
    <div class="rodape">
        ${rodape}
    </div>
</body>
</html>`;
    
    const blob = new Blob([htmlCompleto], { type: 'application/msword' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `PEI_${alunoNomeAtual.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

function gerarDocumentoTxt() {
    const cabecalho = `========================================\n`;
    const titulo = `PLANO DE ENSINO INDIVIDUALIZADO (PEI)\n`;
    const linha = `========================================\n\n`;
    const aluno = `Aluno: ${alunoNomeAtual}\n`;
    const nivel = `Nível de Suporte: ${alunoNivelAtual}\n`;
    const hiperfoco = `Hiperfoco: ${alunoHiperfocoAtual}\n`;
    const data = `Data de Geração: ${new Date().toLocaleString('pt-BR')}\n`;
    const separador = `\n----------------------------------------\n\n`;
    const rodape = `\n\n========================================\nDocumento gerado pelo sistema InclusãoIA\nPlataforma de Apoio à Educação Inclusiva\n========================================`;
    
    let conteudoTexto = limparHTMLdoTexto(rascunhoTECO);
    
    const textoCompleto = cabecalho + titulo + linha + aluno + nivel + hiperfoco + data + separador + conteudoTexto + rodape;
    
    const blob = new Blob([textoCompleto], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.href = url;
    link.download = `PEI_${alunoNomeAtual.replace(/[^a-zA-Z0-9]/g, '_')}_${new Date().toISOString().slice(0,19).replace(/:/g, '-')}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
}

async function testarConexaoIA() {
    chatBox.innerHTML += `<p><strong>🔧 Sistema:</strong> Verificando conexão com Gemini...</p>`;
    const resultado = await testarIA();
    if (resultado.sucesso) {
        chatBox.innerHTML += `<p style="color: var(--verde-sucesso);"><strong>✅ Sistema:</strong> Gemini conectado e funcionando!</p>`;
    } else {
        chatBox.innerHTML += `<p style="color: var(--vermelho-alerta);"><strong>❌ Sistema:</strong> ${resultado.erro}<br><small>Verifique sua chave em https://aistudio.google.com/apikey</small></p>`;
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

async function carregarAlunos() {
    const { data, error } = await supabase.from('alunos_anonimos').select('*');
    if (error) {
        console.error("Erro ao buscar alunos:", error);
        return;
    }
    if (data) {
        selectAlunos.innerHTML = '<option value="">-- Selecione o Aluno --</option>';
        data.forEach(a => {
            selectAlunos.innerHTML += `<option value="${a.id}" data-nivel="${a.nivel_suporte_tea}" data-hiperfoco="${a.hiperfoco_interesses}">${a.codigo_identificador}</option>`;
        });
    }
}

carregarAlunos();
testarConexaoIA();

selectAlunos.addEventListener('change', () => {
    const selected = selectAlunos.options[selectAlunos.selectedIndex];
    if (selectAlunos.value) {
        alunoNomeAtual = selected.text;
        alunoNivelAtual = selected.dataset.nivel || 'Não informado';
        alunoHiperfocoAtual = selected.dataset.hiperfoco || 'Não informado';
    }
});

document.getElementById('form-chat-ia').addEventListener('submit', async (e) => {
    e.preventDefault();
    const alunoSelecionado = selectAlunos.options[selectAlunos.selectedIndex];
    if (!selectAlunos.value) return alert("Por favor, escolha um aluno antes de consultar a inteligência artificial.");

    const input = document.getElementById('mensagem-usuario');
    const txt = input.value;

    if (!txt.trim()) return alert("Por favor, digite um relato sobre o aluno.");

    chatBox.innerHTML += `<div style="margin: 10px 0; padding: 10px; background: #e2e8f0; border-radius: 8px;">
        <strong>👨‍🏫 Você (Professor):</strong><br>${txt}
    </div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
    input.value = "";

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Processando Análise...";

    const contextoAluno = `Nível de Suporte: ${alunoSelecionado.dataset.nivel} | Hiperfoco: ${alunoSelecionado.dataset.hiperfoco}`;
    
    const promptSistema = `Você é um psicopedagogo especialista em TEA. Transforme o relato do professor em diretrizes técnicas completas para o Plano de Ensino Individualizado (PEI).

Contexto do Aluno: ${contextoAluno}
Relato do comportamento observável: ${txt}

Por favor, estruture a resposta completa com estes 4 tópicos principais:

**1. MANEJO AMBIENTAL E SENSORIAL**
(Descreva adaptações do ambiente físico e estratégias sensoriais)

**2. ADAPTAÇÕES PEDAGÓGICAS**
(Descreva modificações curriculares, de materiais e metodologias)

**3. ESTRATÉGIAS DE COMUNICAÇÃO**
(Descreva como se comunicar efetivamente com o aluno)

**4. METAS PARA O BIMESTRE**
(Descreva objetivos específicos e mensuráveis)

Seja detalhado e prático, foque em estratégias aplicáveis imediatamente em sala de aula.`;

    try {
        const respostaIA = await chamarGemini(promptSistema, 0.7);
        rascunhoTECO = respostaIA;

        let respostaFormatada = respostaIA;
        
        respostaFormatada = respostaFormatada
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/\n/g, '<br>')
            .replace(/^# (.*?)$/gm, '<h3>$1</h3>')
            .replace(/^## (.*?)$/gm, '<h4>$1</h4>')
            .replace(/^### (.*?)$/gm, '<h5>$1</h5>')
            .replace(/^\- (.*?)$/gm, '• $1<br>')
            .replace(/^\d+\. (.*?)$/gm, '<br><strong>$1</strong><br>');
        
        const peiCompleto = `
            <div style="font-family: 'Segoe UI', Arial, sans-serif; width: 100%;">
                ${respostaFormatada}
            </div>
        `;
        
        peiView.innerHTML = peiCompleto;
        peiView.scrollTop = 0;
        
        chatBox.innerHTML += `<div style="margin: 10px 0; padding: 10px; background: #dbeafe; border-radius: 8px; border-left: 4px solid var(--azul-suporte);">
            <strong>🤖 InclusãoIA (Gemini):</strong><br>✅ Diretrizes técnicas geradas com sucesso!
        </div>`;
        
        btnGravar.style.display = "block";
        btnVerCompleto.style.display = "block";
        btnDownloadDocx.style.display = "block";
        btnDownloadTxt.style.display = "block";
        
    } catch (erro) {
        console.error(erro);
        chatBox.innerHTML += `<div style="margin: 10px 0; padding: 10px; background: #fee; border-radius: 8px; border-left: 4px solid var(--vermelho-alerta);">
            <strong>❌ Erro na IA:</strong> ${erro.message}
        </div>`;
        peiView.innerHTML = `<p style="color: red;">❌ Erro ao gerar PEI: ${erro.message}</p>`;
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Analisar";
        chatBox.scrollTop = chatBox.scrollHeight;
    }
});

btnGravar.addEventListener('click', async () => {
    if (!rascunhoTECO) {
        alert("⚠️ Nenhum PEI gerado para salvar!");
        return;
    }
    
    const { error } = await supabase.from('peis_gerados').insert([{
        aluno_id: selectAlunos.value,
        relato_inicial_simples: "PEI gerado pelo chat",
        pei_tecnico_ia: rascunhoTECO,
        data_criacao: new Date().toISOString()
    }]);

    const statusDb = document.getElementById('status-db');
    if (!error) {
        statusDb.style.color = "var(--verde-sucesso)";
        statusDb.innerHTML = "✅ Plano gravado com sucesso no prontuário!";
        setTimeout(() => {
            btnGravar.style.display = "none";
        }, 2000);
    } else {
        statusDb.style.color = "var(--vermelho-alerta)";
        statusDb.innerHTML = "❌ Erro ao salvar: " + error.message;
    }
    
    setTimeout(() => {
        statusDb.innerHTML = "";
    }, 5000);
});

btnVerCompleto.addEventListener('click', abrirJanelaCompleta);
btnDownloadDocx.addEventListener('click', gerarDocumentoWord);
btnDownloadTxt.addEventListener('click', gerarDocumentoTxt);