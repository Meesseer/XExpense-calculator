import React, { useEffect } from "react";
import styles from "./Home.module.css";
import Card from "../Components/Card/Card";
import { useState } from "react";
import PieChartComponent from "../Components/Piechart/Piechart";
import TransactionList from "../Components/TransactionList/TransactionList";
import Modal from "../Components/Modal/Modal";
import AddBalanceForm from "../Components/Forms/AddBalanceForm";
import ExpenseForm from "../Components/Forms/ExpenseForm";
import BarChart from "../Components/BarChart/BarChart";

function Home() {
  const [balance, setBalance] = useState(0);
  const [isOpenExpense, setIsOpenExpense] = useState(false);
  const [isOpenBalance, setIsOpenBalance] = useState(false);
  const [expenseList, setExpenseList] = useState([]);
  const [isMounted, setIsMounted] = useState(false);
  const [categorySpends, setCategorySpends] = useState({
    foodSpends: 0,
    entertainmentSpends: 0,
    travelSpends: 0,
  });

  const [categoryCount, setCategoryCount] = useState({
    foodCount: 0,
    entertainment: 0,
    travelCount: 0,
  });

  const expense = expenseList.reduce(
    (accumulator, currentValue) => accumulator + Number(currentValue.price),
    0
  );

  useEffect(() => {
    const newCategorySpends = {
      foodSpends: 0,
      entertainmentSpends: 0,
      travelSpends: 0,
    };
    const newCategoryCount = {
      foodCount: 0,
      entertainmentCount: 0,
      travelCount: 0,
    };

    expenseList.forEach((item) => {
      if (item.category === "food") {
        newCategorySpends.foodSpends += Number(item.price);
        newCategoryCount.foodCount++;
      } else if (item.category === "entertainment") {
        newCategorySpends.entertainmentSpends += Number(item.price);
        newCategoryCount.entertainmentCount++;
      } else if (item.category === "travel") {
        newCategorySpends.travelSpends += Number(item.price);
        newCategoryCount.travelCount++;
      }
    });
    setCategorySpends(newCategorySpends);
    setCategoryCount(newCategoryCount);
  }, [expenseList]);

  useEffect(() => {
    const myBalance = localStorage.getItem("balance");
    if (myBalance) {
      setBalance(Number(myBalance));
    } else {
      setBalance("5000");
      localStorage.setItem("balance", 5000);
    }
  }, []);

  useEffect(() => {
    if (expenseList.length > 0 || isMounted) {
      localStorage.setItem("expenses", JSON.stringify(expenseList));
    }
  }, [expenseList]);

  useEffect(() => {
    if (isMounted) {
      localStorage.setItem("expenses", JSON.stringify(expenseList));
    } else {
      setIsMounted(true);
    }
  }, [expenseList]);

  return (
    <div className={styles.container}>
      <h1>Expense Tracker</h1>

      <div className={styles.cardsWrapper}>
        <Card
          title="Wallet Balance"
          money={balance}
          buttonText="+ Add Income"
          buttonType="success"
          handleClick={() => {
            setIsOpenBalance(true);
          }}
        />

        <Card
          title="Expenses"
          money={expense}
          buttonText="+ Add Expense"
          buttonType="failure"
          success={false}
          handleClick={() => {
            setIsOpenExpense(true);
          }}
        />

        <PieChartComponent
          data={[
            { name: "Food", value: categorySpends.foodSpends },
            { name: "Entertainment", value: categorySpends.entertainmentSpends },
            { name: "Travel", value: categorySpends.travelSpends },
          ]}
        />
      </div>

      <div className={styles.transactionsWrapper}>
        <TransactionList
          transactions={expenseList}
          editTransactions={setExpenseList}
          title="Recent Transactions"
          balance={balance}
          setBalance={setBalance}
        />

        <BarChart
          data={[
            { name: "Food", value: categoryCount.foodCount },
            { name: "Entertainment", value: categoryCount.entertainmentCount },
            { name: "Travel", value: categoryCount.travelCount },
          ]}
        />
      </div>

      <Modal isOpen={isOpenExpense} setIsOpen={setIsOpenExpense}>
        <ExpenseForm
          setIsOpen={setIsOpenExpense}
          expenseList={expenseList}
          setExpenseList={setExpenseList}
          setBalance={setBalance}
          balance={balance}
        />
      </Modal>

      <Modal isOpen={isOpenBalance} setIsOpen={setIsOpenBalance}>
        <AddBalanceForm setIsOpen={setIsOpenBalance} setBalance={setBalance} />
      </Modal>
    </div>
  );
}

export default Home;
