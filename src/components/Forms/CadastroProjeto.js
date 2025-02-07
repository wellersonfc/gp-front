import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import styles from './StyleForms.module.css';

const CadastroProjeto = () => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [dateinicio, setDateinicio] = useState(new Date().toISOString().split('T')[0]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const projeto = { nome, descricao, dateinicio};
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/projetos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(projeto),
      });
      const data = await response.json();
      setLoading(false);

      if (response.ok) {
        toast.success('Projeto criado com sucesso!');

        // Limpa os campos
        setNome('');
        setDescricao('');
        setDateinicio(new Date().toISOString().split('T')[0]);
  
        setTimeout(() => {
          navigate(`/tarefas/${data.id}`);
          setTimeout(() => {
            window.dispatchEvent(new Event('fecharModal')); 
          }, 100); 
        }, 2000); 
      } else {
        toast.error('Erro ao criar projeto.');
      }
    } catch (error) {
      setLoading(false);
      toast.error('Erro de conexão, tente novamente mais tarde.');
    }
  };

  return (
    <div className="form-container">
      <div className="card">
        <form onSubmit={handleSubmit} className="form">
          <div className={styles['input-group']}>
            <label htmlFor="nome">Nome</label>
            <input
              type="text"
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              required
            />
          </div>
          <div className={styles['input-group']}>
            <label htmlFor="dateinicio">Data do inicio do Projeto</label>
            <input
              type="date"
              id="dateinicio"
              value={dateinicio}
              onChange={(e) => setDateinicio(e.target.value)}
              required
            />
          </div>
          <div className={styles['input-group']}>
            <label htmlFor="descricao">Descrição</label>
            <textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              required
            ></textarea>
          </div>
          <div className="submit-button-container">
            <button type="submit" className={styles['submit-button']} disabled={loading}>
              {loading ? 'Carregando...' : 'Criar Projeto'}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default CadastroProjeto;