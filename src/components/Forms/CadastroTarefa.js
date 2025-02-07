import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'; 
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from './StyleForms.module.css'; 

const CadastroTarefa = ({projectId}) => {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    console.log(projectId)
    if (!projectId) {
      toast.error('Project ID não encontrado!');
    }
  }, [projectId]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const tarefa = { titulo, descricao, status: "Não Iniciado", projetoId: projectId }; 

    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/tarefas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tarefa),
      });

      setLoading(false);

      if (response.ok) {
        toast.success('Tarefa criada com sucesso!');
        setTitulo('');
        setDescricao('');
      } else {
        toast.error('Erro ao criar tarefa.');
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
            <label htmlFor="titulo">Título</label>
            <input
              type="text"
              id="titulo"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
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
              {loading ? 'Carregando...' : 'Criar tarefa'}
            </button>
          </div>
        </form>
      </div>

      <ToastContainer />
    </div>
  );
};

export default CadastroTarefa;
