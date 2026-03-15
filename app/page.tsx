"use client";

import { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

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

  function exportExcel(){

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook,worksheet,"Cost");

    const excelBuffer = XLSX.write(workbook,{
      bookType:"xlsx",
      type:"array"
    });

    const data = new Blob([excelBuffer],{
      type:"application/octet-stream"
    });

    saveAs(data,"ingredient_cost.xlsx");
  }

  return (

<div className="min-h-screen bg-[#f4f4f4] flex flex-col items-center pt-20">

<h1 className="text-4xl font-bold text-gray-800 mb-8">
Ingredient Cost Calculator
</h1>

<div className="bg-white rounded-xl shadow-md w-[950px] p-8">

<table className="w-full text-left">

<thead>

<tr className="bg-gray-100 text-gray-700 text-lg">

<th className="p-4 rounded-l-lg">Ingredient</th>
<th className="p-4">Price (฿)</th>
<th className="p-4">Total g</th>
<th className="p-4">Used g</th>
<th className="p-4 text-right">Cost</th>
<th className="p-4 rounded-r-lg"></th>

</tr>

</thead>

<tbody>

{rows.map((row,i)=>(
<tr key={i} className="border-b hover:bg-gray-50">

<td className="p-3">

<input
className="border border-gray-300 rounded-lg px-3 py-2 w-full"
placeholder="Butter"
value={row.name}
onChange={(e)=>update(i,"name",e.target.value)}
/>

</td>

<td className="p-3">

<input
type="number"
className="border border-gray-300 rounded-lg px-3 py-2 w-full"
placeholder="200"
value={row.price}
onChange={(e)=>update(i,"price",e.target.value)}
/>

</td>

<td className="p-3">

<input
type="number"
className="border border-gray-300 rounded-lg px-3 py-2 w-full"
placeholder="500"
value={row.total}
onChange={(e)=>update(i,"total",e.target.value)}
/>

</td>

<td className="p-3">

<input
type="number"
className="border border-gray-300 rounded-lg px-3 py-2 w-full"
placeholder="150"
value={row.used}
onChange={(e)=>update(i,"used",e.target.value)}
/>

</td>

<td className="p-3 text-right font-bold text-green-700 text-lg">

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

<div className="flex items-center justify-between mt-10">

<div>

<p className="text-gray-500 text-sm">
Total Cost
</p>

<p className="text-3xl font-bold text-green-700">
{totalCost().toFixed(2)} ฿
</p>

</div>

<div className="flex gap-4">

<button
onClick={addRow}
className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 rounded-lg font-medium"
>
+ Add Ingredient
</button>

<button
onClick={exportExcel}
className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium"
>
Export Excel
</button>

</div>

</div>

</div>

</div>

  );
}