import React from 'react'
import styles from "./TransactionList.module.css";
import TransactionCard from '../TransactionCard/TransactionCard';
import { useState  } from 'react';
import { useEffect } from 'react';
import Pagination from '../Pagination/Pagination';
import Modal from '../Modal/Modal';
import ExpenseForm from '../Forms/ExpenseForm';

function TransactionList({
    transactions,
    title,
    editTransactions,
    balance,
    setBalance,
  }){
    const [currentPage, setCurrentPage] = useState(1);
    const [currentTransactions, setCurrentTransactions] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const maximumRecords = 3
    const [changeId, setChangeId] = useState(0);
    const [editor, setEditor] = useState(false);


    const handleDelete =(id) =>{
      const item = transactions.find((e) => e.id === id);
      const price = Number(item.price);
      setBalance((prev) => prev + price);
  
      editTransactions((prev) => prev.filter((item) => item.id !== id));
    }
    const handleEdit = (id) =>{
      setChangeId(id);
      setEditor(true);
    }

    useEffect(() => {
      const startIndex = (currentPage - 1) * maximumRecords;
      const endIndex = Math.min(currentPage * maximumRecords, transactions.length);
  
      setCurrentTransactions([...transactions].slice(startIndex, endIndex));
      setTotalPages(Math.ceil(transactions.length / maximumRecords)); 
    }, [currentPage, transactions]);
    useEffect(() => {
      if (totalPages < currentPage && currentPage > 1) {
        setCurrentPage((prev) => prev - 1);
      }
    }, [totalPages]);


  return (
    <div className={styles.transactionsWrapper}>
    {title && <h2>{title}</h2>}

    {transactions.length > 0 ? (
      <div className={styles.list}>
        <div>
          {currentTransactions.map((transaction) => (
            <TransactionCard
              details={transaction}
              key={transaction.id}
              handleDelete={() => handleDelete(transaction.id)}
              handleEdit={() => handleEdit(transaction.id)}
            />
          ))}
        </div>
        {totalPages > 1 && (
          <Pagination
            updatePage={setCurrentPage}
            currentPage={currentPage}
            totalPages={totalPages}
          />
        )}
      </div>
    ) : (
      <div className={styles.emptyTransactionsWrapper}>
        <p>No transactions!</p>
      </div>
    )}
      <Modal isOpen={editor} setIsOpen={setEditor}>
        <ExpenseForm
          editId={changeId}
          expenseList={transactions}
          setExpenseList={editTransactions}
          setIsOpen={setEditor}
          balance={balance}
          setBalance={setBalance}
        />
      </Modal>
</div>
 )}
export default TransactionList;