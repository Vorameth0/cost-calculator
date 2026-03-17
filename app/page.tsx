"use client";

import { useState } from "react";
import * as XLSX from "xlsx";

export default function Home() {

  const [rows, setRows] = useState([
    { name: "", price: "", total: "", used: "", cost: 0 }
  ]);

  function update(index:number, field:string, value:string){

    const newRows:any = [...rows];
    newRows[index][field] = value;

    const price = Number(newRows[index].price);
    const total = Number(newRows[index].total);
    const used = Number(newRows[index].used);

    if(price && total && used){
      newRows[index].cost = (price / total) * used;
    }

    setRows(newRows);
  }

  function addRow(){
    setRows([
      ...rows,
      { name:"", price:"", total:"", used:"", cost:0 }
    ]);
  }

  function deleteRow(index:number){
    const newRows = rows.filter((_,i)=> i !== index);
    setRows(newRows);
  }

  function totalCost(){
    return rows.reduce((sum,r)=> sum + Number(r.cost),0);
  }

  // 🔥 Detect mobile
  function isMobile(){
    return /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  }

  // 📊 Excel (PC)
  function exportExcel(){

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, "Cost");

    XLSX.writeFile(workbook, "ingredient_cost.xlsx");
  }

  // 📱 CSV (Mobile)
  function exportCSV(){

    const header = ["Ingredient","Price","Total g","Used g","Cost"];

    const rowsData = rows.map(r => [
      r.name,
      r.price,
      r.total,
      r.used,
      r.cost.toFixed(2)
    ]);

    const csvContent =
      [header, ...rowsData]
        .map(e => e.join(","))
        .join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });

    const url = window.URL.createObjectURL(blob);

    window.open(url);
  }

  // 🔥 Smart Export
  function handleExport(){
    if(isMobile()){
      exportCSV();
    } else {
      exportExcel();
    }
  }

  return (

<div className="min-h-screen bg-gray-100 flex flex-col items-center pt-12 px-4">

<h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-8 text-center">
Ingredient Cost Calculator
</h1>

<div className="bg-white rounded-xl shadow-md w-full max-w-6xl p-4 sm:p-8">

{/* DESKTOP TABLE */}

<div className="hidden md:block">

<table className="w-full text-left">

<thead>

<tr className="bg-gray-200 text-gray-700">

<th className="p-4">Ingredient</th>
<th className="p-4">Price</th>
<th className="p-4">Total g</th>
<th className="p-4">Used g</th>
<th className="p-4 text-right">Cost</th>
<th className="p-4"></th>

</tr>

</thead>

<tbody>

{rows.map((row,i)=>(
<tr key={i} className="border-b">

<td className="p-3">

<div className="flex items-center gap-3">

<span className="text-gray-500 font-medium w-14">
No.{i+1}
</span>

<input
className="border rounded px-3 py-2 w-full"
value={row.name}
onChange={(e)=>update(i,"name",e.target.value)}
/>

</div>

</td>

<td className="p-3">
<input
type="number"
className="border rounded px-3 py-2 w-full"
value={row.price}
onChange={(e)=>update(i,"price",e.target.value)}
/>
</td>

<td className="p-3">
<input
type="number"
className="border rounded px-3 py-2 w-full"
value={row.total}
onChange={(e)=>update(i,"total",e.target.value)}
/>
</td>

<td className="p-3">
<input
type="number"
className="border rounded px-3 py-2 w-full"
value={row.used}
onChange={(e)=>update(i,"used",e.target.value)}
/>
</td>

<td className="p-3 text-right font-bold text-green-700">
{row.cost.toFixed(2)} ฿
</td>

<td className="p-3 text-right">
<button
onClick={()=>deleteRow(i)}
className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded-lg"
>
🗑
</button>
</td>

</tr>
))}

</tbody>

</table>

</div>

{/* MOBILE */}

<div className="md:hidden space-y-4">

{rows.map((row,i)=>(

<div key={i} className="border rounded-lg p-4 bg-gray-50 space-y-3">

<p className="text-gray-500 font-medium">
No.{i+1}
</p>

<input
className="border rounded px-3 py-2 w-full"
placeholder="Ingredient"
value={row.name}
onChange={(e)=>update(i,"name",e.target.value)}
/>

<input
type="number"
className="border rounded px-3 py-2 w-full"
placeholder="Price"
value={row.price}
onChange={(e)=>update(i,"price",e.target.value)}
/>

<input
type="number"
className="border rounded px-3 py-2 w-full"
placeholder="Total g"
value={row.total}
onChange={(e)=>update(i,"total",e.target.value)}
/>

<input
type="number"
className="border rounded px-3 py-2 w-full"
placeholder="Used g"
value={row.used}
onChange={(e)=>update(i,"used",e.target.value)}
/>

<div className="flex justify-between items-center">

<p className="font-bold text-green-700 text-lg">
{row.cost.toFixed(2)} ฿
</p>

<button
onClick={()=>deleteRow(i)}
className="bg-red-500 text-white px-3 py-2 rounded-lg"
>
Delete
</button>

</div>

</div>

))}

</div>

{/* BOTTOM */}

<div className="flex flex-col sm:flex-row items-center justify-between mt-8 gap-4">

<div className="text-center sm:text-left">

<p className="text-gray-500 text-sm">
Total Cost
</p>

<p className="text-2xl sm:text-3xl font-bold text-green-700">
{totalCost().toFixed(2)} ฿
</p>

</div>

<div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">

<button
onClick={addRow}
className="bg-orange-500 text-white px-6 py-2 rounded-lg w-full sm:w-auto"
>
+ Add Ingredient
</button>

<button
onClick={handleExport}
className="bg-green-600 text-white px-6 py-2 rounded-lg w-full sm:w-auto"
>
Download File
</button>

</div>

</div>

</div>

</div>

  );
}