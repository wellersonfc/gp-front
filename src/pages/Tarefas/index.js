import React, { useState, useEffect } from 'react';
import styles from './Tarefas.module.css';
import { useParams } from "react-router-dom";
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import Modal from '../../components/Modal';
import { formatarData, formatarDataConclusao } from '../../utils';

const Home = () => {
  const [tarefas, setTarefas] = useState([]);
  const { projetoid } = useParams();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => {
    console.log(`fechamos`)
    setIsModalOpen(false);
    fetchTarefas();
  }
  const [projeto, setProjeto] = useState([]);

  const fetchTarefas = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/tarefas?page=1&limit=15&projetoId=${projetoid}`);
      if (Array.isArray(response.data)) {
        setTarefas(response.data);
        console.log(response.data)
        /*if (response.data.length === 0) {
          toast.info("Ainda não possui tarefas.");
        }*/
      } else {
        toast.error("A resposta da API não é uma lista válida de tarefas.");
      }
    } catch (error) {
      toast.error("Erro ao buscar tarefas.");
    }
  };

  useEffect(() => {
    fetchTarefas();
    buscarProjeto();
    console.log(`cheguei aqui`);
    //handleCloseModal();
  }, [projetoid]);

  const buscarProjeto = async () => {
    try {
      const response = await axios.get(`http://localhost:3001/api/projetos/${projetoid}`);
      setProjeto(response.data);
    } catch (error) {
      toast.error("Erro ao carregar projeto.");
    }
  };

  const concluirTarefa = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/tarefas/concluir/${id}`);
      fetchTarefas();
      toast.success("Tarefa concluída.");
    } catch (error) {
      toast.error("Erro ao concluir tarefa.");
    }
  };

  const removerTarefa = async (id) => {
    try {
      await axios.delete(`http://localhost:3001/api/tarefas/${id}`);
      fetchTarefas();
      toast.success("Tarefa removida.");
    } catch (error) {
      toast.error("Erro ao remover tarefa.");
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case 'Em Andamento':
        return styles['status-em-andamento'];
      case 'Não Iniciado':
        return styles['status-nao-iniciado'];
      case 'concluída':
        return styles['status-concluido'];
      default:
        return '';
    }
  };

  return (
    <div className={styles.home}>
      <header className={styles.header}>
        <h2>✔️ Tarefas do projeto - {projeto.nome}</h2>
        <p>{projeto.descricao}</p>
        <p className={styles.dateinicio}>{formatarDataConclusao(projeto.dateinicio)}</p>
      </header>
      <hr className={styles.separator} />
      <div className={styles['controls']}>
        <button onClick={handleOpenModal} className={styles['btn-add']}>Adicionar</button>
        <Modal 
          isOpen={isModalOpen} 
          onClose={handleCloseModal} 
          title="✏️ Cadastrar Tarefas" 
          formType={2}
          projectId={projetoid} 
        />
      </div>
      <div className={styles['task-container']}>
        {tarefas.length === 0 ? (
          <div className={styles['no-tasks']}>Ainda não possui tarefas.</div>
        ) : (
          tarefas.map(tarefa => (
            <div key={tarefa.id} className={styles['task-row']}>
              <div className={styles['task-info']}>
                <span>{tarefa.titulo}</span>
                <span>{formatarData(tarefa.data_criacao)}</span>
                <span className={`${styles.status} ${getStatusClass(tarefa.status)}`}>{tarefa.status}</span>
              </div>
              <div className={styles['task-actions']}>
                {tarefa.status !== 'concluída' && (
                  <button onClick={() => concluirTarefa(tarefa.id)} className={styles.btnconcluido}>Concluir</button>
                )}
                <button onClick={() => removerTarefa(tarefa.id)} className={styles.btnremover}>Remover</button>
              </div>
              <div className={styles['task-details']}>
                <p><strong>Descrição:</strong> {tarefa.descricao}</p>
                <p><strong>Data Criação:</strong> {formatarData(tarefa.data_criacao)}</p>
                <p>
                  <strong>Data Conclusão:</strong> 
                  {tarefa.data_conclusao ? formatarDataConclusao(tarefa.data_conclusao) : null}
                </p>
                <p><strong>Status:</strong> {tarefa.status}</p>
              </div>
            </div>
          ))
        )}
      </div>
      <ToastContainer />
    </div>
  );
};

export default Home;