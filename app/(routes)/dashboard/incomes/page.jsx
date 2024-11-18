import React from "react";
import IncomeList from "./_components/IncomeList";
import EditIncome from "./_components/EditIncome";
function Income() {
  return (
    <div className="p-10">
      <h2 className="font-bold text-3xl">My Income Streams</h2>
      <IncomeList />
      
    </div>
  );
}

export default Income;
